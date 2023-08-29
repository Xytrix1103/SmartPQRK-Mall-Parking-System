import {apiPost} from "./baseAPI";
import {useQuery, useMutation} from "react-query";

export const useGetReservations = () => {
    return useQuery<any, Error, any>(
        ['getReservations'],
        async () => await apiPost('/mall/getReservations', {token: localStorage.getItem("token")}),
        {
            onSuccess: (data) => {
                console.log(data);
                return data
            }
        }
    );
}