import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Login from "../login";
import Register from "../register";

export default function PublicDashboard() {
  return (
    <div className="public-dashboard-container">
      <div className="public-dashboard-background">
        <img src="backgroundWhiteboard.png" />
      </div>
      <div className="login-and-register-forms">
        <Tabs
          defaultActiveKey="login"
          id="uncontrolled-tab-example"
          className="mb-3 tabsCustom"
        >
          <Tab eventKey="login" title="Login">
            <Login />
          </Tab>
          <Tab eventKey="register" title="Register">
            <Register />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
