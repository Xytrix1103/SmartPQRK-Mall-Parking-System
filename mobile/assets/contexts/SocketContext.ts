import {createContext, SetStateAction} from "react";
import {mall} from "../../api/types";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {Socket} from "socket.io";

export const SocketContext = createContext({
    socketStatus: true as boolean,
});