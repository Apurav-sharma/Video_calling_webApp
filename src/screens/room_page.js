import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useSocket } from '../context/socketprovider';
import ReactPlayer from "react-player";
import "../screens_css/room_page.css";
import Peerservice from '../service/peer';

const Room = () => {

    const { roomID } = useParams();
    const [socketId, setconnected] = useState(null);
    const [mystream, setmystream] = useState(null);

    const socket = useSocket();

    const handleUserConnected = (data) => {
        // console.log(data);
        setconnected(data.socketId);
    }

    const handleCall = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        });
        const offer = await Peerservice.getOffer();
        socket.emit("emitcall", {to: socketId, offer});
        setmystream(stream);
    }

    const handleCallAccept = async (data) => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        })

        const {from, offer} = data;
        setmystream(stream);
        setconnected(from);
        const ans = await Peerservice.getAnswer();
        socket.emit("accepted", {})


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
            {socketId && <h1>Connected</h1>}
            {!socketId && <h2>Disconnected</h2>}
            {socketId && <button className='btn btn-primary' onClick={handleCall}>Call</button>}
            {mystream && <div className='my-video'> <ReactPlayer height="200px" width={200} url={mystream} muted playing /></div>}

        </div>
    )
}

export default Room;