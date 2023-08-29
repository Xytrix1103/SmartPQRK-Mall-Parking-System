import {io} from "socket.io-client";
import {wsURL} from './config';
import {AuthContext} from "../assets/contexts/AuthContext";
import {useContext} from "react";
import * as SecureStore from 'expo-secure-store';

const socket = io(wsURL,{
    auth: async (cb) => {
        const token = await SecureStore.getItemAsync('token');
        cb({token});
    }
});

export default socket;