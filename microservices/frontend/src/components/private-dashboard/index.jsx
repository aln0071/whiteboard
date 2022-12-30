import React from "react";
import Button from "react-bootstrap/Button";
import { useLoaderData, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { getErrorMessage, URLS } from "../../utils";

export default function PrivateDashboard() {
    const navigate = useNavigate();
    const logout = async () => {
        try {
            const response = await axios.post(URLS.LOGOUT)
            if(response.status === 200) {
                navigate(response.data.redirectURL)
            } else {
                throw new Error("Logout request failed!")
            }
        } catch(error) {
            toast.error(getErrorMessage(error));
        }
    }
    const accessToken = useLoaderData();
    console.log(accessToken)
    return <div>
        private dashboard
        <br/>
        <Button variant="primary" onClick={() => window.location.href = '/wbo/boards/anonymous'}>Anonymous Whiteboard</Button>{'  '}
        <Button variant="primary" onClick={logout}>Logout</Button>{'  '}
    </div>
}