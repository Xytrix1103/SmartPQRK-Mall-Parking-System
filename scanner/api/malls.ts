import {apiPost} from "./base";
import {useQuery} from "@tanstack/react-query";
import * as SecureStore from 'expo-secure-store';
import {mall} from "./types";
import {useContext} from "react";

export const useGetMalls = () => {
    return useQuery(
        ['getMalls'],
        () => apiPost<mall[]>('/mall'),
    )
}