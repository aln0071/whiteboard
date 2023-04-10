import React from "react";
import Container from 'react-bootstrap/Container';
import Button from "react-bootstrap/Button";
import Navbar from 'react-bootstrap/Navbar';

function CustomNavbar() {
    const logout = async () => {
        try {
            const response = await axios.post(URLS.LOGOUT);
            if (response.status === 200) {
                navigate(response.data.redirectURL);
            } else {
                throw new Error("Logout request failed!");
            }
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };


    const createRandomWhiteboard = () => {
        const name = crypto
            .randomBytes(32)
            .toString("base64")
            .replace(/[^\w]/g, "-");
        createWhiteboardWithName(name);
    };


    return (
        <>
            <Navbar bg="dark" variant="dark" style={{ "height": "4rem" }}>
                <div style={{ "paddingLeft": "6px" }}>
                    <Navbar.Brand href="#home">
                        Snigdha's Dashboard
          </Navbar.Brand>
                    <div style={{
                        "float": "right",
                        "right": "21px",
                        "position": "absolute",
                        "margin-top": "-32px"
                    }}>
                        <Button
                            variant="light"
                            onClick={() => (window.location.href = "/wbo/boards/anonymous")}
                        >
                            Open Public Whiteboard
      </Button>
                        {"  "}
                        <Button variant="light" onClick={logout}>
                            Logout
      </Button>
                    </div>
                </div>
            </Navbar>
        </>
    );
}

export default CustomNavbar;