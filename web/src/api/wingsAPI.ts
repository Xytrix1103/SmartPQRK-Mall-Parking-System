import {apiGet, apiPost} from "./baseAPI";
import {useMutation, useQuery} from "react-query";

export const useGetWings = (onSuccess : (data: any) => void) => {
    const wingQuery = () => apiPost('/wings',
        {
            mall_id: parseInt(localStorage.getItem('mall_id') || "0"),
            token: localStorage.getItem('token') || ""
        }
    )

    return useQuery<any, Error, any>(
        ['wing'],
        wingQuery,
        {
            onSuccess: (data) => onSuccess(data),
        }
    );
}

export const useUpdateWing = (onSuccess : (data: any) => void) => {
    return useMutation<any, Error, any>(
        ['updateWing'],
        (data: {}) => apiPost('/wings/update', data),
        {
            onSuccess: (data) => onSuccess(data)
        }
    );
}

export const useDeleteWing = (onSuccess : (data: any) => void) => {
    return useMutation<any, Error, any>(
        ['deleteWing'],
        (data: {}) => apiPost('/wings/delete', data),
        {
            onSuccess: (data) => onSuccess(data)
        }
    );
}

export const useCreateWing = (onSuccess : (data: any) => void) => {
    return useMutation<any, Error, any>(
        ['createWing'],
        (data: {}) => apiPost('/wings/create', data),
        {
            onSuccess: (data) => onSuccess(data)
        }
    );
}