import * as React from "react";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import { URLS, getErrorMessage } from "../../../utils";
import axios from "axios";
import { toast } from "react-toastify";

export default function AnswerResponses({ isOpen, closeModal, board }) {
  const [boards, setBoard] = React.useState([]);

  const fetchAnswerResponses = async () => {
    try {
      const response = await axios.post(URLS.FETCH_QUESTIONS, {
        questionId: board.name,
      });
      if (response.status !== 200) {
        throw new Error("Invalid status code: " + response.status);
      }
      setBoard(response.data[0].questions);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      fetchAnswerResponses();
    }
  }, [isOpen]);

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
