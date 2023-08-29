import {apiPost} from "./baseAPI";
import {useMutation, useQuery} from "react-query";

export const useGetMall = () => {
    const mallQuery = async () => {
        return await apiPost('/mall/getMall', {token: localStorage.getItem("token")});
    }

    return useQuery<any, Error, any>(
        ['mall'],
        mallQuery,
        {
            onSuccess: (data) => {
                return data
            }
        }
    );
}

export const useUpdateMall = () => {
    return useMutation<any, Error, any>(
        ['updateMall'],
        (data: {}) => apiPost('/mall/update', data),
        {
            onSuccess: (data) => console.log(data),
        }
    );
}

export const useGetLotsStatus = () => {
    return useQuery<any, Error, any>(
        ['getLotsStatus'],
        async () => await apiPost('/mall/getLotsStatus', {token: localStorage.getItem("token")}),
        {
            onSuccess: (data) => {
                console.log(data);
                return data
            }
        }
    );
}