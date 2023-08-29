import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'space-evenly',
        padding: 30,
        width: '100%',
        height: '100%',
    },
    rowContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: '100%',
        padding: 16,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        width: '100%',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 16,
        lineHeight: 32,
        textAlign: 'center',
    },
    subheading: {
        fontSize: 16,
    },
    logo: {
        resizeMode: 'contain',
        width: 100,
        height: 100,
    },
    button: {
        marginVertical: 16,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        zIndex: 1,
    }
});

export const homeStyles = StyleSheet.create({
    ...styles,
    iconButton: {
        flexDirection: 'column',
        backgroundColor: '#000000',
        borderRadius: 10,
        margin: 10,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '40%',
    },
    //greyed out icon button to show that it is disabled
    iconButtonDisabled: {
        flexDirection: 'column',
        backgroundColor: '#808080',
        borderRadius: 10,
        margin: 10,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '40%',
    },
    iconButtonLabel: {
        fontSize: 16,
        marginVertical: 10,
        fontWeight: 'bold',
        color: 'white',
    },
    grid: {
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginVertical: 16,
    },
    gridRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
    },
    icon: {
        color: 'white',
        backgroundColor: '#000000',
        borderRadius: 100,
        padding: 8,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    historyButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 1,
        margin: 16,
    },
    statusContainer: {
        flexDirection: 'column',
        alignItems: "flex-start",
        justifyContent: 'center',
        padding: 20,
        borderRadius: 10,
        margin: 10,
        width: '80%',
    },
});

export const loginStyles = StyleSheet.create({
    ...styles,
    input: {
        width: '80%',
        marginVertical: 8,
    },
    helperText: {
        marginLeft: '10%',
    },
});

export const registerStyles = StyleSheet.create({
    ...styles,
    ...loginStyles,
    form: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    }
});

export const entryStyles = StyleSheet.create({
    ...styles,
    qrContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
        height: 300,
        width: 300,
        margin: 10,
    },
    qrCode: {
        width: 200,
        height: 200,
        margin: 0,
        padding: 0,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        width: '100%',
    },
    field: {
        fontSize: 14,
    },
    data: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    actionButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
    },
    actionButtonLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: 'white',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        margin: 5,
        padding: 10,
    },
    listItemLabel: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    exitButtonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    exitButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 30,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
        marginVertical: 16,
    },
    exitButtonLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
});

export const headerStyles = StyleSheet.create({
    ...styles,
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        padding: 16,
        color: 'white',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
        position: 'absolute',
        left: 0,
        color: 'white',
    },
    backButtonLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'white',
    },
});

export const historyStyles = StyleSheet.create({
    ...styles,
    listItem: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'black',
        borderRadius: 10,
        margin: 5,
        padding: 10,
    },
    listItemLabel: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    listItemData: {
        fontSize: 14,
        color: 'white',
    },
});

export const profileStyles = StyleSheet.create({
    ...styles,
    ...registerStyles,
    ...homeStyles,
});