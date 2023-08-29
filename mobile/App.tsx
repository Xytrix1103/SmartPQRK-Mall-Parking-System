import React, {useCallback, useEffect, useState} from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NavigationContainer from '@react-navigation/native/src/NavigationContainer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home'
import Login from './screens/Login';
import Register from './screens/Register';
import Entry from './screens/Entry';
import History from './screens/History';
import * as SecureStore from "expo-secure-store";
import {api, checkServerStatus} from "./api/base";
import {AuthContext} from "./assets/contexts/AuthContext";
import {MallContext} from "./assets/contexts/MallContext";
import {
    SafeAreaProvider,
} from 'react-native-safe-area-context';
import {useGetMalls} from "./api/malls";
import Maintenance from "./screens/Maintenance";
import {mall, parking_log} from "./api/types";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {Socket} from "socket.io";
import socket from "./api/socket";
import {BarCodeScanner} from "expo-barcode-scanner";
import {SocketContext} from "./assets/contexts/SocketContext";
import {ParkedContext} from "./assets/contexts/ParkedContext";
import {useGetUserParked} from "./api/user";
import {useFocusEffect} from "@react-navigation/native";
import Exit from "./screens/Exit";
import Reserve from "./screens/Reserve";
import { ReservedContext } from './assets/contexts/ReservedContext';
import Profile from "./screens/Profile";

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
    const [token, setToken] = useState(null as string | null);
    const [mall, setMall] = useState({id: 0, name: "", address: "", vacant: 0, total: 0} as mall);
    const [serverStatus, setServerStatus] = useState(true);
    const [socketStatus, setSocketStatus] = useState(true);
    const [parked, setParked] = useState(false);
    const [reserved, setReserved] = useState(false);

    useEffect(() => {
        console.log("App mounted");

        (async () => {
            console.log("Bootstrapping");
            try {
                setToken(await SecureStore.getItemAsync('token') || "");
                setMall(JSON.parse(await SecureStore.getItemAsync('mall') || JSON.stringify({id: 0, name: "", address: "", vacant: 0, total: 0})));
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

        socket.on('reservation-expired', (data: any) => {
            alert("Your reservation has expired. Please make a new reservation.");
            setReserved(false);
        });

        socket.on('exit-success', (data: any) => {
            console.log(data);
            setParked(false);
            alert("Exit successful! Thanks for your visit.");
        });

        socket.on('entry-qrcode-warning', (data: any) => {
            alert("Please scan a valid entry QR code.");
        });

        socket.on('exit-qrcode-warning', (data: any) => {
            alert("Please scan a valid exit QR code.");
        });

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('reservation-expired');
            socket.off('entry-success');
            socket.off('exit-success');
            socket.off('entry-qrcode-warning');
            socket.off('exit-qrcode-warning');
        };
    }, []);

    useEffect(() => {
        console.log("parked: " + parked);

        if(parked) {
            setReserved(false);
        }
    }, [parked])

    useEffect(() => {
        console.log("reserved: " + reserved);

        if(reserved) {
            setParked(false);
        }
    }, [reserved])

    useEffect(() => {
        setSocketStatus(socket.connected);
    }, [socket.connected]);

    useEffect(() => {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }, [token]);

    useEffect(() => {
        console.log("Mall changed");
        console.log(mall);
        if (mall && mall?.id !== 0) {
            (async () => {
                await SecureStore.setItemAsync('mall', JSON.stringify(mall));
            })();
        }
    }, [mall]);

    const getUserID = async () => {
        try {
            const res = await api.post('/token/getUserID', {token: token || ""});
            console.log(res.data);
            return res.data;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to get user ID. Please try again.');
        }
    }

    const login = async (loginRequest: any) => {
        try {
            const res = await api.post('/login/user', loginRequest);
            console.log(res.data);
            await SecureStore.setItemAsync('token', res.data.token || "");
            setToken(res.data.token);
            return res.data;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to login. Please try again.');
        }
    };

    const logout = () => {
        console.log("Logging out");
        api.defaults.headers.common["Authorization"] = undefined;
        setToken("");
    };

    const verifyToken = async () => {
        const token = await SecureStore.getItemAsync('token');
        return await api.post('/token/verify', {token: token}).then((res) => {
            return res.data.success;
        })
    }

    return (
        <SafeAreaProvider>
            <PaperProvider>
                <QueryClientProvider client={queryClient}>
                    <AuthContext.Provider value={{token, setToken, login, logout}}>
                        <MallContext.Provider value={{mall, setMall}}>
                            <SocketContext.Provider value={{socketStatus}}>
                                <ParkedContext.Provider value={{parked, setParked}}>
                                    <ReservedContext.Provider value={{reserved, setReserved}}>
                                        <NavigationContainer>
                                            {
                                                token != null && mall != null &&
                                                <Stack.Navigator screenOptions={{headerShown: false}}>
                                                    {
                                                        !serverStatus || !socketStatus ? (
                                                            <Stack.Screen name='Maintenance' component={Maintenance} />
                                                        ) : (
                                                            token == "" ?
                                                            (
                                                                <>
                                                                    <Stack.Screen name='Login' component={Login} />
                                                                    <Stack.Screen name='Register' component={Register} />
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Stack.Screen name='Home' component={Home} />
                                                                    <Stack.Screen name='Entry' component={Entry} />
                                                                    <Stack.Screen name='Exit' component={Exit} />
                                                                    <Stack.Screen name='Reserve' component={Reserve} />
                                                                    <Stack.Screen name='History' component={History} />
                                                                    <Stack.Screen name='Profile' component={Profile} />
                                                                </>
                                                            )
                                                        )
                                                    }
                                                </Stack.Navigator>
                                            }
                                        </NavigationContainer>
                                    </ReservedContext.Provider>
                                </ParkedContext.Provider>
                            </SocketContext.Provider>
                        </MallContext.Provider>
                    </AuthContext.Provider>
                </QueryClientProvider>
            </PaperProvider>
        </SafeAreaProvider>
    );
}