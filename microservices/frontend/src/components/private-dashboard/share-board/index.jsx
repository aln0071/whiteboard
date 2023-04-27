import * as React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { URLS, getErrorMessage } from "../../../utils";
import axios from "axios";
import { toast } from "react-toastify";

function ShareBoard({ isOpen, closeModal, board }) {
  const [users, setUsers] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState("");

  React.useEffect(() => {
    console.log(board && board.name)
    if (board) {
      const url = URLS.BOARD_SHARING_OPTIONS.replace(":boardName", board.name);
      axios.get(url).then(response => setUsers(response.data.subList));
    }
  }, [board]);

  const handleClose = () => closeModal();

  const handleAddUser = () => {
    if (currentUser.trim() === "") return;
    setUsers({
      ...users,
      [currentUser]: "viewer",
    });
    setCurrentUser("");
    console.log(users)
  };

  const handleSave = async () => {
    const url = URLS.EDIT_BOARD_SHARING_OPTIONS.replace(":id", board._id);
    try {
      const response = await axios.put(url, users);
      if (response.status === 200) {
        toast.success("Success: sharing options updated");
        handleClose();
      } else {
        throw new Error("Invalid status code: " + response.status);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
    console.log(users)
  };

  return (
    <>
      <Modal show={isOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sharing Options</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do not forget to save changes before closing the modal.
          <hr />

          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Recipient's username"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              value={currentUser}
              onChange={(e) => setCurrentUser(e.target.value)}
            />
            <Button
              variant="outline-secondary"
              id="button-addon2"
              onClick={handleAddUser}
            >
              Add
            </Button>
          </InputGroup>
          <ul>
            {Object.keys(users).map((username) => {
              const role = users[username];
              return (
                <li key={username}>
                  {username}
                  <ButtonGroup>
                    <DropdownButton
                      title={role}
                      onClick={(e) => {
                        e.preventDefault();
                        const value = e.target.getAttribute("value");
                        if (value) {
                          setUsers({
                            ...users,
                            [username]: value,
                          });
                        }
                      }}
                    >
                      <Dropdown.Item
                        href="#/action-1"
                        active={role === "viewer"}
                        value="viewer"
                      >
                        Viewer
                      </Dropdown.Item>
                      <Dropdown.Item
                        href="#/action-2"
                        active={role === "editor"}
                        value="editor"
                      >
                        Editor
                      </Dropdown.Item>
                    </DropdownButton>
                    <Button
                      variant="danger"
                      onClick={() => {
                        const newUsersObject = Object.assign({}, users);
                        delete newUsersObject[username];
                        setUsers(newUsersObject);
                      }}
                    >
                      Remove User
                    </Button>
                  </ButtonGroup>
                </li>
              );
            })}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ShareBoard;
