import {api, apiPost} from "./base";
import * as SecureStore from 'expo-secure-store';
import {useMutation, useQuery} from "@tanstack/react-query";
import {floor} from "./types";
import {useContext} from "react";
import {MallContext} from "../assets/contexts/MallContext";

export const useGetFloors = () => {
    const {mall} = useContext(MallContext);

    return useQuery(
        ['getFloors'],
        async () => await apiPost<floor[]>('/floors/getFromID', {mall_id: mall?.id}),
    )
}