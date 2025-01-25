import React, { useMemo, createContext, useContext } from 'react'
import { io } from "socket.io-client";

const socketContext = createContext(null);

export const useSocket = () => {
    const socket = useContext(socketContext);
    return socket;
}

export const Socketprovider = (props) => {

    const socket = useMemo(() => io("localhost:8000"), []);

    return (
        <socketContext.Provider value={socket}>
            {props.children}
        </socketContext.Provider>
    )
}
