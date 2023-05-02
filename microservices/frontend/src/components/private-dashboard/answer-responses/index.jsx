import * as React from "react";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import { URLS, getErrorMessage } from "../../../utils";
import axios from "axios";
import { toast } from "react-toastify";

export default function AnswerResponses({ isOpen, closeModal, board }) {
  const [boards, setBoard] = React.useState([]);

  React.useEffect(() => {
    const url = URLS.FETCH_QUESTIONS;
    try {
      const response = axios
        .post(url, {
          questionId: board.name,
        })
        .then((data) => {
          setBoard(data.data[0].questions);
          console.log(data);
        });
      if (response.status === 200) {
        toast.success("Fetching Questions");
      } else {
        throw new Error("Invalid status code: " + response.status);
      }
    } catch (error) {
      console.trace(error);
      toast.error(getErrorMessage(error));
    }
  }, [board]);

  return (
    <Modal show={isOpen} onHide={() => closeModal()}>
      <Modal.Header closeButton>
        <Modal.Title>Responses Sheet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {boards &&
          Array.isArray(boards) &&
          boards.map((data) => {
            return (
              <>
                <h5>{data.question}</h5>
                <Table>
                  {data.answerArray.map((answer) => {
                    return (
                      <tr>
                        <td>{answer.userId.username}</td>
                        <td>{answer.answer}</td>
                      </tr>
                    );
                  })}
                </Table>
                <hr></hr>
              </>
            );
          })}
      </Modal.Body>
    </Modal>
  );
}
