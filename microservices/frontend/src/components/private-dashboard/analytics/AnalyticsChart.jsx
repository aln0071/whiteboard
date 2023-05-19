import * as React from "react";
import Chart from "react-apexcharts";

export default function AnalyticsChart({ data }) {
  const mainUserObjects = {};
  const userActivities = {};
  data.forEach(({ userid, activitytype, timestamp }) => {
    if (mainUserObjects[userid] === undefined) {
      mainUserObjects[userid] = {
        name: userid,
        data: [],
      };
    }
    if (activitytype === "joinboard") {
      if (userActivities[userid] === undefined) {
        userActivities[userid] = {
          x: userid,
          y: [timestamp.getTime()],
        };
      }
    } else if (activitytype === "disconnection") {
      if (userActivities[userid] !== undefined) {
        userActivities[userid].y.push(timestamp.getTime());
        mainUserObjects[userid].data.push(userActivities[userid]);
        delete userActivities[userid];
      }
    }
  });
  Object.values(userActivities).forEach((activity) => {
    activity.y.push(Date.now());
    mainUserObjects[activity.x].data.push(activity);
  });
  const series = Object.values(mainUserObjects);

  const options = {
    chart: {
      height: 450,
      type: "rangeBar",
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "80%",
      },
    },
    xaxis: {
      type: "datetime",
    },
    stroke: {
      width: 1,
    },
    fill: {
      type: "solid",
      opacity: 0.6,
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
    },
    tooltip: {
      x: {
        format: "dd-MMM hh:mm:ss",
      },
    },
  };
  return (
    <div>
      <Chart options={options} series={series} type="rangeBar" height={450} />
    </div>
  );
}
