import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getErrorMessage, URLS } from "../../../utils";
import ShareBoard from "../share-board";
import Analytics from "../analytics";
import AnswerResponses from "../answer-responses";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faLink,
  faStar,
  faChartLine,
  faQuestion,
  faTrashCan,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { toggleStarredBoardAction } from "../../../redux/actions/starredBoards";
import { useDispatch, useSelector } from "react-redux";
import {
  hideLoaderAction,
  showLoaderAction,
} from "../../../redux/actions/loader";
import { getAllBoardsListAction } from "../../../redux/actions/boards";

export default function BoardsList({ tab }) {
  const dispatch = useDispatch();
  const [starredBoards, user] = useSelector((state) => [
    state.starredBoards,
    state.user,
  ]);
  const [showCtxtMenu, setShowCtxtMenu] = React.useState({});
  const hardNavigate = (location) => (window.location.href = location);
  // const [boardsList, setBoardsList] = React.useState({
  //   ownBoards: [],
  //   editorBoards: [],
  //   viewerBoards: [],
  // });
  const boardsList = useSelector((state) => state.boards);
  const searchList = useSelector((state) => state.user.searchResults);
  const [recentBoardsList, setRecentBoardsList] = React.useState([]);
  const [trashBoardsList, setTrashBoardsList] = React.useState([]);

  async function getTrashBoardsList() {
    try {
      const response = await axios.get(URLS.GET_TRASH_BOARDS);
      if (response.status === 200) {
        setTrashBoardsList(response.data);
      } else {
        throw new Error("Invalid response status: " + response.status);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  async function getRecentBoardsList() {
    try {
      const response = await axios.get(URLS.GET_RECENT_BOARDS);
      if (response.status === 200) {
        setRecentBoardsList(response.data);
      } else {
        throw new Error("Invalid response status: " + response.status);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  // async function getAllBoardsList() {
  //   try {
  //     const response = await axios.get(URLS.GET_BOARDS_LIST);
  //     if (response.status === 200) {
  //       setBoardsList(response.data);
  //     } else {
  //       throw new Error("Invalid response status: " + response.status);
  //     }
  //   } catch (error) {
  //     toast.error(getErrorMessage(error));
  //   }
  // }

  function initializeData() {
    if (tab === "recent") {
      return getRecentBoardsList();
    } else if (tab === "trash") {
      return getTrashBoardsList();
    } else {
      // return getAllBoardsList();
      return dispatch(getAllBoardsListAction());
    }
  }

  React.useEffect(() => {
    initializeData();
  }, [tab]);

  const [currentSelectedBoard, setCurrentSelectedBoard] = React.useState();
  const [showShareModal, setShowShareModal] = React.useState(false);
  const [showAnswerResponses, setShowAnswerResponses] = React.useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = React.useState(false);

  const toggleContextMenu = (boardid) => {
    const newCtxtStates = {
      ...showCtxtMenu,
      [boardid]: !showCtxtMenu[boardid],
    };
    setShowCtxtMenu(newCtxtStates);
  };

  const copyLink = (boardName) => {
    const text = `${window.location.origin}/wbo/boards/${boardName}`;
    const type = "text/plain";
    const blob = new Blob([text], { type });
    const data = [new ClipboardItem({ [type]: blob })];
    navigator.clipboard.write(data).then(
      () => toast.success("Link copied"),
      () => {
        toast.error("Copying link failed");
      }
    );
  };

  const toggleMoveToTrash = async (boardid) => {
    try {
      const response = await axios.put(
        URLS.TOGGLE_TRASH.replace(":id", boardid)
      );
      if (response.status !== 200) {
        throw new Error("Invalid response status: " + response.status);
      } else {
        await initializeData();
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const deleteForever = async (boardid) => {
    try {
      dispatch(showLoaderAction());
      const response = await axios.delete(
        URLS.DELETE_FOREVER.replace(":id", boardid)
      );
      if (response.status !== 200) {
        throw new Error("Invalid response status: " + response.status);
      } else {
        await initializeData();
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      dispatch(hideLoaderAction());
    }
  };

  const [contextMenuStyles, setContextMenuStyles] = React.useState({});
  const renderBoardsList = (boards) => {
    return (
      <div className="boards-list-container">
        <>
          <ShareBoard
            isOpen={showShareModal}
            closeModal={() => setShowShareModal(false)}
            board={currentSelectedBoard}
          />
          <AnswerResponses
            isOpen={showAnswerResponses}
            closeModal={() => setShowAnswerResponses(false)}
            board={currentSelectedBoard}
          />
          <Analytics
            isOpen={showAnalyticsModal}
            closeModal={() => setShowAnalyticsModal(false)}
            board={currentSelectedBoard}
          />
        </>
        {boards.map((board) => {
          const isOwner = board.owner === user._id;
          const isMarkedForRemoval = board.markedForDeletionAt !== undefined;
          const isBoardStarred = starredBoards.includes(board._id);
          const toggleStarredContextMenuOptionText = isBoardStarred
            ? "Remove from starred"
            : "Add to starred";
          return (
            <div
              key={board._id}
              className={
                "boards-list-item " +
                (showCtxtMenu[board._id] ? "boards-list-item-selected" : "")
              }
              onClick={() => hardNavigate(`/wbo/boards/${board.name}`)}
              onContextMenu={(e) => {
                e.preventDefault();
                setCurrentSelectedBoard(board);
                toggleContextMenu(board._id);
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                let newCtxtMenuStyles = {
                  top: y,
                  left: x,
                };
                const contextMenuWidth = 180;
                const contextMenuHeight = 165;
                if (window.innerWidth < e.pageX + contextMenuWidth) {
                  // fix right overflow
                  newCtxtMenuStyles = {
                    top: y,
                    right: rect.right - e.clientX,
                  };
                }
                if (window.innerHeight < e.pageY + contextMenuHeight) {
                  // fix bottom overflow
                  newCtxtMenuStyles = {
                    ...newCtxtMenuStyles,
                    top: "unset",
                    bottom: rect.bottom - e.clientY,
                  };
                }
                if (
                  newCtxtMenuStyles.bottom !== undefined &&
                  e.pageY - contextMenuHeight < 0
                ) {
                  // fix top overflow when there is a bottom overflow
                  newCtxtMenuStyles = {
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  };
                }
                setContextMenuStyles(newCtxtMenuStyles);
              }}
            >
              <span className="board-name">{board.name}</span>
              <span
                className="options-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  const syntheticEvent = new MouseEvent("contextmenu", {
                    bubbles: true,
                    cancelable: false,
                    view: window,
                    button: 2,
                    buttons: 0,
                    clientX: e.clientX,
                    clientY: e.clientY,
                  });
                  e.target.dispatchEvent(syntheticEvent);
                }}
              >
                <div className="options-icon-content"></div>
              </span>
              {showCtxtMenu[board._id] && (
                <>
                  <div
                    className="board-context-menu"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleContextMenu(board._id);
                    }}
                    style={contextMenuStyles}
                  >
                    <ul className="board-context-menu-list">
                      {isOwner && !isMarkedForRemoval && (
                        <li onClick={() => setShowShareModal(true)}>
                          <FontAwesomeIcon
                            icon={faUserPlus}
                            className="context-item-icon"
                            size="xs"
                            fixedWidth
                          />
                          Share
                        </li>
                      )}
                      <li onClick={() => copyLink(board.name)}>
                        <FontAwesomeIcon
                          icon={faLink}
                          className="context-item-icon"
                          size="xs"
                          fixedWidth
                        />
                        Copy link
                      </li>
                      {!isMarkedForRemoval && (
                        <li
                          onClick={() =>
                            dispatch(toggleStarredBoardAction(board._id))
                          }
                        >
                          <FontAwesomeIcon
                            icon={faStar}
                            className="context-item-icon"
                            size="xs"
                            fixedWidth
                          />
                          {toggleStarredContextMenuOptionText}
                        </li>
                      )}
                      {isOwner && (
                        <>
                          <li onClick={() => setShowAnalyticsModal(true)}>
                            <FontAwesomeIcon
                              icon={faChartLine}
                              className="context-item-icon"
                              size="xs"
                              fixedWidth
                            />
                            Analytics
                          </li>
                          <li
                            onClick={() => {
                              setShowAnswerResponses(true);
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faQuestion}
                              className="context-item-icon"
                              size="xs"
                              fixedWidth
                            />
                            Answer Responses
                          </li>
                          {!isMarkedForRemoval && (
                            <li onClick={() => toggleMoveToTrash(board._id)}>
                              <FontAwesomeIcon
                                icon={faTrashCan}
                                className="context-item-icon"
                                size="xs"
                                fixedWidth
                              />
                              Remove
                            </li>
                          )}
                          {isMarkedForRemoval && (
                            <>
                              <li onClick={() => toggleMoveToTrash(board._id)}>
                                <FontAwesomeIcon
                                  icon={faClockRotateLeft}
                                  className="context-item-icon"
                                  size="xs"
                                  fixedWidth
                                />
                                Restore
                              </li>
                              <li onClick={() => deleteForever(board._id)}>
                                <FontAwesomeIcon
                                  icon={faTrashCan}
                                  className="context-item-icon"
                                  size="xs"
                                  fixedWidth
                                />
                                Delete forever
                              </li>
                            </>
                          )}
                        </>
                      )}
                    </ul>
                  </div>
                  <div
                    className="board-context-menu-backdrop"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleContextMenu(board._id);
                    }}
                  ></div>
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  if (tab === "my-boards") {
    return renderBoardsList(boardsList.ownBoards);
  }
  else if (tab === "search") {
    return renderBoardsList(searchList);
  }
  else if (tab === "shared-with-me") {
    return renderBoardsList([
      ...boardsList.editorBoards,
      ...boardsList.viewerBoards,
    ]);
  } else if (tab === "starred") {
    return renderBoardsList(
      [
        ...boardsList.ownBoards,
        ...boardsList.editorBoards,
        ...boardsList.viewerBoards,
      ].filter((board) => starredBoards.includes(board._id))
    );
  } else if (tab === "recent") {
    return renderBoardsList(recentBoardsList);
  } else if (tab === "trash") {
    return renderBoardsList(trashBoardsList);
  }
  return <div>tab not defined</div>;
}
