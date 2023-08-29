import {api, apiPost} from "./base";
import * as SecureStore from 'expo-secure-store';
import {useMutation, useQuery} from "@tanstack/react-query";
import {wing} from "./types";
import {useContext} from "react";
import {MallContext} from "../assets/contexts/MallContext";

export const useGetWings = () => {
    const {mall} = useContext(MallContext);

    return useQuery(
        ['getWings'],
        async () => await apiPost<wing[]>('/wings/getFromID', {mall_id: mall?.id}),
    )
}