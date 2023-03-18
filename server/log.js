const config = require("./configuration.js"),
  SDC = require("statsd-client"),
  axios = require("axios");

const userActivityLogs = new Map();

/**
 * Parse a statsd connection string
 * @param {string} url
 * @returns {SDC.TcpOptions|SDC.UdpOptions}
 */
function parse_statsd_url(url) {
  const regex = /^(tcp|udp|statsd):\/\/(.*):(\d+)$/;
  const match = url.match(regex);
  if (!match)
    throw new Error("Invalid statsd connection string, doesn't match " + regex);
  const [_, protocol, host, port_str] = match;
  const tcp = protocol === "tcp";
  const port = parseInt(port_str);
  return { tcp, host, port, prefix: "wbo" };
}

/**
 * Statsd client to which metrics will be reported
 * @type {SDC | null}
 * */
let statsd = null;

if (config.STATSD_URL) {
  const options = parse_statsd_url(config.STATSD_URL);
  console.log("Exposing metrics on statsd server: " + JSON.stringify(options));
  statsd = new SDC(options);
}

if (statsd) {
  setInterval(function reportHealth() {
    statsd.gauge("memory", process.memoryUsage().heapUsed);
  }, 30 * 1000);
}

/**
 * Add a message to the logs
 * @param {string} type
 * @param {any} infos
 */
function log(type, infos) {
  var msg = type;
  if (infos) msg += "\t" + JSON.stringify(infos);
  if (statsd) {
    let stat_name = type;
    if (infos.board) stat_name += "." + infos.board;
    statsd.increment(stat_name);
  }
  console.log(msg);
}

/**
 * @template {(...args) => any} F
 * @param {F} f
 * @returns {F}
 */
function monitorFunction(f) {
  if (!statsd) {
    return f;
  }
  let client = statsd.getChildClient(f.name);
  return function () {
    let startTime = new Date();
    try {
      const result = f.apply(null, arguments);
      client.increment("ok", 1);
      return result;
    } catch (e) {
      client.increment("err", 1);
      throw e;
    } finally {
      client.timing("time", startTime);
    }
  };
}

/**
 * Report a number
 * @param {string} name
 * @param {number} value
 * @param {{[name:string]: string}=} tags
 */
function gauge(name, value, tags) {
  if (statsd) statsd.gauge(name, value, tags);
}

function logUserActivity(userId, boardName, activityType = "disconnected") {
  if (!userActivityLogs.has(boardName)) {
    userActivityLogs.set(boardName, []);
  }
  const userActivity = userActivityLogs.get(boardName);
  userActivity.push({
    userid: userId,
    activitytype: activityType,
    timestamp: Date.now(),
  });
}

/*
 * Turn the map<String, Object> to an Object so it can be converted to JSON
 */
function mapToObj(inputMap) {
  let obj = {};

  inputMap.forEach(function (value, key) {
    obj[key] = value;
  });

  return obj;
}

setInterval(async function writeLogsToDatabase() {
  if (userActivityLogs.size > 0) {
    const userActivityObject = mapToObj(userActivityLogs);
    try {
      await axios.put(
        "http://board:3000/api/v1/board/logs/write",
        userActivityObject
      );
      userActivityLogs.clear();
    } catch (error) {
      console.log(error);
    }
  }
}, 1000 * 60);

module.exports = { log, gauge, monitorFunction, logUserActivity };
