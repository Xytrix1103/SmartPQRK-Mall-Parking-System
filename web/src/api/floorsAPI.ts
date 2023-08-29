import {apiGet, apiPost} from "./baseAPI";
import {useMutation, useQuery} from "react-query";

export const useGetFloors = (onSuccess : (data: any) => void) => {
    const floorQuery = () => apiPost('/floors',
        {
            token: localStorage.getItem('token') || ""
        }
    )

    return useQuery<any, Error, any>(
        ['floor'],
        floorQuery,
        {
            onSuccess: (data) => onSuccess(data),
        }
    );
}

export const useUpdateFloor = (onSuccess : (data: any) => void) => {
    return useMutation<any, Error, any>(
        ['updateFloor'],
        (data: {}) => apiPost('/floors/update', data),
        {
            onSuccess: (data) => onSuccess(data)
        }
    );
}

export const useDeleteFloor = (onSuccess : (data: any) => void) => {
    return useMutation<any, Error, any>(
        ['deleteFloor'],
        (data: {}) => apiPost('/floors/delete', data),
        {
            onSuccess: (data) => onSuccess(data)
        }
    );
}

export const useCreateFloor = (onSuccess : (data: any) => void) => {
    return useMutation<any, Error, any>(
        ['createFloor'],
        (data: {}) => apiPost('/floors/create', data),
        {
            onSuccess: (data) => onSuccess(data)
        }
    );
}