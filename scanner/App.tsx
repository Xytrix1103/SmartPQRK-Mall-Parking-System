import React, {useCallback, useEffect, useState} from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NavigationContainer from '@react-navigation/native/src/NavigationContainer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Scanner from './screens/Scanner';
import {api, checkServerStatus} from "./api/base";
import {
    SafeAreaProvider,
} from 'react-native-safe-area-context';
import {station, mall} from "./api/types";
import socket from "./api/socket";
import {SocketContext} from "./assets/contexts/SocketContext";
import * as SecureStore from "expo-secure-store";
import {StationContext} from "./assets/contexts/StationContext";
import { MallContext } from './assets/contexts/MallContext';
import {useFocusEffect} from "expo-router";

const Stack = createNativeStackNavigator();

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: true,
            refetchOnMount: true,
            refetchOnReconnect: true,
            networkMode: "online",
        }
    }
});

export default function App() {
    const [station, setStation] = useState({id: 0, is_entrance: true, mall_id: 0} as station);
    const [mall, setMall] = useState({id: 0, name: "", address: ""} as mall);
    const [serverStatus, setServerStatus] = useState(true);
    const [socketStatus, setSocketStatus] = useState(true);

    useEffect(() => {
        console.log("App mounted");

        (async () => {
            console.log("Bootstrapping");
            try {
                setMall(JSON.parse(await SecureStore.getItemAsync('mall') || JSON.stringify({id: 0, name: "", address: ""})));
                setStation(JSON.parse(await SecureStore.getItemAsync('station') || JSON.stringify({id: 0, is_entrance: true, mall_id: 0})));
                setServerStatus(await checkServerStatus());
            } catch (e) {
                console.error(e);
            }
        })();

        function onConnect() {
            setSocketStatus(true);
        }

        function onDisconnect() {
            setSocketStatus(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, []);

    useEffect(() => {
        setSocketStatus(socket.connected);
    }, [socket.connected]);

    useEffect(() => {
        console.log("Mall changed");
        console.log(mall);
        (async () => {
            try {
                await SecureStore.setItemAsync('mall', JSON.stringify(mall));
            } catch (e) {
                console.error(e);
            }
            console.log("New mall set: " + await SecureStore.getItemAsync('mall'));
        })();
    }, [mall]);

    useEffect(() => {
        console.log("Station changed");
        console.log(station);
        (async () => {
            try {
                await SecureStore.setItemAsync('station', JSON.stringify(station));
            } catch (e) {
                console.error(e);
            }
        })();
    }, [station]);

    return (
        <SafeAreaProvider>
            <PaperProvider>
                <QueryClientProvider client={queryClient}>
                    <SocketContext.Provider value={{socketStatus}}>
                        <MallContext.Provider value={{mall, setMall}}>
                            <StationContext.Provider value={{station, setStation}}>
                                <NavigationContainer>
                                    <Stack.Navigator>
                                        <Stack.Screen name="Scanner" component={Scanner} />
                                    </Stack.Navigator>
                                </NavigationContainer>
                            </StationContext.Provider>
                        </MallContext.Provider>
                    </SocketContext.Provider>
                </QueryClientProvider>
            </PaperProvider>
        </SafeAreaProvider>
    );
}