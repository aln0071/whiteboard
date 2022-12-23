import React from "react";
import Button from "react-bootstrap/Button";
import { useLoaderData, useNavigate } from 'react-router-dom'

export default function PrivateDashboard() {
    const navigate = useNavigate();
    const logout = () => {
        window.localStorage.removeItem('accessToken')
        navigate('/')
    }
    const accessToken = useLoaderData();
    console.log(accessToken)
    return <div>
        private dashboard
        <br/>
        <Button variant="primary" onClick={logout}>Logout</Button>{'  '}
    </div>
}