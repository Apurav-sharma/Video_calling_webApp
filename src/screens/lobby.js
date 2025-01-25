import React, { useState } from 'react'
import "../screens_css/lobby.css";
import { useSocket } from '../context/socketprovider';

export const Lobby = () => {

    var [email, setemail] = useState("");
    var [roomNo, setroomNo] = useState("");
    const socket = useSocket();

    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit('join_room', {
            email, roomNo
        });
        // console.log(email, roomNo);
    }

    return (
        <div className='lobby'>
            <div className='form'>
                <h1>Join Meeting</h1>
                <input type='email' placeholder='Enter email...' className='form-control w-75' onChange={(e) => { setemail(e.target.value) }} value={email} />
                <input type='text' placeholder='Enter Room number...' className='form-control w-75' onChange={(e) => { setroomNo(e.target.value) }} value={roomNo} />
                <button className='btn btn-success w-50' onClick={handleSubmit}>Login</button>
            </div>
        </div>
    )
}
