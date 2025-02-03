import React from 'react'
import { useParams } from 'react-router-dom';

const Room = () => {

    const { roomID } = useParams();

    return (
        <div>room_page {roomID}</div>
    )
}

export default Room;