import * as React from "react";
import { Form, Card, Row, Col, Button } from 'react-bootstrap';
import Modal from "react-bootstrap/Modal";
import { useState } from 'react';
import { URLS, getErrorMessage } from "../../../utils";
import axios from "axios";
import { toast } from "react-toastify";

export default function PasswordReset({ isOpen, closeModal, username }) {
  const [error, seterror] = useState("");

  const submitHandler = function (e) {
    e.preventDefault();
    var formData = e.target
    const user = {};
    user.username = username;
    user.oldpassword = formData.formBasicOldPassword.value;
    user.newpassword = formData.formBasicNewPassword.value;
    if (user.newpassword === formData.formBasicNewPassword2.value) {
      axios.post(URLS.UPDATE_PROFILE_DETAILS, user, { 'Content-Type': 'multipart/form-data' })
        .then(response => { console.log(response) })
    }
    else {
      seterror("The new passwords don't match")
    }
  };

  return (
    <Modal show={isOpen} onHide={() => closeModal()}>
      <Modal.Header closeButton>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="formBasicOldPassword">
            <Form.Label>Enter Old Password</Form.Label>
            <Form.Control type="password" name="oldpassword" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicNewPassword">
            <Form.Label>Enter New Password</Form.Label>
            <Form.Control type="password" name="newpassword" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicNewPassword2">
            <Form.Label>Repeat New Password</Form.Label>
            <Form.Control type="password" name="newpassword2" />
          </Form.Group>
          {error}

          <Button variant="primary" type="submit" >
            Reset Password
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
