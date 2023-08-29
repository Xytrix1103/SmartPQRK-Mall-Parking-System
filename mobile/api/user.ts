import {api, apiPost} from "./base";
import * as SecureStore from 'expo-secure-store';
import {useMutation, useQuery} from "@tanstack/react-query";
import {parking_log, user} from "./types";
import {AuthContext} from "../assets/contexts/AuthContext";
import {useCallback, useContext, useEffect, useState} from "react";
import {useFocusEffect} from "@react-navigation/native";

export const useGetUser = () => {
    const {token} = useContext(AuthContext);

    return useQuery(
        ['getUser'],
        () => apiPost<user>('/users/getUser', {token: token}),
    )
}

export const useUpdateUser = () => {
    const {token} = useContext(AuthContext);

    return useMutation<any, Error, any>(
        async (data) => await apiPost<any>('/users/updateUser', {...data, token: token})
    );
}

export const useGetUserParked = () => {
    const {token} = useContext(AuthContext);

    return useQuery(
        ['getUserParked'],
        () => apiPost<parking_log>('/users/getParked', {token: token}),
    )
}

export const useAddNumberPlate = () => {
    const {token} = useContext(AuthContext);

    return useMutation<any, Error, any>(
        async (data) => await apiPost<any>('/users/addNumberPlate', {...data, token: token})
    );
}

export const useRegister = () => {
    const {login} = useContext(AuthContext);

    return useMutation<any, Error, any>(
        async (data) => await apiPost<any>('/users/register', data),
        {
            onSuccess: (data) => {
                login({username: data.username, password: data.password}).then(() => {
                    return data;
                });
            }
        }
    );
}

export const useReserveParking = () => {
    const {token} = useContext(AuthContext);

    return useMutation<any, Error, any>(
        async (data) => await apiPost<any>('/reserve', {...data, token: token})
    );
}

export const useCancelReservation = () => {
    const {token} = useContext(AuthContext);

    return useMutation<any, Error, any>(
        async (data) => await apiPost<any>('/reserve/cancel', {...data, token: token})
    );
}