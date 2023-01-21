import React from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { getErrorMessage, URLS } from "../../utils";
import Form from "react-bootstrap/Form";
import BoardsList from "./boards-list";

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

  const createWhiteboardWithName = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${URLS.CREATE_BOARD}/${boardName}`);
      if (response.status === 200) {
        toast.success("Success: board created!");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div>
      private dashboard
      <hr />
      <div>
        <h4>Create a board with given name</h4>
        <Form onSubmit={createWhiteboardWithName}>
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
          <Button variant="primary" type="submit">
            Create
          </Button>
        </Form>
      </div>
      <hr />
      <BoardsList />
      <hr />
      <Button variant="primary" onClick={() => {}}>
        Create Random Whiteboard
      </Button>
      {"  "}
      <Button
        variant="primary"
        onClick={() => (window.location.href = "/wbo/boards/anonymous")}
      >
        Open Public Whiteboard
      </Button>
      {"  "}
      <Button variant="primary" onClick={logout}>
        Logout
      </Button>
      {"  "}
    </div>
  );
}
