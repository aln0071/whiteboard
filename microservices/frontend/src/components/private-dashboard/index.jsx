import * as React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { getErrorMessage, URLS } from "../../utils";
import CreateNewBoardModal from "./create-new-board";
import ChatBot from "./chatbot";

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
                className="navigable-item"
              >
                My Boards
              </li>
              <li
                onClick={() => navigate("shared-with-me")}
                className="navigable-item"
              >
                Shared with me
              </li>
              <li className="navigable-item">Recent</li>
              <li className="navigable-item">Starred</li>
              <li className="navigable-item">Trash</li>
              <hr />
              <li className="navigable-item">Profile</li>
              <li className="navigable-item" onClick={() => logout()}>
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
