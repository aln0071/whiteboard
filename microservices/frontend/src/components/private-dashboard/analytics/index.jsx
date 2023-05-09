import * as React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { URLS } from "../../../utils";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import AnalyticsChart from "./AnalyticsChart";
import Table from "react-bootstrap/Table";

let useractivity = [];

export default function Analytics({ isOpen, closeModal, board }) {
  const handleClose = () => closeModal();
  const [tab, setTab] = React.useState("table");

  const [fromDatetime, setFromDatetime] = React.useState("");
  const [toDatetime, setToDatetime] = React.useState("");

  const [analyticsSummary, setAnalyticsSummary] = React.useState({});

  const [userActivityData, setUserActivityData] = React.useState([]);

  const userActivityTimestampFilter = () => {
    const fromLimit = new Date(fromDatetime);
    const toLimit = new Date(toDatetime);
    return ({ timestamp }) => {
      if (!isNaN(fromLimit) && timestamp < fromLimit) {
        return false;
      }
      if (!isNaN(toLimit) && timestamp > toLimit) {
        return false;
      }
      return true;
    };
  };

  function generateSummaryFromUserActivity() {
    const summary = {};
    const activityTracker = new Map();
    const fromLimit = new Date(fromDatetime);
    const toLimit = new Date(toDatetime);
    useractivity
      .filter(userActivityTimestampFilter())
      .forEach(({ userid, timestamp, activitytype }) => {
        if (activitytype === "joinboard") {
          if (!activityTracker.has(userid)) {
            activityTracker.set(userid, { timestamp, count: 1 });
            if (summary[userid] === undefined) {
              summary[userid] = {
                duration: 0,
                active: false,
              };
            }
          } else {
            const track = activityTracker.get(userid);
            track.count += 1;
          }
        } else if (activitytype === "disconnection") {
          if (activityTracker.has(userid)) {
            const track = activityTracker.get(userid);
            track.count -= 1;
            // if (track.count === 0) {
            const milliseconds = timestamp - track.timestamp;
            summary[userid].duration =
              (summary[userid]?.duration || 0) + milliseconds;
            activityTracker.delete(userid);
            // }
          }
        }
      });
    Object.keys(summary).forEach((userid) => {
      const object = summary[userid];
      if (activityTracker.has(userid)) {
        object.duration += Date.now() - activityTracker.get(userid).timestamp;
        object.active = true;
      }
      const milliseconds = object.duration;
      // console.log(object);
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

  React.useEffect(() => {
    async function getAnalyticsFromService() {
      const response = await axios.get(
        URLS.GET_BOARD_ANALYTICS.replace(":id", board._id)
      );
      useractivity = response.data.useractivity || [];
      useractivity = useractivity.map((activity) => ({
        ...activity,
        timestamp: new Date(activity.timestamp),
        userid: activity.userid.username,
      }));
      useractivity.sort((a, b) => a.timestamp - b.timestamp);
      setUserActivityData(useractivity);
      generateSummaryFromUserActivity();
    }
    if (isOpen === true) {
      // make api call
      getAnalyticsFromService();
    } else {
      // clear any previous data
    }
  }, [isOpen]);
  return (
    <>
      <Modal show={isOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="analytics-header">
            Analytics of {board?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>From</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="datetime-local"
                value={fromDatetime}
                onChange={(e) => {
                  setFromDatetime(e.target.value);
                }}
              />
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setFromDatetime("");
                }}
              >
                Clear
              </Button>
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label>To</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="datetime-local"
                value={toDatetime}
                onChange={(e) => {
                  setToDatetime(e.target.value);
                }}
              />
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setToDatetime("");
                }}
              >
                Clear
              </Button>
            </InputGroup>
          </Form.Group>
          <div className="_right-button">
            <Button
              variant="outline-secondary"
              onClick={() => generateSummaryFromUserActivity()}
            >
              Apply Filter
            </Button>
          </div>
          <hr />
          <Tabs activeKey={tab} onSelect={(t) => setTab(t)} id="analytics-tabs">
            <Tab eventKey="table" title="Table">
              <Table striped bordered hover className="analytics-table">
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
                        <td>
                          {analyticsOfUser.active ? "active" : "inactive"}{" "}
                        </td>
                      </tr>
                    );
                  })}
                  {Object.keys(analyticsSummary).length === 0 && (
                    <tr>
                      <td colSpan={3} style={{ textAlign: "center" }}>
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Tab>
            <Tab eventKey="chart" title="Chart">
              <div className="chart-container">
                <AnalyticsChart
                  data={userActivityData.filter(userActivityTimestampFilter())}
                />
              </div>
            </Tab>
          </Tabs>
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
