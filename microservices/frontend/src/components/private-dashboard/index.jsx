import * as React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { getErrorMessage, URLS } from "../../utils";
import CreateNewBoardModal from "./create-new-board";
import ChatBot from "./chatbot";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserFriends,
  faChalkboard,
  faClock,
  faStar,
  faTrashCan,
  faUser,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

export default function PrivateDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

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

  const [showNewBoardModal, setShowNewBoardModal] = React.useState(false);

  return (
    <>
      <CreateNewBoardModal
        isOpen={showNewBoardModal}
        closeModal={() => setShowNewBoardModal(false)}
      />
      <div className="outer-container">
        <div className="site-layout-container">
          <div className="site-icon">
            <img src="/favicon.ico" width={25} /> <span>CWB</span>
          </div>
          <div className="top-header">
            <InputGroup className="search-box">
              <Form.Control
                placeholder="Search in CWB"
                aria-label="Search in CWB"
                aria-describedby="basic-addon2"
                className={"shadow-none"}
              />
              <Button variant="outline-secondary">Search</Button>
            </InputGroup>
            <span className="profile-icon"></span>
          </div>
          <div className="left-navigation">
            <ul className="left-nav-list">
              <li>
                <button
                  className="new-wb-btn"
                  onClick={() => setShowNewBoardModal(true)}
                >
                  + New
                </button>
              </li>
              <li
                onClick={() => navigate("dashboard")}
                className={
                  "navigable-item" +
                  (location.pathname === "/private/dashboard"
                    ? " selected"
                    : "")
                }
              >
                <FontAwesomeIcon
                  icon={faChalkboard}
                  className="nav-item-icon"
                  size="xs"
                  fixedWidth
                />
                My Boards
              </li>
              <li
                onClick={() => navigate("shared-with-me")}
                className={
                  "navigable-item" +
                  (location.pathname === "/private/shared-with-me"
                    ? " selected"
                    : "")
                }
              >
                <FontAwesomeIcon
                  icon={faUserFriends}
                  className="nav-item-icon"
                  size="xs"
                  fixedWidth
                />
                Shared with me
              </li>
              <li className="navigable-item">
                <FontAwesomeIcon
                  icon={faClock}
                  className="nav-item-icon"
                  size="xs"
                  fixedWidth
                />
                Recent
              </li>
              <li className="navigable-item">
                <FontAwesomeIcon
                  icon={faStar}
                  className="nav-item-icon"
                  size="xs"
                  fixedWidth
                />
                Starred
              </li>
              <li className="navigable-item">
                <FontAwesomeIcon
                  icon={faTrashCan}
                  className="nav-item-icon"
                  size="xs"
                  fixedWidth
                />
                Trash
              </li>
              <hr />
              <li className="navigable-item">
                <FontAwesomeIcon
                  icon={faUser}
                  className="nav-item-icon"
                  size="xs"
                  fixedWidth
                />
                Profile
              </li>
              <li className="navigable-item" onClick={() => logout()}>
                <FontAwesomeIcon
                  icon={faRightFromBracket}
                  className="nav-item-icon"
                  size="xs"
                  fixedWidth
                />
                Logout
              </li>
            </ul>
          </div>
          <div className="site-body">
            <Outlet />
          </div>
        </div>
      </div>
      <ChatBot />
    </>
  );
}
