import React, {Suspense, useCallback, useContext, useEffect, useState} from 'react';
import {FlatList, Pressable, Text, View} from 'react-native';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {entryStyles as styles} from "../assets/styles/styles";
import {Header} from "../components/Header";
import QRCodeStyled from 'react-native-qrcode-styled';
import {format} from "date-fns";
import {useGetUser} from "../api/user";
import Icon from "@expo/vector-icons/FontAwesome";
import {Dialog, FAB, List, Portal, RadioButton, Searchbar} from "react-native-paper";
import {useGetUserNumberPlates} from "../api/numberPlates";
import {directory, floor, number_plate, wing} from "../api/types";
import {LoadingScreen} from "../components/LoadingScreen";
import {QueryBoundaries} from "../components/QueryBoundaries";
import {useGetDirectory} from "../api/directory";
import QRCode from "react-native-qrcode-svg";
import {useGetWings} from "../api/wings";
import {useGetFloors} from "../api/floors";
import {io} from "socket.io-client";
import socket from "../api/socket";
import {ParkedContext} from "../assets/contexts/ParkedContext";
import {ReservedContext} from "../assets/contexts/ReservedContext";
import {createRedirectServedPathMiddleware} from "@expo/webpack-config/webpack/utils/redirectServedPathMiddleware";
import {useFocusEffect} from "@react-navigation/native";

const Entry = ({navigation, route}: any) => {
    const insets = useSafeAreaInsets();
    const {data: user, refetch: updateUser} = useGetUser();
    const number_plates = user?.number_plate;
    const {data: directories, refetch: updateDirectories} = useGetDirectory();
    const {data: floors} = useGetFloors();
    const {data: wings} = useGetWings();
    const {parked, setParked} = useContext(ParkedContext);
    const {reserved, setReserved} = useContext(ReservedContext)

    console.log(reserved)
    const reservation = user?.reservations?.[0];

    const [qrValue, setQRValue] = useState({
        id: user?.id || 0,
        number_plate: reservation?.number_plate || (number_plates?.[0] || {id: 0, number_plate: ""} as number_plate),
        log_datetime: new Date(),
        directory: reservation?.directory || (directories?.[0] || {id: 0, name: "", floor_id: 0, lot_no: 0, mall_id: 0, wing_id: 0} as directory),
        type: "entry",
        reservation_id: reserved ? reservation?.id : null,
    });

    const [showNPDialog, setShowNPDialog] = useState(false);
    const [showDirDialog, setShowDirDialog] = useState(false);
    const [query, setQuery] = useState("");
    const [filteredDirectories, setFilteredDirectories] = useState<directory[]>(directories || []);

    const futureDate = new Date(qrValue.log_datetime.getTime() + 3 * 60000);

    useEffect(() => {
        console.log("Entry mounted");

        if(parked && !reserved) {
            navigation.navigate("Home");
        } else {
            if(reserved) {
                if(new Date(reservation?.reservation_datetime || 0) > new Date()) {
                    alert("Your reservation time has not come yet");
                    navigation.navigate("Home");
                } else if(new Date(reservation?.reservation_datetime || 0) < new Date(new Date().getTime() - 40 * 60000)) {
                    alert("Your reservation time has expired");
                    setReserved(false);
                    navigation.navigate("Home");
                }
            }
        }

        updateUser();
        updateDirectories();

        if(parked) {
            navigation.navigate("Home");
        }

        socket.on('entry-success', (data: any) => {
            console.log(data);
            setParked(true);
            alert("Entry successful!");
            navigation.navigate("Home");
        });

        return () => {
            console.log("Entry unmounted");
            socket.off('entry-success');
        }
    }, [])

    useEffect(() => {
        setQRValue({
            ...qrValue,
            number_plate: qrValue.number_plate.id === 0 ? number_plates?.[0] || {id: 0, number_plate: ""} as number_plate : qrValue.number_plate,
            directory: qrValue.directory.id === 0 ? directories?.[0] || {id: 0, name: "", floor_id: 0, lot_no: 0, mall_id: 0, wing_id: 0} as directory : qrValue.directory,
        });
        setFilteredDirectories(directories || []);
    }, [number_plates, directories]);

    useEffect(() => {
        if (query === "") {
            setFilteredDirectories(directories || []);
        } else {
            setFilteredDirectories(directories?.filter((directory) => {
                return directory.name.toLowerCase().includes(query.toLowerCase());
            }) || []);
        }
    }, [query]);

    useEffect(() => {
        if(reservation) {
            setQRValue({
                ...qrValue,
                number_plate: reservation.number_plate,
                directory: reservation.directory,
            });
        } else {
            setQRValue({
                ...qrValue,
                number_plate: number_plates?.[0] || {id: 0, number_plate: ""} as number_plate,
                directory: directories?.[0] || {id: 0, name: "", floor_id: 0, lot_no: 0, mall_id: 0, wing_id: 0} as directory,
            });
        }
    }, [user]);

    useFocusEffect(
        useCallback(() => {
            updateUser();
            updateDirectories();
        }, [])
    );

    if (!user || !directories || !floors || !wings) {
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
            {
                !reserved ? (
                    <FAB
                        style={styles.fab}
                        animated={true}
                        icon="refresh"
                        variant="primary"
                        onPress={() => {
                            setQRValue({
                                ...qrValue,
                                log_datetime: new Date(),
                            });
                        }}
                    />
                ) : null
            }
            <View style={styles.rowContainer}>
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
                    {
                        reserved &&
	                    <View style={styles.row}>
		                    <Text style={styles.field}>
                                {"Reservation Date: "}
		                    </Text>
		                    <Text style={styles.data}>
                                {format(new Date(reservation?.reservation_datetime || 0), "dd/MM/yyyy")}
		                    </Text>
	                    </View>
                    }
                    <View style={styles.row}>
                        {
                            !reserved ? (
                                <>
                                    <Text style={styles.field}>
                                        {"Valid Time: "}
                                    </Text>
                                    <Text style={styles.data}>
                                        {format(qrValue.log_datetime, "h:mm aa") + " - " + format(futureDate, "h:mm aa")}
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.field}>
                                        {"Reservation Time: "}
                                    </Text>
                                    <Text style={styles.data}>
                                        {
                                            format(new Date(reservation?.reservation_datetime || 0), "h:mm aa")
                                            + " - " +
                                            format(new Date(reservation?.reservation_datetime || 0).getTime() + 30 * 60000, "h:mm aa")
                                        }
                                    </Text>
                                </>
                            )
                        }
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
                            {qrValue?.number_plate.number_plate}
                        </Text>
                        {
                            !reserved &&
	                        <Pressable
		                        onPress={() => setShowNPDialog(true)}
		                        style={styles.actionButton}
		                        disabled={showNPDialog}
	                        >
		                        <Text style={styles.actionButtonLabel}>
                                    {qrValue?.number_plate.number_plate != "" ? "Select" : "Change"}
		                        </Text>
	                        </Pressable>
                        }
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.field}>
                            {"Destination: "}
                        </Text>
                        <Text style={{
                            ...styles.data,
                            padding: 10,
                            borderWidth: 1,
                            borderColor: "black",
                            borderRadius: 5,
                            marginHorizontal: 10,
                        }}>
                            {qrValue.directory.name}
                        </Text>
                        {
                            !reserved &&
                            <Pressable
                                onPress={() => setShowDirDialog(true)}
                                style={styles.actionButton}
                                disabled={showDirDialog}
                            >
                                <Text style={styles.actionButtonLabel}>
                                    {qrValue.directory.name != "" ? "Select" : "Change"}
                                </Text>
                            </Pressable>
                        }
                    </View>
                </View>
                <View>
                    <Portal>
                        <Dialog
                            visible={showNPDialog}
                            onDismiss={() => setShowNPDialog(false)}
                            dismissableBackButton={true}
                        >
                            <Dialog.Content>
                                <RadioButton.Group
                                    onValueChange={value => {
                                        setQRValue({
                                            ...qrValue,
                                            number_plate: number_plates?.find((np: number_plate) => np.number_plate === value) || {
                                                id: 0,
                                                number_plate: ""
                                            },
                                        });
                                    }}
                                    value={qrValue.number_plate.number_plate}
                                >
                                    {
                                        number_plates?.map((np: number_plate) => (
                                            <View style={styles.row} key={np.id}>
                                                <RadioButton.Item
                                                    key={np.id}
                                                    label={np.number_plate}
                                                    value={np.number_plate}
                                                    position="leading"
                                                />
                                            </View>
                                        ))
                                    }
                                </RadioButton.Group>
                            </Dialog.Content>
                        </Dialog>
                        <Dialog
                            visible={showDirDialog}
                            onDismiss={() => setShowDirDialog(false)}
                            dismissableBackButton={true}
                        >
                            <Dialog.Content
                                style={{
                                    height: "100%",
                                }}
                            >
                                <View
                                    style={{
                                        height: "100%",
                                    }}
                                >
                                    <Searchbar
                                        onChangeText={q => {
                                            setQuery(q);
                                        }}
                                        value={query}
                                    />
                                    <FlatList
                                        data={filteredDirectories}
                                        renderItem={({item}) => (
                                            <Pressable
                                                onPress={() => {
                                                    setQRValue({
                                                        ...qrValue,
                                                        directory: item,
                                                    });
                                                    setShowDirDialog(false);
                                                }}
                                            >
                                                <View style={styles.listItem}>
                                                    <Text style={styles.listItemLabel}>
                                                        {item.name + " - Floor " + floors?.find((f: floor) => f.id === item.floor_id)?.floor_no + ", " + wings?.find((w: wing) => w.id === item.wing_id)?.wing + " Wing"}
                                                    </Text>
                                                </View>
                                            </Pressable>
                                        )}
                                        keyExtractor={item => item.id.toString()}
                                    />
                                </View>
                            </Dialog.Content>
                        </Dialog>
                    </Portal>
                </View>
            </View>
        </View>
    );
};

export default Entry;