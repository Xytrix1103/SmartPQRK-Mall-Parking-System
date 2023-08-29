import React from "react";
import {ActivityIndicator, View} from "react-native";
import {entryStyles as styles} from "../assets/styles/styles";
import {useSafeAreaInsets} from "react-native-safe-area-context";

export const LoadingScreen = () => {
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
                <ActivityIndicator size="large" color="#0000ff"/>
            </View>
        </View>
    );
}