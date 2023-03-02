import * as React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { URLS } from "../../../utils";

export default function Analytics({ board }) {
  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [activeDurations, setActiveDurations] = React.useState({});
  const [analyticsSummary, setAnalyticsSummary] = React.useState({});

  React.useEffect(() => {
    async function getAnalyticsFromService() {
      const response = await axios.get(
        URLS.GET_BOARD_ANALYTICS.replace(":id", board._id)
      );
      const useractivity = response.data.useractivity || [];
      useractivity.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      const summary = {};
      const activityTracker = new Map();
      useractivity.forEach(({ userid, timestamp, activitytype }) => {
        if (activitytype === "joinboard") {
          if (!activityTracker.has(userid)) {
            activityTracker.set(userid, new Date(timestamp));
            summary[userid] = {
              duration: 0,
              active: false,
            };
          }
        } else if (activitytype === "disconnection") {
          if (activityTracker.has(userid)) {
            const milliseconds =
              new Date(timestamp) - activityTracker.get(userid);
            summary[userid].duration =
              summary[userid]?.duration || 0 + milliseconds;
            activityTracker.delete(userid);
          }
        }
      });
      Object.keys(summary).forEach((userid) => {
        const object = summary[userid];
        if (activityTracker.has(userid)) {
          object.duration += Date.now() - activityTracker.get(userid);
          object.active = true;
        }
        const milliseconds = object.duration;
        console.log(object);
        let seconds = Math.ceil(milliseconds / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        seconds = seconds % 60;
        hours = hours.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        });
        minutes = minutes.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        });
        seconds = seconds.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        });
        object.duration = `${hours}:${minutes}:${seconds}`;
      });
      setAnalyticsSummary(summary);
    }
    if (show === true) {
      // make api call
      getAnalyticsFromService();
    } else {
      // clear any previous data
    }
  }, [show]);
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Show Analytics
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="analytics-header">
            Analytics of {board.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="analytics-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Duration (HH:MM:SS)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(analyticsSummary).map((userid) => {
                const analyticsOfUser = analyticsSummary[userid];
                return (
                  <tr key={userid}>
                    <td>{userid}</td>
                    <td>{analyticsOfUser.duration}</td>
                    <td>{analyticsOfUser.active ? "active" : "inactive"} </td>
                  </tr>
                );
              })}
              {Object.keys(activeDurations).size > 0 && (
                <td colSpan={3}>No data found</td>
              )}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
