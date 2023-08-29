import React, {useEffect} from "react";
import {ActivityIndicator, Text, View} from "react-native";
import {styles as styles} from "../assets/styles/styles";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {api} from "../api/base";

const Maintenance = () => {
    const insets = useSafeAreaInsets();

    return (
        <View style={{
            flex: 1,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            width: "100%",
        }}>
            <View style={styles.container}>
                <Text style={styles.subheading}>Server is down for maintenance</Text>
            </View>
        </View>
    );
}

export default Maintenance;