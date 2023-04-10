import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getErrorMessage, URLS } from "../../../utils";
import ShareBoard from "../share-board";
import Analytics from "../analytics";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from "react-bootstrap/Button";
import "../../../App.css";

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
      <>
        {type === "owner" &&
          (<Col>
            <Card style={{ width: '21rem' }} bg="dark" text="white">
              <Card.Header>{board.name}</Card.Header>
              <Card.Body>
                <center>
                  <Button onClick={event => window.location.href = `/wbo/boards/${board.name}`}>Open Board</Button>{'    '}
                  <ShareBoard board={board} />
                  <Analytics board={board} />
                </center>
              </Card.Body>
            </Card>
          </Col>)}

        {
          type === "not-owner" &&
          (<Col>
            <Card style={{ width: '21rem' }} bg="dark" text="white">
              <Card.Header>{board.name}</Card.Header>
              <Card.Body>
                <center>
                  <Button onClick={event => window.location.href = `/wbo/boards/${board.name}`}>Open Board</Button>{'    '}
                </center>
              </Card.Body>
            </Card>
          </Col>)
        }

      </>
    ));
  };
  return (
    <div>
      <h4>My Boards</h4>
      <Row xs={1} xl={4} className="g-4">
        {renderBoardsList(boardsList.ownBoards, "owner")}
      </Row>

      {boardsList.viewerBoards.length != 0 && boardsList.viewerBoards.length != 0 && (
        <><hr /><h4>Shared Boards</h4></>)}
      <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
        {boardsList.editorBoards.length != 0 &&
          (<><h6>With Edit Access</h6>
            <hr />
            <Row xs={1} xl={4} className="g-4">
              {renderBoardsList(boardsList.editorBoards)}
            </Row></>)}
        <br />
        {boardsList.viewerBoards.length != 0 &&
          (<><h6>With View Access</h6>
            <hr />
            <Row xs={1} xl={4} className="g-4">
              {renderBoardsList(boardsList.viewerBoards)}</Row></>)}

      </div>
    </div>
  );
}
