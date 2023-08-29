import {apiGet, apiPost} from "./baseAPI";
import {useQuery, useMutation} from "react-query";

export const useGetLots = () => {
    return useQuery<any, Error, any>(
        ['getLots'],
        () => apiPost('/lots', {token: localStorage.getItem('token')}),
        {
            onSuccess: (data) => {
                return data
            },
        }
    );
}

export const useUpdateLot = () => {
    return useMutation<any, Error, any>(
        ['updateLot'],
        (data: {}) => apiPost('/lots/update', data),
        {
            onSuccess: (data) => console.log(data),
        }
    );
}

export const useDeleteLot = () => {
    return useMutation<any, Error, any>(
        ['deleteLot'],
        (data: {}) => apiPost('/lots/delete', data),
        {
            onSuccess: (data) => console.log(data),
        }
    );
}

export const useCreateLot = () => {
    return useMutation<any, Error, any>(
        ['createLot'],
        (data: {}) => apiPost('/lots/create', {...data, token: localStorage.getItem('token')}),
        {
            onSuccess: (data) => {
                return data;
            }
        }
    );
}