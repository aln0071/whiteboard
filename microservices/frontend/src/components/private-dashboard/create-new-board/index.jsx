import * as React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { toast } from "react-toastify";
import { getErrorMessage, URLS } from "../../../utils";
import crypto from "crypto";

export default function CreateNewBoardModal({ isOpen, closeModal }) {
  const createWhiteboardWithName = async (name) => {
    try {
      const response = await axios.post(`${URLS.CREATE_BOARD}/${name}`);
      if (response.status === 200) {
        toast.success("Success: board created!");
        handleCloseModal();
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const createRandomWhiteboard = () => {
    const name = crypto
      .randomBytes(32)
      .toString("base64")
      .replace(/[^\w]/g, "-");
    createWhiteboardWithName(name);
  };

  const [boardName, setBoardName] = React.useState("");
  const [useRandomName, setUseRandomName] = React.useState(false);
  const [showError, setShowError] = React.useState(false);

  const handleCloseModal = () => {
    setBoardName("");
    setUseRandomName(false);
    setShowError(false);
    closeModal();
  };

  const handleCreateWhiteboard = async () => {
    if (useRandomName) {
      createRandomWhiteboard();
    } else {
      const regex = new RegExp(/^[\w%\-_~()]{1,15}$/g);
      const isValid = regex.test(boardName);
      if (!isValid) {
        toast.error("Provide valid board name!");
        setShowError(true);
      } else {
        createWhiteboardWithName(boardName);
      }
    }
  };

  return (
    <Modal show={isOpen} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title className="analytics-header">Create Board</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form validated={showError}>
          <Form.Group className="mb-3">
            <Form.Label>Board Name</Form.Label>
            <Form.Control
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              type="text"
              placeholder="Enter board name"
              disabled={useRandomName}
              pattern="^[\w%\-_~()]{1,15}$"
            />
            <Form.Control.Feedback type="invalid">
              1 - 15 characters containing a-z A-Z 0-9 _ % - ~ ( )
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
        <Form.Check
          type="checkbox"
          label="Use a random name"
          checked={useRandomName}
          onChange={() => setUseRandomName(!useRandomName)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCreateWhiteboard}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
