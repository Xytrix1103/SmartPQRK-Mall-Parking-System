import {api, apiPost} from "./base";
import * as SecureStore from 'expo-secure-store';
import {useMutation, useQuery} from "@tanstack/react-query";
import {directory} from "./types";
import {MallContext} from "../assets/contexts/MallContext";
import {useContext} from "react";

export const useGetDirectory = () => {
    const {mall} = useContext(MallContext);

    return useQuery(
        ['getDirectory'],
        async () => await apiPost<directory[]>('/directory/getFromID', {mall_id: mall?.id}),
    )
}