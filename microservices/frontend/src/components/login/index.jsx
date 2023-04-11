import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { getErrorMessage, URLS } from "../../utils";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";

function Login() {
  const navigate = useNavigate();
  const [data, setData] = React.useState({
    email: "",
    password: "",
  });
  const handleChange = (event, field) => {
    const newData = {
      ...data,
      [field]: event.target.value,
    };
    setData(newData);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(URLS.LOGIN, {
        ...data,
      });
      if (response.status === 200) {
        const userDetails = response.data;
        toast.success("Login success!");
        navigate("/private/dashboard");
      } else {
        throw new Error("Invalid status " + response.status);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };
  return (
    <Card
      bg="dark"
      text="white"
      style={{ width: "30rem" }}
      className="customLogin"
    >
      <Card.Body>
        <center>
          <Card.Title>Login</Card.Title>
        </center>
        <Card.Text>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={data.email}
                onChange={(e) => handleChange(e, "email")}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={data.password}
                onChange={(e) => handleChange(e, "password")}
              />
            </Form.Group>

            <center>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </center>
          </Form>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Login;
