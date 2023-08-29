import {Controller, useForm} from "react-hook-form";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {FlatList, Pressable, RefreshControl, ScrollView, View} from "react-native";
import {profileStyles as styles} from "../assets/styles/styles";
import {Button, Dialog, Divider, FAB, HelperText, Portal, Text, TextInput} from "react-native-paper";
import {useAddNumberPlate, useGetUser, useUpdateUser} from "../api/user";
import {useFocusEffect} from "@react-navigation/native";
import {Header} from "../components/Header";
import {useGetUserNumberPlates} from "../api/numberPlates";
import Icon from "@expo/vector-icons/MaterialIcons";
import UserIcon from "@expo/vector-icons/FontAwesome";

const Profile = ({navigation, route}: any) => {
    const {data: user, refetch: updateUser} = useGetUser();

    const { control, handleSubmit, formState: { errors }, resetField } = useForm({
        defaultValues: {
            name: user?.name,
            email: user?.email,
            contact: user?.contact,
            address: user?.address,
            username: user?.username,
            new_password: "",
            new_password_confirmation: "",
        },
    });

    const insets = useSafeAreaInsets();
    const {mutate: updateProfile} = useUpdateUser();
    const {mutate: addNP} = useAddNumberPlate();

    const [editPassword, setEditPassword] = useState(false);
    const [editNP, setEditNP] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newNP, setNewNP] = useState("");
    const npRef = useRef(null);
    const [refreshing, setRefreshing] = useState(false);

    const onSubmit = (data: any) => {
        console.log(data)
        setEditPassword(false);
        setEditNP(false);
        updateProfile(data)
        updateUser();
    }

    useEffect(() => {
        console.log("Profile mounted");
    }, [])

    useFocusEffect(
        useCallback(() => {
            console.log("Profile focused");
            updateUser();
        }, [])
    )

    useEffect(() => {
        if(!editPassword) {
            //set password fields to empty
            resetField("new_password");
            resetField("new_password_confirmation");
        }
    }, [editPassword])

    useEffect(() => {
        if(!editNP) {
            setNewNP("");
        }
        updateUser();
    }, [editNP])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            updateUser();
            setRefreshing(false);
        }, 2000);
    }, []);

    return (
        <View style={{
            flex: 1,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            width: '100%',
        }}>
            <Header navigation={navigation} route={route}/>
            <ScrollView
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <FAB
                    style={styles.fab}
                    icon="check"
                    onPress={handleSubmit(onSubmit)}
                />
                <ScrollView style={{width: '100%'}}>
                    <View style={styles.grid}>
                        <View style={styles.gridRow}>
                            <Pressable
                                style={styles.iconButton}
                                onPress={() => {
                                    setEditPassword(true);
                                }}
                            >
                                <Icon name="lock" size={30} color="white"/>
                                <Text style={styles.iconButtonLabel}>Password</Text>
                            </Pressable>
                            <Pressable
                                style={styles.iconButton}
                                onPress={() => {
                                    setEditNP(true);
                                }}
                            >
                                <UserIcon name="car" size={30} color="white"/>
                                <Text style={styles.iconButtonLabel}>Number Plates</Text>
                            </Pressable>
                        </View>
                    </View>
                    <Divider style={{
                        backgroundColor: '#000',
                        marginVertical: 10,
                    }}/>
                    <View style={styles.form}>
                        <Text style={styles.subheading}>Profile</Text>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    mode="outlined"
                                    label="Name"
                                    placeholder="Name"
                                    left={
                                        <TextInput.Icon
                                            icon="account"
                                            color="#000"
                                            size={24}
                                        />
                                    }
                                    style={styles.input}
                                    error={errors.name !== undefined}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                            name="name"
                            rules={{ required: "Name is required" }}
                        />
                        {errors.name && (
                            <HelperText type="error" style={styles.helperText}>
                                {errors.name.message}
                            </HelperText>
                        )}
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    mode="outlined"
                                    label="Email"
                                    placeholder="Email"
                                    left={
                                        <TextInput.Icon
                                            icon="email"
                                            color="#000"
                                            size={24}
                                        />
                                    }
                                    style={styles.input}
                                    error={errors.email !== undefined}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                            name="email"
                            rules={{ required: "Email is required" }}
                        />
                        {errors.email && (
                            <HelperText type="error" style={styles.helperText}>
                                {errors.email.message}
                            </HelperText>
                        )}
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    mode="outlined"
                                    label="Contact"
                                    placeholder="Contact"
                                    left={
                                        <TextInput.Icon
                                            icon="phone"
                                            color="#000"
                                            size={24}
                                        />
                                    }
                                    style={styles.input}
                                    error={errors.contact !== undefined}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                            name="contact"
                            rules={{ required: "Contact is required" }}
                        />
                        {errors.contact && (
                            <HelperText type="error" style={styles.helperText}>
                                {errors.contact.message}
                            </HelperText>
                        )}
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    mode="outlined"
                                    label="Address"
                                    placeholder="Address"
                                    left={
                                        <TextInput.Icon
                                            icon="map-marker"
                                            color="#000"
                                            size={24}
                                        />
                                    }
                                    style={styles.input}
                                    multiline={true}
                                    error={errors.address !== undefined}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                            name="address"
                            rules={{ required: "Address is required" }}
                        />
                        {errors.address && (
                            <HelperText type="error" style={styles.helperText}>
                                {errors.address.message}
                            </HelperText>
                        )}
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    mode="outlined"
                                    label="Username"
                                    placeholder="Username"
                                    left={
                                        <TextInput.Icon
                                            icon="account"
                                            color="#000"
                                            size={24}
                                        />
                                    }
                                    style={styles.input}
                                    error={errors.username !== undefined}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                            name="username"
                            rules={{ required: "Username is required" }}
                        />
                        {errors.username && (
                            <HelperText type="error" style={styles.helperText}>
                                {errors.username.message}
                            </HelperText>
                        )}
                    </View>
                </ScrollView>
            </ScrollView>

            <Portal>
                <Dialog visible={editPassword} onDismiss={() => setEditPassword(false)}>
                    <Dialog.Title>Edit Password</Dialog.Title>
                    <Dialog.Content>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    mode='outlined'
                                    label='Password'
                                    placeholder='Password'
                                    secureTextEntry={!showPassword}
                                    left={<TextInput.Icon icon='lock' color='#000' size={24} />}
                                    error={errors.new_password !== undefined}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    right={
                                        <TextInput.Icon
                                            onPress={() => setShowPassword(!showPassword)}
                                            icon={showPassword ? 'eye-off' : 'eye'}
                                        />
                                    }
                                />
                            )}
                            name='new_password'
                            rules={{required: 'Password is required'}}
                        />
                        {errors.new_password && (
                            <HelperText type='error' style={styles.helperText}>
                                {errors.new_password.message}
                            </HelperText>
                        )}
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    mode='outlined'
                                    label='Confirm Password'
                                    placeholder='Confirm Password'
                                    left={<TextInput.Icon icon='lock' color='#000' size={24} />}
                                    secureTextEntry={!showPassword}
                                    error={errors.new_password_confirmation !== undefined}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    right={
                                        <TextInput.Icon
                                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                            icon={showConfirmPassword ? 'eye-off' : 'eye'}
                                        />
                                    }
                                />
                            )}
                            name='new_password_confirmation'
                            rules={{required: 'Password is required'}}
                        />
                        {errors.new_password_confirmation && (
                            <HelperText type='error' style={styles.helperText}>
                                {errors.new_password_confirmation.message}
                            </HelperText>
                        )}
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setEditPassword(false)}>Cancel</Button>
                        <Button onPress={handleSubmit(onSubmit)}>Save</Button>
                    </Dialog.Actions>
                </Dialog>
                <Dialog visible={editNP} onDismiss={() => setEditNP(false)}>
                    <Dialog.Title>Add Number Plate</Dialog.Title>
                    <Dialog.Content>
                        {user?.number_plate.length == 0 && <Text style={styles.subheading}>No Number Plates</Text>}
                        <FlatList
                            data={user?.number_plate}
                            renderItem={({item}) => (
                                <View style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Text style={styles.subheading}>{item.number_plate}</Text>
                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        <TextInput mode='outlined' label='New Number Plate' placeholder='Number Plate' ref={npRef} onChangeText={text => setNewNP(text)} />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setEditNP(false)}>Cancel</Button>
                        <Button onPress={() => {
                            if (newNP !== '') {
                                setEditNP(false);
                                addNP({number_plate: newNP});
                            }
                        }}>Add</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

export default Profile;