import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { getErrorMessage, URLS } from "../../utils";
import { toast } from "react-toastify";

function Register() {
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
      const response = await axios.post(URLS.REGISTER, {
        ...data,
      });
      if (response.status === 201) {
        toast.success(response.data.msg);
        setData({
            email: '',
            password: ''
        })
      } else {
        throw new Error("Invalid status " + response.status);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={data.email}
          onChange={(e) => handleChange(e, "email")}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={data.password}
          onChange={(e) => handleChange(e, "password")}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default Register;
