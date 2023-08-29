import {apiPost} from "./base";
import {useMutation} from "@tanstack/react-query";
import socket from "./socket";

export const useCreateEntry = () => {
    return useMutation<any, Error, any>(
        async (data) => await apiPost<any>('/entry', data),
        {
            onSuccess: (data) => {
                socket.emit('entry-success-send', data);
                return data;
            },
            onError: (error) => {
                console.log(error);
            }
        }
    );
}