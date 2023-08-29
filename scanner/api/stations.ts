import {apiPost} from "./base";
import {useQuery} from "@tanstack/react-query";
import * as SecureStore from 'expo-secure-store';
import {mall, station} from "./types";
import {useContext, useEffect, useState} from "react";
import {MallContext} from "../assets/contexts/MallContext";

export const useGetStations = () => {
    const [stations, setStations] = useState<station[]>([]);
    const {mall} = useContext(MallContext);

    useEffect(() => {
        if(mall) {
            apiPost<station[]>('/stations', {mall_id: mall ? mall.id : 1})
            .then(res => {
                setStations(res);
            })
        }
    }, [mall])

    return stations;
}