import * as React from "react";
import { Form, Card, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import { useEffect, useState } from "react";
// import 'font-awesome/css/font-awesome.min.css';
import { getErrorMessage, URLS } from "../../../utils";
import { useNavigate, useParams } from "react-router-dom";
import PasswordReset from "../password-reset";
import { toast } from "react-toastify";
import "./profile.css";
import aws_config from "./aws_config";
import S3FileUpload from "react-s3";
import { Buffer } from "buffer";
import { setUserImageAction } from "../../../redux/actions/user";
import { useDispatch, useSelector } from "react-redux";
Buffer.from("anything", "base64");
window.Buffer = window.Buffer || require("buffer").Buffer;

function Profile(props) {
  let params = useParams();
  let navigate = useNavigate();
  const [profileData, setProfile] = useState({});
  const [showAnswerResponses, setShowAnswerResponses] = React.useState(false);
  const config = aws_config;
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(URLS.GET_PROFILE_DETAILS);
        if (response.status === 200) {
          setProfile(response.data);
        } else {
          throw new Error("Invalid response status: " + response.status);
        }
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    })();
  }, []);

  const profileEdit = function (e) {
    e.preventDefault();
    navigate(`/profileedit`);
  };

  const submitHandler = function (e) {
    e.preventDefault();
    var formData = e.target;
    const user = {};
    console.log("1");
    if (formData.formFileSm.files.length > 0) {
      S3FileUpload.uploadFile(formData.formFileSm.files[0], config).then(
        (data) => {
          console.log(data);
          user.image = data.location;
          user.username = formData.formBasicUsername.value;
          user.firstName = formData.formBasicFirstName.value;
          user.lastName = formData.formBasicLastName.value;
          axios
            .post(URLS.UPDATE_PROFILE_DETAILS, user, {
              "Content-Type": "multipart/form-data",
            })
            .then((response) => {
              if (response.status === 200) {
                toast.success(response.data.message);
                dispatch(setUserImageAction(data.location));
              } else {
                throw new Error("Invalid status code " + response.status);
              }
            })
            .catch((error) => {
              toast.error(getErrorMessage(error));
            });
        }
      );
    } else {
      user.username = formData.formBasicUsername.value;
      user.firstName = formData.formBasicFirstName.value;
      user.lastName = formData.formBasicLastName.value;
      axios
        .post(URLS.UPDATE_PROFILE_DETAILS, user, {
          "Content-Type": "multipart/form-data",
        })
        .then((response) => {
          if (response.status === 200) {
            toast.success(response.data.message);
          } else {
            throw new Error("Invalid status code " + response.status);
          }
        })
        .catch((error) => {
          toast.error(getErrorMessage(error));
        });
    }
  };

  const profileImageUrl = useSelector((state) => state.user.image);

  return (
    profileData != {} && (
      <div>
        <Form onSubmit={submitHandler}>
          <Row>
            <Col className="profile-left-pane">
              <img
                src={profileImageUrl}
                style={{ width: "200px", height: "200px" }}
              ></img>
              <Form.Group controlId="formFileSm" className="mb-3">
                <br />
                <Form.Control type="file" size="sm" />
              </Form.Group>
            </Col>
            <Col>
              <Card style={{ width: "25rem" }} className="profile-right-pane">
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="id"
                    defaultValue={profileData._id}
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>User Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    defaultValue={profileData.username}
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicRole">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    type="text"
                    name="role"
                    defaultValue={profileData.roles}
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicFirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstname"
                    defaultValue={profileData.firstName}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastname"
                    defaultValue={profileData.lastName}
                  />
                </Form.Group>
              </Card>
            </Col>
            <Button
              variant="primary"
              type="submit"
              className="button-save-changes"
            >
              Save Changes
            </Button>
            <Button
              onClick={() => setShowAnswerResponses(true)}
              className="button-save-changes"
            >
              Reset Password
            </Button>
          </Row>
          <PasswordReset
            username={profileData.username}
            isOpen={showAnswerResponses}
            closeModal={() => setShowAnswerResponses(false)}
          />
        </Form>
      </div>
    )
  );
}

export default Profile;
