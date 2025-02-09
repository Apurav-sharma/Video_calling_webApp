import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import { useSocket } from '../context/socketprovider';

const Room = () => {

    const { roomID } = useParams();
    var [connected, setconnected] = useState(null);

    const socket = useSocket();

    const handleUserConnected = (data) => {
        console.log(data);
        setconnected(true);
    }

    useEffect(() => {
        socket.on("user_connected", handleUserConnected);
        return () => socket.off("user_connected", handleUserConnected);
    }, [socket])

    return (
        <div>
            <h2>
                room_page {roomID}
            </h2>
            {connected && <h1>Connected</h1>}
            {!connected && <h2>Disconnected</h2>}


        </div>
    )
}

export default Room;