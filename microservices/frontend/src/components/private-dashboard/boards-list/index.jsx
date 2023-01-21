import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getErrorMessage, URLS } from "../../../utils";

export default function BoardsList() {
  const [boardsList, setBoardsList] = React.useState({
    ownBoards: [],
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
  const renderBoardsList = (boards) => {
    return boards.map((board) => (
      <li key={board._id}>
        <a href={`/wbo/boards/${board.name}`}>{board.name}</a>
      </li>
    ));
  };
  return (
    <div>
      <h4>Own Boards</h4>
      <ul>{renderBoardsList(boardsList.ownBoards)}</ul>
    </div>
  );
}
