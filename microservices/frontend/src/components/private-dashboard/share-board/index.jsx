import * as React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { URLS, getErrorMessage } from "../../../utils";
import axios from "axios";
import { toast } from "react-toastify";
import { AsyncTypeahead } from "react-bootstrap-typeahead";

function ShareBoard({ isOpen, closeModal, board }) {
  const [users, setUsers] = React.useState({});

  const [autocompleteResults, setAutocompleteResults] = React.useState([]);
  const [isLoadingAutocomplete, setIsLoadingAutocomplete] =
    React.useState(false);
  const autocompleteTimer = React.useRef(null);

  React.useEffect(() => {
    if (board) {
      const url = URLS.BOARD_SHARING_OPTIONS.replace(":boardName", board.name);
      axios.get(url).then((response) => setUsers(response.data.subList));
    }
  }, [board]);

  const handleClose = () => closeModal();

  const handleAddUser = (username) => {
    if (username.trim() === "") return;
    setUsers({
      ...users,
      [username]: "viewer",
    });
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

  return (
    <>
      <Modal show={isOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sharing Options</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do not forget to save changes before closing the modal.
          <hr />
          <AsyncTypeahead
            filterBy={() => true}
            id="recipient-name-autocomplete"
            onChange={(selectedItem) => {
              handleAddUser(selectedItem[0].username);
            }}
            isLoading={isLoadingAutocomplete}
            selected={[]}
            onSearch={async (query) => {
              const timerId = autocompleteTimer.current;
              clearTimeout(timerId);
              autocompleteTimer.current = setTimeout(async () => {
                try {
                  const queryValue = String(query).trim();
                  if (queryValue === "") {
                    setAutocompleteResults([]);
                    setIsLoadingAutocomplete(false);
                    return;
                  }
                  setIsLoadingAutocomplete(true);
                  const response = await axios.get(
                    URLS.AUTOCOMPLETE.replace(":name", queryValue)
                  );
                  if (response.status !== 200) {
                    throw new Error("Invalid status");
                  }
                  setAutocompleteResults(
                    response.data.filter(
                      (item) => users[item.username] === undefined
                    )
                  );
                  setIsLoadingAutocomplete(false);
                } catch (error) {
                  console.error(error);
                  setIsLoadingAutocomplete(false);
                  setAutocompleteResults([]);
                }
              }, 300);
            }}
            options={autocompleteResults}
            labelKey="username"
            placeholder="Recipient's username"
          />
          <ul className="share-board-recipients-list">
            {Object.keys(users).map((username) => {
              const role = users[username];
              return (
                <li key={username}>
                  <div className="share-board-list-item">
                    <span className="share-board-recipient-email">
                      {username}
                    </span>
                    <DropdownButton
                      title={role === "editor" ? "Editor" : "Viewer"}
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
                      className="share-board-type-dropdown"
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
                  </div>
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
