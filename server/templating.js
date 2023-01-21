const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const url = require("url");
const accept_language_parser = require("accept-language-parser");
const client_config = require("./client_configuration");

/**
 * Associations from language to translation dictionnaries
 * @const
 * @type {object}
 */
const TRANSLATIONS = JSON.parse(
  fs.readFileSync(path.join(__dirname, "translations.json"))
);
const languages = Object.keys(TRANSLATIONS);

handlebars.registerHelper({
  json: JSON.stringify.bind(JSON),
});

handlebars.registerHelper("ifCond", function (v1, operator, v2, options) {
  switch (operator) {
    case "==":
      return v1 == v2 ? options.fn(this) : options.inverse(this);
    case "===":
      return v1 === v2 ? options.fn(this) : options.inverse(this);
    case "!=":
      return v1 != v2 ? options.fn(this) : options.inverse(this);
    case "!==":
      return v1 !== v2 ? options.fn(this) : options.inverse(this);
    case "<":
      return v1 < v2 ? options.fn(this) : options.inverse(this);
    case "<=":
      return v1 <= v2 ? options.fn(this) : options.inverse(this);
    case ">":
      return v1 > v2 ? options.fn(this) : options.inverse(this);
    case ">=":
      return v1 >= v2 ? options.fn(this) : options.inverse(this);
    case "&&":
      return v1 && v2 ? options.fn(this) : options.inverse(this);
    case "||":
      return v1 || v2 ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});

function findBaseUrl(req) {
  var proto =
    req.headers["X-Forwarded-Proto"] ||
    (req.connection.encrypted ? "https" : "http");
  var host = req.headers["X-Forwarded-Host"] || req.headers.host;
  return proto + "://" + host;
}

class Template {
  constructor(path) {
    const contents = fs.readFileSync(path, { encoding: "utf8" });
    this.template = handlebars.compile(contents);
  }
  parameters(parsedUrl, request, role) {
    const accept_language_str =
      parsedUrl.query.lang || request.headers["accept-language"];
    const accept_languages = accept_language_parser.parse(accept_language_str);
    const opts = { loose: true };
    let language =
      accept_language_parser.pick(languages, accept_languages, opts) || "en";
    // The loose matcher returns the first language that partially matches, so we need to
    // check if the preferred language is supported to return it
    if (accept_languages.length > 0) {
      const preferred_language =
        accept_languages[0].code + "-" + accept_languages[0].region;
      if (languages.includes(preferred_language)) {
        language = preferred_language;
      }
    }
    const translations = TRANSLATIONS[language] || {};
    const configuration = client_config || {};
    const prefix = request.url.split("/boards/")[0].substr(1);
    const baseUrl = findBaseUrl(request) + (prefix ? prefix + "/" : "");
    const moderator = role === "moderator";
    const editor = role === "editor";
    const viewer = role === "viewer";
    const owner = role === "owner";
    return {
      baseUrl,
      languages,
      language,
      translations,
      configuration,
      moderator,
      editor,
      viewer,
      owner,
    };
  }
  serve(request, response, role) {
    const parsedUrl = url.parse(request.url, true);
    const parameters = this.parameters(parsedUrl, request, role);
    var body = this.template(parameters);
    var headers = {
      "Content-Length": Buffer.byteLength(body),
      "Content-Type": "text/html",
      "Cache-Control": "public, max-age=3600",
    };
    if (!parsedUrl.query.lang) {
      headers["Vary"] = "Accept-Language";
    }
    response.writeHead(200, headers);
    response.end(body);
  }
}

class BoardTemplate extends Template {
  parameters(parsedUrl, request, role) {
    const params = super.parameters(parsedUrl, request, role);
    const parts = parsedUrl.pathname.split("boards/", 2);
    const boardUriComponent = parts[1];
    params["boardUriComponent"] = boardUriComponent;
    params["board"] = decodeURIComponent(boardUriComponent);
    params["hideMenu"] = parsedUrl.query.hideMenu == "true" || false;
    return params;
  }
}

module.exports = { Template, BoardTemplate };
