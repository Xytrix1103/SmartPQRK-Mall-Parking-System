import {api, apiPost} from "./base";
import * as SecureStore from 'expo-secure-store';
import {useMutation, useQuery} from "@tanstack/react-query";
import {parking_log, user} from "./types";
import {AuthContext} from "../assets/contexts/AuthContext";
import {useContext, useEffect, useState} from "react";

export const useGetHistory = () => {
    const {token} = useContext(AuthContext);

    return useQuery(
        ['getHistory'],
        () => apiPost<parking_log[]>('/users/getHistory', {token: token}),
    )
}