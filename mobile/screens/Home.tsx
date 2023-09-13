import React, {useCallback, useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Pressable, Image, ScrollView, RefreshControl} from 'react-native';
import {Divider, Button, Text, HelperText, Dialog, Portal, RadioButton, FAB, Surface} from 'react-native-paper';
import {useGetUser, useGetUserParked} from "../api/user";
import {AuthContext} from "../assets/contexts/AuthContext";
import Icon from "@expo/vector-icons/MaterialIcons";
import UserIcon from "@expo/vector-icons/FontAwesome";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {homeStyles as styles} from "../assets/styles/styles";
import {Header} from "../components/Header";
import {useGetMalls} from "../api/malls";
import {LoadingScreen} from "../components/LoadingScreen";
import {mall, parking_log} from "../api/types";
import {MallContext} from "../assets/contexts/MallContext";
import * as SecureStore from 'expo-secure-store';
import socket from "../api/socket";
import {ParkedContext} from "../assets/contexts/ParkedContext";
import {useGetOccupancy} from "../api/occupancy";
import {apiPost} from "../api/base";
import {useFocusEffect} from "@react-navigation/native";
import {useGetHistory} from "../api/history";
import {ReservedContext} from "../assets/contexts/ReservedContext";
import {format} from "date-fns";

const Home = ({navigation}: any) => {
    const [showMallDialog, setShowMallDialog] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const {data: user, refetch: updateUser} = useGetUser();
    const {data: malls, refetch: updateMalls} = useGetMalls();
    const insets = useSafeAreaInsets();
    const isFocused = navigation.isFocused();

    const {logout, token, setToken} = useContext(AuthContext);
    const {mall, setMall} = useContext(MallContext);
    const {parked, setParked} = useContext(ParkedContext);
    const {reserved, setReserved} = useContext(ReservedContext);

    //run onrefresh when navigating to this page from another page
    useEffect(() => {
        if(isFocused) {
            onRefresh();
        }
    }, [isFocused])

    const onRefresh = useCallback(() => {
        console.log("Refreshing");
        setRefreshing(true);
        setTimeout(() => {
            updateUser();
            updateMalls();
            setRefreshing(false);
        }, 2000);
    }, []);

    //update malls every second when focused
    // useFocusEffect(
    //     useCallback(() => {
    //         const interval = setInterval(() => {
    //             updateMalls();
    //             console.log("Updating malls");
    //         }, 3000);
    //         return () => clearInterval(interval);
    //     }, [])
    // );

    useEffect(() => {
        console.log("Home mounted");
        console.log(socket.connected);
        updateUser();
        updateMalls();
    }, [])

    useFocusEffect(
        onRefresh
    )

    useEffect(() => {
        if(malls) {
            console.log("Malls: ", malls);
            setMall(malls.find(m => m.id == mall?.id) || malls[0]);
        }
    }, [malls])

    useEffect(() => {
        console.log("Mall: ", mall);
    }, [mall])

    useEffect(() => {
        let latestPark = null;
        let latestRes = null;

        if(user?.parking_log) {
            latestPark = user?.parking_log?.[0];
        }

        if(user?.reservations) {
            latestRes = user?.reservations[0];
        }

        console.log("Latest park: ", latestPark);

        if(latestPark) {
            if(latestPark.exit_datetime == null) {
                console.log("Parked");
                setParked(true);
            } else {
                setParked(false);
            }
        }

        if(latestRes && !parked) {
            if(!latestRes.is_expired && !latestRes.is_cancelled && latestRes.is_fulfilled == null) {
                console.log("Reserved");
                setReserved(true);
            } else {
                setReserved(false);
            }
        }
    }, [user])

    useEffect(() => {
        updateUser();
        updateMalls();
        console.log("parked: ", parked);
        console.log("reserved: ", reserved);
    }, [parked, reserved])

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
        }}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                contentContainerStyle={
                    styles.container
                }
            >
                <FAB
                    style={styles.fab}
                    animated={true}
                    icon="map-marker"
                    variant="primary"
                    onPress={() => {
                        setShowMallDialog(true);
                    }}
                />
                <Pressable
                    style={styles.historyButton}
                    onPress={() => navigation.navigate('History')}
                >
                    <Icon name="history" size={30} color="black"/>
                </Pressable>
                <Image
                    source={require('../assets/images/logo.png')}
                    style={styles.logo}
                />
                <Text style={styles.heading}>Welcome, {user?.name}</Text>
                <Divider style={{
                    width: '80%',
                    height: 1,
                    backgroundColor: 'black',
                    marginTop: 10,
                }} />
                <Text style={styles.heading}>{mall?.name}</Text>
                <Text style={styles.subheading}>Available Parking: {mall?.vacant + "/" + mall?.total}</Text>
                {reserved && !refreshing && !user?.reservations?.[0]?.is_expired && !user?.reservations?.[0]?.is_cancelled && !user?.reservations?.[0]?.is_fulfilled && (
                    <Pressable
                        onPress={() => {
                            navigation.navigate('Entry');
                        }}
                        style={{
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 20,
                        }}
                    >
                        <Surface style={styles.statusContainer}>
                            <Icon
                                name="touch-app"
                                size={30}
                                color="black"
                                style={{
                                    position: 'absolute',
                                    top: 10,
                                    right: 10,
                                }}
                            />
                            <Text style={{...styles.subheading, fontWeight: "bold"}}>Reservation</Text>
                            <Text style={styles.subheading}>
                                {
                                    "Lot " + user?.reservations?.[0]?.lot?.lot_no + ", " +
                                    user?.reservations?.[0]?.lot?.floor?.floor_no + "F-" +
                                    user?.reservations?.[0]?.lot?.section
                                }
                            </Text>
                            <Text style={styles.subheading}>
                                {
                                    format( new Date(user?.reservations?.[0]?.reservation_datetime || 0), 'd/M/yy h:mm aa') +
                                    format( new Date(new Date(user?.reservations?.[0]?.reservation_datetime || 0).getTime() + 30*60*1000), ' - h:mm aa')
                                }
                            </Text>
                        </Surface>
                    </Pressable>
                )}
                {parked && !refreshing && (
                    <Pressable
                        onPress={() => {
                            navigation.navigate('Exit');
                        }}
                        style={{
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 20,
                        }}
                    >
                        <Surface style={styles.statusContainer}>
                            <Icon
                                name="touch-app"
                                size={30}
                                color="black"
                                style={{
                                    position: 'absolute',
                                    top: 10,
                                    right: 10,
                                }}
                            />
                            <Text style={{...styles.subheading, fontWeight: "bold"}}>Parked</Text>
                            <Text style={styles.subheading}>
                                {
                                    "Lot " + user?.parking_log?.[0]?.lot?.lot_no + ", " +
                                    user?.parking_log?.[0]?.lot?.floor?.floor_no + "F-" +
                                    user?.parking_log?.[0]?.lot?.section
                                }
                            </Text>
                            <Text style={styles.subheading}>
                                {
                                    format( new Date(user?.parking_log?.[0]?.entry_datetime || 0), 'd/M/yy h:mm aa') + " - Current"
                                }
                            </Text>
                        </Surface>
                    </Pressable>
                )}
                <View style={styles.grid}>
                    <View style={styles.gridRow}>
                        <Pressable
                            style={mall?.vacant > 0 ? styles.iconButton : styles.iconButtonDisabled}
                            onPress={() => {
                                if (mall?.vacant == 0) {
                                    alert("No available parking!");
                                } else {
                                    if (parked) {
                                        console.log("You are already parked!");
                                        alert("You are already parked!");
                                    } else {
                                        if(user?.number_plate.length == 0) {
                                            alert("Please add your number plate in your profile first!");
                                        } else {
                                            navigation.navigate('Entry')
                                        }
                                    }
                                }
                            }}
                        >
                            <Icon name="login" size={30} color="white"/>
                            <Text style={styles.iconButtonLabel}>Entry</Text>
                        </Pressable>
                        <Pressable
                            style={styles.iconButton}
                            onPress={() => {
                                if (!parked) {
                                    alert("You are not parked!");
                                } else {
                                    navigation.navigate('Exit')
                                }
                            }}
                        >
                            <Icon name="logout" size={30} color="white"/>
                            <Text style={styles.iconButtonLabel}>Exit</Text>
                        </Pressable>
                    </View>
                    <View style={styles.gridRow}>
                        <Pressable
                            style={mall?.vacant > 0 ? styles.iconButton : styles.iconButtonDisabled}
                            onPress={() => {
                                if (mall?.vacant == 0) {
                                    alert("No available parking!");
                                } else {
                                    if(parked) {
                                        alert("You are already parked! Please exit first to reserve.");
                                    } else {
                                        if(user?.number_plate.length == 0) {
                                            alert("Please add your number plate in your profile first!");
                                        } else {
                                            navigation.navigate('Reserve')
                                        }
                                    }
                                }
                            }}
                        >
                            <Icon name="bookmark" size={30} color="white"/>
                            <Text style={styles.iconButtonLabel}>Reserve</Text>
                        </Pressable>
                        <Pressable
                            style={styles.iconButton}
                            onPress={() => navigation.navigate('Profile')}
                        >
                            <UserIcon name="user" size={30} color="white"/>
                            <Text style={styles.iconButtonLabel}>Profile</Text>
                        </Pressable>
                    </View>
                </View>
                <Button
                    mode='contained'
                    style={styles.button}
                    onPress={() => {
                        logout();
                    }}
                >
                    Logout
                </Button>
                <Portal>
                    <Dialog
                        visible={showMallDialog}
                        dismissable={mall?.name != ""}
                        dismissableBackButton={mall?.name !== ""}
                        onDismiss={() => {
                            setShowMallDialog(false);
                        }}
                    >
                        <Dialog.Title>Choose a mall</Dialog.Title>
                        <Dialog.Content>
                            {malls?.map((m) => {
                                return (
                                    <RadioButton.Item
                                        label={m.name}
                                        value={String(m.id)}
                                        key={m.id}
                                        status={mall?.id == m.id ? "checked" : "unchecked"}
                                        onPress={() => {
                                            setMall(m as mall);
                                            setShowMallDialog(false);
                                        }}
                                    />
                                )
                            })}
                        </Dialog.Content>
                    </Dialog>
                </Portal>
            </ScrollView>
        </View>
    )
}

export default Home;