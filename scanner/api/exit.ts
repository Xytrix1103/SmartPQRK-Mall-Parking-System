import {apiPost} from "./base";
import {useMutation} from "@tanstack/react-query";
import socket from "./socket";

export const useExit = () => {
    return useMutation<any, Error, any>(
        async (data) => await apiPost<any>('/exit', data),
        {
            onSuccess: (data) => {
                socket.emit('exit-success-send', data);
                return data;
            },
            onError: (error) => {
                console.log(error);
            }
        }
    );
}