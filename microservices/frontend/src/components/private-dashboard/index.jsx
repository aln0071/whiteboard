import React from "react";
import Button from "react-bootstrap/Button";
import Card from 'react-bootstrap/Card';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { getErrorMessage, URLS } from "../../utils";
import Form from "react-bootstrap/Form";
import BoardsList from "./boards-list";
import crypto from "crypto";
import ChatBot from "./chatbot";
import CustomNavbar from "../customNavbar";

export default function PrivateDashboard() {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      const response = await axios.post(URLS.LOGOUT);
      if (response.status === 200) {
        navigate(response.data.redirectURL);
      } else {
        throw new Error("Logout request failed!");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const [boardName, setBoardName] = React.useState("");

  const createWhiteboardWithName = async (name) => {
    try {
      const response = await axios.post(`${URLS.CREATE_BOARD}/${name}`);
      if (response.status === 200) {
        toast.success("Success: board created!");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleWhiteboardNameSubmission = async (e) => {
    e.preventDefault();
    createWhiteboardWithName(boardName);
  };

  const createRandomWhiteboard = () => {
    const name = crypto
      .randomBytes(32)
      .toString("base64")
      .replace(/[^\w]/g, "-");
    createWhiteboardWithName(name);
  };

  return (
    <>
      <CustomNavbar />
      <div>
        <br />
        <BoardsList />
        <hr />
        <br />

        <center>
          <Card bg="dark" text="white" style={{ width: '30rem' }}>
            <Card.Body>
              <Card.Title>Create a board with given name</Card.Title>
              <Card.Text>
                <Form onSubmit={handleWhiteboardNameSubmission}>
                  <Form.Control
                    className="me-auto"
                    placeholder="Enter board name here"
                    type="text"
                    pattern="^[\w%\-_~()]{1,15}$"
                    title="Please enter valid board name"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                  />
                  <br />


                  <Card.Link className="mb-2 text-muted" onClick={() => createRandomWhiteboard()} >Can't think of a name let us help : Random Board Generator</Card.Link>
                  <br>
                  </br><Button variant="primary" type="submit">
                    Create
          </Button>
                </Form>
              </Card.Text>
            </Card.Body>
          </Card>
        </center>
        <ChatBot />
      </div>
    </>
  );
}
