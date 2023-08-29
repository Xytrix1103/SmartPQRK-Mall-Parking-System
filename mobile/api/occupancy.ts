import {apiPost} from "./base";
import {useQuery} from "@tanstack/react-query";
import * as SecureStore from 'expo-secure-store';
import {mall, parking_log} from "./types";
import {AuthContext} from "../assets/contexts/AuthContext";
import {useContext} from "react";
import {MallContext} from "../assets/contexts/MallContext";

export const useGetOccupancy = () => {
    const {token} = useContext(AuthContext);
    const {mall} = useContext(MallContext);
    return useQuery(
        ['getOccupancy'],
        () => apiPost<{[key: string]: number}>('/mall/getOccupancy', {token: token, mall_id: mall?.id}),
    )
}