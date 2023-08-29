import {apiPost} from "./baseAPI";
import {useMutation} from "react-query";

export const useGetDirectory = () => {
    return useMutation<any, Error, any>(
        ['getDirectory'],

        async () => apiPost('/directory', { token: localStorage.getItem("token") }),
        {
            onSuccess: (data) => {
                console.log(data);
                return data
            }
        }
    );
}

export const useUpdateDirectory = () => {
    return useMutation<any, Error, any>(
        ['updateDirectory'],
        (data: {}) => apiPost('/directory/update', data),
        {
            onSuccess: (data) => console.log(data),
        }
    );
}

export const useDeleteDirectory = () => {
    return useMutation<any, Error, any>(
        ['deleteDirectory'],
        (data: {}) => apiPost('/directory/delete', data),
        {
            onSuccess: (data) => console.log(data),
        }
    );
}

export const useCreateDirectory = () => {
    return useMutation<any, Error, any>(
        ['createDirectory'],
        (data: {}) => apiPost('/directory/create', {...data, token: localStorage.getItem("token")}),
        {
            onSuccess: (data) => {
                return data;
            }
        }
    );
}