import {apiPost} from "./base";
import {mall} from "./types";
import {AuthContext} from "../assets/contexts/AuthContext";
import {useContext} from "react";
import {useNavigation} from "@react-navigation/native";
import {useMutation, useQuery} from "@tanstack/react-query";

export const useGetMalls = () => {
    return useQuery(
        ['getMalls'],
        () => apiPost<mall[]>('/mall'),
    )
}