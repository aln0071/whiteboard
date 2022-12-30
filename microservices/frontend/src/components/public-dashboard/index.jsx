import React from "react";
import Button from 'react-bootstrap/Button';
import {useNavigate} from 'react-router-dom'

export default function PublicDashboard() {
    const navigate = useNavigate();
    return <div>
        public dashboard
        <br/>
        Welcome to collaborative whiteboard!
        <br/>
        <Button variant="primary" onClick={() => navigate('/login')}>Login</Button>{'  '}
        <Button variant="primary" onClick={() => navigate('/register')}>Register</Button>{'  '}
    </div>
}