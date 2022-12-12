import React from "react";
import io from 'socket.io-client'

const socket = io("ws://localhost:8080");

export default function Test() {
    const [isConnected, setIsConnected] = React.useState(socket.connected);
    // const [lastPong, setLastPong] = React.useState(null);

    React.useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
        })

        socket.on('disconnect', () => {
            setIsConnected(false);
        })

        return () => {
            socket.off('connect')
            socket.off('disconnect')
        }

    }, [])

    return(
        <div>
            <p>Connected: {'' + isConnected}</p>
        </div>
    )

}