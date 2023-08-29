import {io} from "socket.io-client";
import {wsURL} from './config';
import {useContext} from "react";
import * as SecureStore from 'expo-secure-store';

const socket = io(wsURL,{
    auth: {
        token: "station"
    }
});

export default socket;