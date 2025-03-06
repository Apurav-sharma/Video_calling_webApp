import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom';
import { useSocket } from '../context/socketprovider';
import ReactPlayer from "react-player";
import "../screens_css/room_page.css";
import Peerservice from '../service/peer';

const Room = () => {

    const { roomID } = useParams();
    const [socketId, setconnected] = useState(null);
    const [remoteid, setremoteid] = useState(null);
    const [mystream, setmystream] = useState(null);
    const [remotestream, setremotestream] = useState(null);

    const socket = useSocket();

    const handleUserConnected = (data) => {
        // console.log(data);
        setremoteid(data.socketId);
    }

    const handleCall = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        });
        const offer = await Peerservice.getOffer();
        socket.emit("emitcall", { to: remoteid, offer });
        setmystream(stream);
    }

    const handleIncomingCall = async ({ from, offer }) => {
        setremoteid(from);
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        });

        setmystream(stream);
        const ans = await Peerservice.getAnswer();

        socket.emit("accepted", { from, ans: ans });
    }

    const sendstream = async () => {
        for (const track of mystream.getTracks()) {
            Peerservice.peer.addTrack(track, mystream);
        }
    }

    const handleCallAccept = async ({ from, ans }) => {
        await Peerservice.peer.setRemoteDescription(ans);
        sendstream();
    }

    const handleNegoneeded = useCallback(async () => {
        const offer = await Peerservice.getOffer();
        socket.emit("negoNeeded", { offer, to: remoteid })
    }, [remoteid])


    useEffect(() => {
        Peerservice.peer.addEventListener("negotiationneeded", handleNegoneeded);

        return () => {
            Peerservice.peer.removeEventListener("negotiationneeded", handleNegoneeded);
        }
    }, [handleNegoneeded])

    const handleNegoIncoming = async ({ from, offer }) => {
        const ans = await Peerservice.getAnswer(offer);
        socket.emit("negodone", { to: from, ans: ans });
    }

    const handleNegoAccept = async ({ ans }) => {
        await Peerservice.peer.setLocalDescription(ans);
    }

    useEffect(() => {
        Peerservice.peer.addEventListener("track", async (ev) => {
            const remoteStream = ev.streams;
            setremotestream(remoteStream[0]);
        })
    }, [])

    useEffect(() => {
        socket.on("user_connected", handleUserConnected);
        socket.on("incoming_call", handleIncomingCall);
        socket.on("accepted", handleCallAccept);
        socket.on('negoNeeded', handleNegoIncoming);
        socket.on('negofinal', handleNegoAccept);

        return () => { socket.off("user_connected", handleUserConnected) };
    }, [socket])

    return (
        <div>
            <h2>
                room_page {roomID}
            </h2>
            {remoteid && <h1>Connected</h1>}
            {!remoteid && <h2>Disconnected</h2>}
            {remoteid && <button className='btn btn-primary' onClick={handleCall}>Call</button>}
            {mystream && <div className='my-video'> <ReactPlayer height="200px" width={200} url={mystream} muted playing /></div>}

        </div>
    )
}

export default Room;