import {api, apiPost} from "./base";
import * as SecureStore from 'expo-secure-store';
import {useMutation, useQuery} from "@tanstack/react-query";
import {number_plate, user} from "./types";

export const useGetUserNumberPlates = () => {
    return useQuery(
        ['getUserNumberPlates'],
        async () => await apiPost<number_plate[]>('/users/getNumberPlates', {token: await SecureStore.getItemAsync('token')}),
    )
}