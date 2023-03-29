import * as React from "react";
import ChatIcon from "./ChatIcon";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { getErrorMessage, URLS } from "../../../utils";
import { toast } from "react-toastify";
import GPT3Tokenizer from "gpt3-tokenizer";

const tokenizer = new GPT3Tokenizer({ type: "gpt3" });

export default function ChatBot() {
  const [isOpen, setIsOpen] = React.useState(false);

  const [question, setQuestion] = React.useState("");

  const chatContainerRef = React.useRef();

  const chatBodyRef = React.useRef();

  const chatQuestionRef = React.useRef();

  const chatsDataRef = React.useRef();

  const chatsContextRef = React.useRef([]);

  const [chats, setChats] = React.useState([]);

  async function sendQuestion() {
    const q = question.trim();
    setQuestion("");
    if (q.length > 0) {
      chatsDataRef.current = [
        ...chats,
        {
          type: "question",
          body: q,
        },
      ];
      setChats(chatsDataRef.current);
      chatsContextRef.current = [
        ...chatsContextRef.current,
        {
          type: "question",
          body: q,
        },
      ];
      function createPrompt() {
        const ctx = chatsContextRef.current.reduce((t, c) => {
          if ("question".localeCompare(c.type) === 0) {
            return `${t}\nUser: ${c.body}`;
          }
          return `${t}\nBot: ${c.body}`;
        }, "");
        const prompt = `${ctx}\nBot:`;
        const { bpe } = tokenizer.encode(prompt);
        if (bpe.length > 97) {
          // prompt too long; reduce length
          chatsContextRef.current = chatsContextRef.current.slice(2);
          if (chatsContextRef.current.length === 0) {
            throw new Error("Question too long!");
          }
          return createPrompt();
        }
        return prompt;
      }
      try {
        const prompt = createPrompt();
        const response = await axios.post(URLS.CHAT_GPT_ASK_QUESTION, {
          prompt,
        });
        if (response.status === 200) {
          const { data } = response.data;
          chatsDataRef.current = [
            ...chatsDataRef.current,
            {
              type: "reply",
              body: data.replace(/^\s+|\s+$/g, ""),
            },
          ];
          chatsContextRef.current = [
            ...chatsContextRef.current,
            {
              type: "reply",
              body: data.replace(/^\s+|\s+$/g, ""),
            },
          ];
          setChats(chatsDataRef.current);
        } else {
          throw new Error(
            "Chat bot responded with invalid status code " + response.status
          );
        }
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    }
    chatQuestionRef.current?.focus();
  }

  React.useEffect(() => {
    if (chatBodyRef.current)
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    if (isOpen) {
      setTimeout(() => chatQuestionRef.current?.focus(), 1000);
    }
  }, [isOpen, chats]);

  if (isOpen === false) {
    return (
      <div className="chatbot-container">
        <button className="chatbot-open-btn" onClick={() => setIsOpen(true)}>
          <ChatIcon width={25} />
        </button>
      </div>
    );
  } else {
    return (
      <div ref={chatContainerRef} className="chatbot-container open">
        <div className="chatbot-header">
          Chat Bot{" "}
          <button
            className="chatbot-minimize-btn"
            onClick={() => {
              const chatContainer = chatContainerRef.current;
              if (chatContainer) {
                chatContainer.classList.add("close-chatbox");
              }
              setTimeout(() => {
                setIsOpen(false);
              }, 200);
            }}
          >
            x
          </button>
        </div>
        <div className="chatbot-body-cover">
          <ChatIcon width={30} />
        </div>
        <div ref={chatBodyRef} className="chatbot-body">
          {chats.map((chat, index) => {
            const { type, body } = chat;
            return (
              <div
                key={"chatmsg" + index}
                className={`chatbot-${
                  type === "question" ? "sent" : "received"
                }-message`}
              >
                {body}
              </div>
            );
          })}
        </div>
        <div className="chatbot-footer">
          <InputGroup>
            <Form.Control
              ref={chatQuestionRef}
              placeholder="Enter your question"
              aria-label="Enter your question"
              aria-describedby="basic-addon2"
              className={"shadow-none"}
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter" || e.keyCode === 13) {
                  sendQuestion();
                }
              }}
            />
            <Button
              variant="secondary"
              onClick={() => {
                sendQuestion();
              }}
            >
              Send
            </Button>
          </InputGroup>
        </div>
      </div>
    );
  }
}
