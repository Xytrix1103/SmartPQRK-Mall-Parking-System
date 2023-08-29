import React, {useEffect} from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {Text, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {io} from "socket.io-client";
import socket from "../api/socket";

const TestScanner = () => {
    const insets = useSafeAreaInsets();

    const [hasPermission, setHasPermission] = React.useState(false);
    const [scanned, setScanned] = React.useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            console.log(status);
            setHasPermission(status === 'granted');
        })();
        console.log("TestScanner mounted");
        console.log(socket.id);
    }, []);

    const handleBarCodeScanned = ({ type, data }: any) => {
        socket.emit("entry-request", data);
        setScanned(true);
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (!hasPermission) {
        return <Text>No access to camera</Text>;
    }

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
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={{flex: 1}}
            />
            {scanned && <Text>Barcode scanned!</Text>}
        </View>
    );
}

// export default TestScanner;