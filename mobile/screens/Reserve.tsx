import React, {Suspense, useCallback, useContext, useEffect, useState} from 'react';
import {FlatList, Pressable, Text, View} from 'react-native';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {entryStyles as styles} from "../assets/styles/styles";
import {Header} from "../components/Header";
import {format} from "date-fns";
import {useCancelReservation, useGetUser, useReserveParking} from "../api/user";
import {Dialog, Portal, RadioButton, Searchbar} from "react-native-paper";
import {useGetUserNumberPlates} from "../api/numberPlates";
import {directory, floor, number_plate, wing} from "../api/types";
import {LoadingScreen} from "../components/LoadingScreen";
import {useGetDirectory} from "../api/directory";
import {useGetWings} from "../api/wings";
import {useGetFloors} from "../api/floors";
import {ParkedContext} from "../assets/contexts/ParkedContext";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from '@react-navigation/native';
import {ReservedContext} from "../assets/contexts/ReservedContext";

const Reserve = ({navigation, route}: any) => {
    const insets = useSafeAreaInsets();
    const {data: user, refetch: updateUser} = useGetUser();
    const {data: directories, refetch: updateDirectories} = useGetDirectory();
    const {data: floors, refetch: updateFloors} = useGetFloors();
    const {data: wings, refetch: updateWings} = useGetWings();
    const {mutate: reserve} = useReserveParking();
    const {mutate: cancel} = useCancelReservation();
    const {parked, setParked} = useContext(ParkedContext);
    const {reserved, setReserved} = useContext(ReservedContext);

    const [jsonValue, setJSONValue] = useState({
        id: user?.id || 0,
        number_plate: user?.number_plate?.[0] || {id: 0, number_plate: ""} as number_plate,
        reservation_datetime: new Date(),
        directory: directories?.[0] || {id: 0, name: "", floor_id: 0, lot_no: 0, wing_id: 0, mall_id: 0} as directory,
        type: "reserve",
    });

    const [showNPDialog, setShowNPDialog] = useState(false);
    const [showDirDialog, setShowDirDialog] = useState(false);
    const [showTimeDialog, setShowTimeDialog] = useState(false);
    const [query, setQuery] = useState("");
    const [filteredDirectories, setFilteredDirectories] = useState<directory[]>(directories || []);

    const futureDate = new Date(jsonValue.reservation_datetime.getTime() + 3 * 60000);

    useEffect(() => {
        console.log("Reserve mounted");
    }, [])

    useEffect(() => {
        return navigation.addListener('focus', () => {
            setJSONValue({
                ...jsonValue,
                reservation_datetime: new Date(),
            });
        });
    }, [navigation]);

    useEffect(() => {
        console.log("number_plates: ", user?.number_plate);
        setJSONValue({
            ...jsonValue,
            number_plate: jsonValue.number_plate.id === 0 ? user?.number_plate?.[0] || {id: 0, number_plate: ""} as number_plate : jsonValue.number_plate,
            directory: jsonValue.directory.id === 0 ? directories?.[0] || {id: 0, name: "", floor_id: 0, lot_no: 0, mall_id: 0, wing_id: 0} as directory : jsonValue.directory,
        });
        setFilteredDirectories(directories || []);
    }, [user, directories]);

    useEffect(() => {
        console.log(jsonValue);
    }, [jsonValue]);

    useEffect(() => {
        if (query === "") {
            setFilteredDirectories(directories || []);
        } else {
            setFilteredDirectories(directories?.filter((directory) => {
                return directory.name.toLowerCase().includes(query.toLowerCase());
            }) || []);
        }
    }, [query]);

    useFocusEffect(
        useCallback(() => {
            console.log("Reserve focused");
            console.log(reserved)
            updateUser();
            updateDirectories();
            updateFloors();
            updateWings();
            return () => {
                console.log("Reserve unfocused");
            }
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
            <View style={styles.rowContainer}>
                <View style={styles.rowContainer}>
                    {
                        !user?.reservations?.[0]?.is_expired && !user?.reservations?.[0]?.is_cancelled && !user?.reservations?.[0]?.is_fulfilled &&
                        <View style={styles.row}>
                            <Text style={styles.heading}>Pending Reservation</Text>
                        </View>
                    }
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
                            {"Reservation Time: "}
                        </Text>
                        <Text style={{
                            ...styles.data,
                            padding: 10,
                            borderWidth: 1,
                            borderColor: "black",
                            borderRadius: 5,
                            marginHorizontal: 10,
                        }}>
                            {
                                reserved && !user?.reservations?.[0]?.is_expired && !user?.reservations?.[0]?.is_cancelled && !user?.reservations?.[0]?.is_fulfilled ?
                                    user?.reservations?.[0]?.reservation_datetime ?
                                        format(new Date(user?.reservations?.[0]?.reservation_datetime), " dd/mm/yy h:mm aa")
                                        :
                                        format(jsonValue.reservation_datetime, " dd/mm/yy h:mm aa")
                                    :
                                    format(jsonValue.reservation_datetime, " dd/mm/yy h:mm aa")
                            }
                        </Text>
                        {
                            reserved && !user?.reservations?.[0]?.is_expired && !user?.reservations?.[0]?.is_cancelled && !user?.reservations?.[0]?.is_fulfilled ?
                                <></>
                                :
                                <Pressable
                                    onPress={() => setShowTimeDialog(true)}
                                    style={styles.actionButton}
                                >
                                    <Text style={styles.actionButtonLabel}>
                                        Change
                                    </Text>
                                </Pressable>
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
                            {
                                reserved && !user?.reservations?.[0]?.is_expired && !user?.reservations?.[0]?.is_cancelled && !user?.reservations?.[0]?.is_fulfilled ?
                                    user?.reservations?.[0]?.number_plate?.number_plate
                                    :
                                    jsonValue?.number_plate.number_plate
                            }
                        </Text>
                        {
                            reserved && !user?.reservations?.[0]?.is_expired && !user?.reservations?.[0]?.is_cancelled && !user?.reservations?.[0]?.is_fulfilled ?
                                <></>
                                :
                                <Pressable
                                    onPress={() => setShowNPDialog(true)}
                                    style={styles.actionButton}
                                >
                                    <Text style={styles.actionButtonLabel}>
                                        Change
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
                            {
                                reserved && !user?.reservations?.[0]?.is_expired && !user?.reservations?.[0]?.is_cancelled && !user?.reservations?.[0]?.is_fulfilled ?
                                    user?.reservations?.[0]?.directory?.name
                                    :
                                    jsonValue.directory.name
                            }
                        </Text>
                        {
                            reserved && !user?.reservations?.[0]?.is_expired && !user?.reservations?.[0]?.is_cancelled && !user?.reservations?.[0]?.is_fulfilled ?
                                <></>
                                :
                                <Pressable
                                    onPress={() => {console.log(filteredDirectories); setShowDirDialog(true)}}
                                    style={styles.actionButton}
                                    disabled={showDirDialog}
                                >
                                    <Text style={styles.actionButtonLabel}>
                                        {jsonValue.directory.name != "" ? "Select" : "Change"}
                                    </Text>
                                </Pressable>
                        }
                    </View>
                    <View style={styles.exitButtonRow}>
                        {
                            reserved && !user?.reservations?.[0]?.is_expired && !user?.reservations?.[0]?.is_cancelled && !user?.reservations?.[0]?.is_fulfilled ?
                                <Pressable
                                    onPress={() => {
                                        console.log("Cancel reservation");
                                        cancel({
                                            reservation_id: user?.reservations?.[0]?.id,
                                        });
                                        setReserved(false);
                                        navigation.navigate("Home");
                                    }}
                                    style={styles.exitButton}
                                >
                                    <Text style={styles.exitButtonLabel}>
                                        Cancel
                                    </Text>
                                </Pressable>
                                :
                                <Pressable
                                    onPress={() => {
                                        console.log("Reserve pressed");
                                        reserve(jsonValue);
                                        setReserved(true);
                                        navigation.navigate("Home");
                                    }}
                                    style={styles.exitButton}
                                >
                                    <Text style={styles.exitButtonLabel}>
                                        Reserve
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
                                        setJSONValue({
                                            ...jsonValue,
                                            number_plate: user?.number_plate?.find((np: number_plate) => np.number_plate === value) || {
                                                id: 0,
                                                number_plate: ""
                                            },
                                        });
                                    }}
                                    value={jsonValue.number_plate.number_plate}
                                >
                                    {
                                        user?.number_plate?.map((np: number_plate) => (
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
                                                    setJSONValue({
                                                        ...jsonValue,
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
                        {
                            showTimeDialog &&
	                        <RNDateTimePicker
		                        value={jsonValue.reservation_datetime}
		                        mode="time"
		                        onChange={(event, date) => {
                                    setShowTimeDialog(false);
                                    setJSONValue({
                                        ...jsonValue,
                                        reservation_datetime: date || jsonValue.reservation_datetime,
                                    });
                                }}
	                        />
                        }
                    </Portal>
                </View>
            </View>
        </View>
    );
};

export default Reserve;