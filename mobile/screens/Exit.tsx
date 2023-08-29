import React, {Suspense, useCallback, useContext, useEffect, useState} from 'react';
import {FlatList, Pressable, RefreshControl, ScrollView, Text, View} from 'react-native';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {entryStyles as styles} from "../assets/styles/styles";
import {Header} from "../components/Header";
import QRCodeStyled from 'react-native-qrcode-styled';
import {format} from "date-fns";
import {useGetUser, useGetUserParked} from "../api/user";
import Icon from "@expo/vector-icons/FontAwesome";
import {Dialog, FAB, List, Portal, RadioButton, Searchbar} from "react-native-paper";
import {useGetUserNumberPlates} from "../api/numberPlates";
import {directory, floor, number_plate, parking_log, wing} from "../api/types";
import {LoadingScreen} from "../components/LoadingScreen";
import {QueryBoundaries} from "../components/QueryBoundaries";
import {useGetDirectory} from "../api/directory";
import QRCode from "react-native-qrcode-svg";
import {useGetWings} from "../api/wings";
import {useGetFloors} from "../api/floors";
import {io} from "socket.io-client";
import socket from "../api/socket";
import {ParkedContext} from "../assets/contexts/ParkedContext";
import {useFocusEffect} from "@react-navigation/native";

const Entry = ({navigation, route}: any) => {
    const insets = useSafeAreaInsets();
    const {data: user, refetch: updateUser} = useGetUser();
    const {data: number_plates} = useGetUserNumberPlates();
    const {data: directories} = useGetDirectory();
    const {data: floors} = useGetFloors();
    const {data: wings} = useGetWings();
    const {data: parking} = useGetUserParked();
    const {parked, setParked} = useContext(ParkedContext);
    const [lastEntry, setLastEntry] = useState<parking_log>({} as parking_log);

    const [qrValue, setQRValue] = useState({
        id: user?.id || 0,
        type: "exit",
    });
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            console.log("Profile focused");
            updateUser();
        }, [])
    )

    useEffect(() => {
        console.log("Exit mounted");

        socket.on("exit-success", (data: any) => {
            setParked(false);
            alert("Exit successful");
            navigation.navigate("Home");
        });

        if(!parked) {
            alert("You are not parked");
            navigation.navigate("Home");
        }

        return () => {
            socket.off("exit-success");
        }
    }, [])

    useEffect(() => {
        if(parking) {
            console.log("Setting last entry: ", parking);
            setLastEntry(parking);
        }
    }, [parking])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            updateUser();
            setRefreshing(false);
        }, 2000);
    }, []);

    if (!user) {
        return <LoadingScreen/>;
    }

    return (
        <View style={{
            flex: 1,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            width: "100%",
        }}>
            <Header navigation={navigation} route={route}/>
            <ScrollView
                contentContainerStyle={styles.rowContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
            >
                <View style={styles.qrContainer}>
                    <QRCode
                        value={JSON.stringify(qrValue)}
                        size={250}
                    />
                </View>
                <View style={styles.rowContainer}>
                    <View style={styles.row}>
                        <Text style={styles.field}>
                            {"Name: "}
                        </Text>
                        <Text style={styles.data}>
                            {user?.name}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.field}>
                            {"Car: "}
                        </Text>
                        <Text style={{
                            ...styles.data,
                            padding: 10,
                            borderWidth: 1,
                            borderColor: "black",
                            borderRadius: 5,
                            marginHorizontal: 10,
                        }}>
                            {lastEntry?.number_plate?.number_plate}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default Entry;