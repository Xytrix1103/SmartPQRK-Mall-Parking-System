import {apiPost} from "./baseAPI";
import {useQuery, useMutation} from "react-query";

export const useGetParkingActivity = () => {
    return useQuery<any, Error, any>(
        ['getParkingActivity'],
        async () => await apiPost('/mall/getParkingActivity', {token: localStorage.getItem("token")}),
        {
            onSuccess: (data) => {
                console.log(data);
                return data
            }
        }
    );
}

export const useGetActivityByMonth = () => {
    return useQuery<any, Error, any>(
        ['getActivityByMonth'],
        async () => await apiPost('/mall/getActivityByMonth', {token: localStorage.getItem("token")}),
        {
            onSuccess: (data) => {
                console.log(data);
                return data
            }
        }
    );
}

export const useGetRevenueByMonth = () => {
    return useQuery<any, Error, any>(
        ['getRevenueByMonth'],
        async () => await apiPost('/mall/getRevenueByMonth', {token: localStorage.getItem("token")}),
        {
            onSuccess: (data) => {
                console.log(data);
                return data
            }
        }
    );
}

export const useGetParkingHoursByMonth = () => {
    return useQuery<any, Error, any>(
        ['getParkingHoursByMonth'],
        async () => await apiPost('/mall/getParkingHoursByMonth', {token: localStorage.getItem("token")}),
        {
            onSuccess: (data) => {
                console.log(data);
                return data
            }
        }
    );
}