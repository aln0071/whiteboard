import * as React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Table from "react-bootstrap/Table";
import { URLS, getErrorMessage } from "../../../utils";
import axios from "axios";
import { toast } from "react-toastify";

function ShareBoard({ board }) {
  const [users, setUsers] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState("");
  const [boards, setBoard] = React.useState([]);

  const [show, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const [showResponse, setShowResponses] = React.useState(false);
  const handleCloseResponses = () => setShowResponses(false);
  const handleShowResponses = () => setShowResponses(true);

  const handleAddUser = () => {
    if (currentUser.trim() === "") return;
    setUsers({
      ...users,
      [currentUser]: "viewer",
    });
    setCurrentUser("");
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
  };


  const showResponses = async () => {
    const url = "http://localhost:2000/api/v1/board/fetchquestions";
    try {
      const response = await axios.post(url, {
        "questionId": board.name
      }).then(data => {
        setBoard(data.data[0].questions)
        console.log(data)
      })
      setShowResponses(true);
      if (response.status === 200) {
        toast.success("Fetching Questions");
        setShowResponses(true);
      } else {
        throw new Error("Invalid status code: " + response.status);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  React.useEffect(() => { }, [board]);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Edit Sharing Options
      </Button>

      <Button variant="primary" onClick={showResponses}>
        Answer Responses
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sharing Options</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do not forget to save changes before closing the modal.
          <hr />
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


      <Modal show={showResponse} onHide={handleCloseResponses}>
        <Modal.Header closeButton>
          <Modal.Title>Responses Sheet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {boards && Array.isArray(boards) && boards.map(data => {
            return (<>
              <h3>{data.question}</h3>
              <Table>
                {data.answerArray.map(answer => {
                  return (<tr>
                    <td>{answer.userId}</td>
                    <td>{answer.answer}</td>
                  </tr>)
                })}
              </Table>
              <hr></hr>
            </>)
          })}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ShareBoard;
