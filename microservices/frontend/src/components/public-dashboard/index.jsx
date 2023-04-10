import React from "react";
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useNavigate } from 'react-router-dom'
import Login from "../login";
import Register from "../register";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export default function PublicDashboard() {
    const navigate = useNavigate();
    return <div>
        <Row>
            <Col>
            </Col>
            <Col>
                <Tabs
                    defaultActiveKey="profile"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                >
                    <Tab eventKey="login" title="Login">
                        <Login />
                    </Tab>
                    <Tab eventKey="register" title="Register">
                        <Register />
                    </Tab>
                </Tabs>
            </Col>
        </Row>
    </div>
}