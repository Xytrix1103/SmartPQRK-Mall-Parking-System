import React, {useContext, useEffect, useState} from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {Text, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {io} from "socket.io-client";
import socket from "../api/socket";
import {station, mall} from "../api/types";
import {styles} from "../assets/styles/styles";
import {Button, Dialog, FAB, Portal, RadioButton} from "react-native-paper";
import {MallContext} from "../assets/contexts/MallContext";
import {useGetMalls} from "../api/malls";
import {useGetStations} from "../api/stations";
import {StationContext} from "../assets/contexts/StationContext";
import {useCreateEntry} from "../api/entry";
import {useExit} from "../api/exit";

const Scanner = () => {
    const insets = useSafeAreaInsets();
    const {data: malls, status: mallsStatus, error} = useGetMalls();
    const {mutate: createEntry} = useCreateEntry();
    const {mutate: exit} = useExit();
    const stations = useGetStations();

    const {mall, setMall} = useContext(MallContext);
    const {station, setStation} = useContext(StationContext);

    const [showMallDialog, setShowMallDialog] = useState(false);
    const [showStationDialog, setShowStationDialog] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        console.log("Scanner mounted");
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            console.log(status);
            setHasPermission(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        if (malls) {
            if (malls.length > 1) {
                if(mall.name == "") {
                    setMall(malls[0]);
                }
                if (stations) {
                    setStation(stations[0]);
                    setShowStationDialog(false);
                } else {
                    setShowStationDialog(true);
                }
                setShowMallDialog(false);
            } else {
                setShowMallDialog(true);
            }
        }
    }, [malls, stations])

    useEffect(() => {
        console.log(stations);
    }, [stations])

    const handleBarCodeScanned = ({ type, data }: any) => {
        console.log("Scanned");
        console.log(data);

        let json;
        try {
            json = JSON.parse(data);
        } catch (e) {
            console.error("Invalid QR code");
            return;
        }

        if (station?.is_entrance) {
            if(json.type == "entry") {
                json = {
                    ...json,
                    mall_id: mall?.id,
                    entry_station_id: station?.id,
                }
                console.log(json);
                console.log("Entry");
                createEntry(json);
            } else {
                console.log("Please scan an entry QR code");
                socket.emit("entry-qrcode-warning-send", json);
            }
        } else if (!station?.is_entrance) {
            if (json.type == "exit") {
                json = {
                    ...json,
                    mall_id: mall?.id,
                    exit_station_id: station?.id,
                }
                console.log(json);
                console.log("Exit");
                exit(json);
            } else {
                console.log("Please scan an exit QR code");
                socket.emit("exit-qrcode-warning-send", json);
            }
        }
        setScanned(true);
    };

    return (
        <View
            style={{
                flex: 1,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right,
                width: "100%",
            }}
        >
            {hasPermission &&
            <View style={styles.container}>
                <FAB
                    style={styles.fab}
                    animated={true}
                    icon="map-marker"
                    variant="primary"
                    onPress={() => {
                        setShowMallDialog(true);
                    }}
                />
                <FAB
                    style={{
                        ...styles.fab,
                        bottom: 100,
                    }}
                    animated={true}
                    icon="home"
                    variant="primary"
                    onPress={() => {
                        setShowStationDialog(true);
                    }}
                />
                <Text style={styles.subheading}>Mall: {mall?.name}</Text>
                <Text style={styles.subheading}>Station: {station?.id}</Text>
                <Text style={styles.subheading}>Type: {station?.is_entrance ? "Entrance" : "Exit"}</Text>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={{flex: 1, width: "100%"}}
                />
                {scanned && <Text>Barcode scanned!</Text>}
                <Button
	                style={styles.button}
	                mode="contained"
	                icon="camera"
	                onPress={() => setScanned(false)}
                >
                    Scan Again
                </Button>
            </View>
            }
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
                                    value={String(m?.id)}
                                    key={m?.id}
                                    status={mall?.id == m?.id ? "checked" : "unchecked"}
                                    onPress={() => {
                                        setMall(m as mall);
                                        setShowMallDialog(false);
                                    }}
                                />
                            )
                        })}
                    </Dialog.Content>
                </Dialog>
                <Dialog
                    visible={showStationDialog}
                    dismissable={station?.id != 0}
                    dismissableBackButton={station?.id !== 0}
                    onDismiss={() => {
                        setShowStationDialog(false);
                    }}
                >
                    <Dialog.Title>Choose a station</Dialog.Title>
                    <Dialog.Content>
                        {stations?.map((s) => {
                            return (
                                <RadioButton.Item
                                    label={"Station " + s?.id + " (" + (s.is_entrance ? "Entrance" : "Exit") + ")"}
                                    value={String(s?.id)}
                                    key={s?.id}
                                    status={station?.id == s?.id ? "checked" : "unchecked"}
                                    onPress={() => {
                                        setStation(s as station);
                                        setShowStationDialog(false);
                                    }}
                                />
                            )
                        })}
                    </Dialog.Content>
                </Dialog>
            </Portal>
        </View>
    );
}

export default Scanner;