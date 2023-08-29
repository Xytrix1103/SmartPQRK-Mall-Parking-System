//history page to display user's parking history at this mall
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    RefreshControl,
    VirtualizedList, FlatList
} from 'react-native';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useGetHistory} from "../api/history";
import {useGetMalls} from "../api/malls";
import {mall, parking_log} from "../api/types";
import {MallContext} from "../assets/contexts/MallContext";
import {AuthContext} from "../assets/contexts/AuthContext";
import {LoadingScreen} from "../components/LoadingScreen";
import {historyStyles as styles} from "../assets/styles/styles";
import {Header} from "../components/Header";
import Icon from "@expo/vector-icons/FontAwesome";
import {format} from "date-fns";
import {useFocusEffect} from "@react-navigation/native";

const History = ({navigation, route}: any) => {
    const {data: malls, refetch: updateMalls} = useGetMalls();
    const {data: history, refetch: updateHistory} = useGetHistory();
    const insets = useSafeAreaInsets();

    const {token} = useContext(AuthContext);
    const {mall, setMall} = useContext(MallContext);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            updateHistory();
            setRefreshing(false);
        }, 2000);
    }, []);

    useEffect(() => {
        console.log("History mounted");
        console.log(history);
    }, [])

    useFocusEffect(
        useCallback(() => {
            console.log("History focused");
            updateHistory();
        }, [])
    )

    if (!history || !malls) {
        return <LoadingScreen/>;
    }

    return (
        <View style={{
            flex: 1,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
        }}>
            <Header navigation={navigation} route={route}/>
            <View style={styles.container}>
                <FlatList
                    data={history}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    ListEmptyComponent={() => (
                        <Text style={styles.subheading}>No Parking History</Text>
                    )}
                    renderItem={({item}) => (
                        <View style={styles.listItem}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%',
                                padding: 10,
                            }}>
                                <Icon name="car" size={30} color="white"/>
                                <View style={{flexDirection: 'column', alignItems: 'center'}}>
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        color: 'white',
                                        marginVertical: 5,
                                    }}>{item.number_plate.number_plate}</Text>
                                    <Text style={{
                                        fontSize: 12,
                                        color: 'white',
                                    }}>Lot {item.lot.floor_id} - {item.lot.section} - {item.lot.lot_no}</Text>
                                </View>
                                <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        color: 'white',
                                        marginVertical: 5,
                                    }}>{format(new Date(item.entry_datetime), "dd/MM/yyyy")}</Text>
                                    <Text style={{
                                        fontSize: 12,
                                        color: 'white',
                                    }}>{format(new Date(item.entry_datetime), "h:mm aa")} - {format(new Date(item.exit_datetime), "h:mm aa")}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                    keyExtractor={item => item.id.toString()}
                />
            </View>
        </View>
    )
}

export default History;