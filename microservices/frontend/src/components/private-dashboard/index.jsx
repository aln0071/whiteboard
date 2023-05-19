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
import { setSearchResults } from "../../redux/actions/search";
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
import { useSelector, useDispatch } from "react-redux";

export default function PrivateDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [searchkey, setSearchKey] = React.useState("")

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
  const profileImageUrl = useSelector((state) => state.user.image);

  const searchForBoards = () => {
    dispatch(setSearchResults(searchkey));
    navigate("search")
  }

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
                onChange={e => setSearchKey(e.target.value)}
                className={"shadow-none"}
              />
              <Button variant="outline-secondary" onClick={() => searchForBoards()}>Search</Button>
            </InputGroup>
            <span className="profile-icon">
              <img src={profileImageUrl} />
            </span>
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
              <li
                onClick={() => navigate("recent")}
                className={
                  "navigable-item" +
                  (location.pathname === "/private/recent" ? " selected" : "")
                }
              >
                <FontAwesomeIcon
                  icon={faClock}
                  className="nav-item-icon"
                  size="xs"
                  fixedWidth
                />
                Recent
              </li>
              <li
                onClick={() => navigate("starred")}
                className={
                  "navigable-item" +
                  (location.pathname === "/private/starred" ? " selected" : "")
                }
              >
                <FontAwesomeIcon
                  icon={faStar}
                  className="nav-item-icon"
                  size="xs"
                  fixedWidth
                />
                Starred
              </li>
              <li
                onClick={() => navigate("trash")}
                className={
                  "navigable-item" +
                  (location.pathname === "/private/trash" ? " selected" : "")
                }
              >
                <FontAwesomeIcon
                  icon={faTrashCan}
                  className="nav-item-icon"
                  size="xs"
                  fixedWidth
                />
                Trash
              </li>
              <hr />
              <li
                onClick={() => navigate("profile")}
                className={
                  "navigable-item" +
                  (location.pathname === "/private/profile" ? " selected" : "")
                }
              >
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
