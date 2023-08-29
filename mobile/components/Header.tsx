import React from "react";
import {View, Text, Pressable} from "react-native";
import Icon from "@expo/vector-icons/Entypo";
import {Appbar, Button} from "react-native-paper";
import {headerStyles as styles} from "../assets/styles/styles";

//display current page name and back button
export const Header = ({navigation, route}: any) => {
    return (
        <>
            {
                route?.name !== "Home" &&
		        <Appbar.Header mode="center-aligned" statusBarHeight={0} style={styles.header}>
			        <Appbar.BackAction onPress={() => navigation.goBack()} color="white"/>
			        <Appbar.Content title={route?.name} titleStyle={styles.headerText}/>
		        </Appbar.Header>
            }
        </>
    )
}