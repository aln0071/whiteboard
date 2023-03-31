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
} from "@fortawesome/free-solid-svg-icons";

export default function BoardsList({ tab }) {
  const [showCtxtMenu, setShowCtxtMenu] = React.useState({});
  const hardNavigate = (location) => (window.location.href = location);
  const [boardsList, setBoardsList] = React.useState({
    ownBoards: [],
    editorBoards: [],
    viewerBoards: [],
  });
  React.useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(URLS.GET_BOARDS_LIST);
        if (response.status === 200) {
          setBoardsList(response.data);
        } else {
          throw new Error("Invalid response status: " + response.status);
        }
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    })();
  }, []);

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

  const [contextMenuStyles, setContextMenuStyles] = React.useState({});
  const renderBoardsList = (boards, type = "not-owner") => {
    const isOwner = type === "owner";
    return (
      <div className="boards-list-container">
        {isOwner && (
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
        )}
        {boards.map((board) => (
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
                    {isOwner && (
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
                    <li>
                      <FontAwesomeIcon
                        icon={faLink}
                        className="context-item-icon"
                        size="xs"
                        fixedWidth
                      />
                      Copy link
                    </li>
                    <li>
                      <FontAwesomeIcon
                        icon={faStar}
                        className="context-item-icon"
                        size="xs"
                        fixedWidth
                      />
                      Add to starred
                    </li>
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
                        <li>
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            className="context-item-icon"
                            size="xs"
                            fixedWidth
                          />
                          Remove
                        </li>
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
        ))}
      </div>
    );
  };
  if (tab === "my-boards") {
    return renderBoardsList(boardsList.ownBoards, "owner");
  } else if (tab === "shared-with-me") {
    return renderBoardsList([
      ...boardsList.editorBoards,
      ...boardsList.viewerBoards,
    ]);
  }
  return <div>tab not defined</div>;
}
