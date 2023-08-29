import {apiPost} from "./baseAPI";
import {useQuery, useMutation} from "react-query";

export const useGetUsers = () => {
    return useQuery<any, Error, any>(
        ['getUsers'],
        () => apiPost('/users/getUsers', {token: localStorage.getItem("token")}),
        {
            onSuccess: (data) => {
                console.log(data);
                return data
            }
        }
    );
}