import {apiPost} from "./baseAPI";
import {useQuery, useMutation} from "react-query";

export const useGetAdmins = () => {
    return useMutation<any, Error, any>(
        ['getAdmins'],
        () => apiPost('/admins', {token: localStorage.getItem("token")}),
        {
            onSuccess: (data) => {
                return data
            },
        }
    );
}

export const useGetAdmin = () => {
    return useQuery<any, Error, any>(
        ['getAdmin'],
        () => apiPost('/admins/getAdmin', {token: localStorage.getItem("token")}),
        {
            onSuccess: (data) => {
                return data
            },
        }
    );
}

export const useUpdateAdmin = () => {
    return useMutation<any, Error, any>(
        ['updateAdmin'],
        (data: {}) => apiPost('/admins/update', data),
        {
            onSuccess: (data) => console.log(data),
        }
    );
}

export const useDeleteAdmin = () => {
    return useMutation<any, Error, any>(
        ['deleteAdmin'],
        (data: {}) => apiPost('/admins/delete', data),
        {
            onSuccess: (data) => console.log(data),
        }
    );
}

export const useCreateAdmin = () => {
    return useMutation<any, Error, any>(
        ['createAdmin'],
        (data: {}) => apiPost('/admins/create', {...data, token: localStorage.getItem("token")}),
        {
            onSuccess: (data) => {
                return data;
            }
        }
    );
}