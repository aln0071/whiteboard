import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getErrorMessage, URLS } from "../../../utils";
import ShareBoard from "../share-board";
import Analytics from "../analytics";

export default function BoardsList() {
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
  const renderBoardsList = (boards, type = "not-owner") => {
    return boards.map((board) => (
      <li key={board._id}>
        <a href={`/wbo/boards/${board.name}`}>{board.name}</a>
        {type === "owner" && (
          <>
            {`  `}
            <ShareBoard board={board} />
            <Analytics board={board} />
          </>
        )}
      </li>
    ));
  };
  return (
    <div>
      <h4>Own Boards</h4>
      <ul>{renderBoardsList(boardsList.ownBoards, "owner")}</ul>
      <hr />
      <h4>Shared With Me</h4>
      <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
        <h6>With Edit Access</h6>
        <hr />
        <ul>{renderBoardsList(boardsList.editorBoards)}</ul>
        <h6>With View Access</h6>
        <hr />
        <ul>{renderBoardsList(boardsList.viewerBoards)}</ul>
      </div>
    </div>
  );
}
