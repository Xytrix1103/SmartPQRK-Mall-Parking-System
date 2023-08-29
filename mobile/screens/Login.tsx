import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {Button, HelperText, Text, TextInput} from 'react-native-paper';
import {Controller, useForm} from 'react-hook-form';
import {useMutation} from "@tanstack/react-query";
import * as SecureStore from 'expo-secure-store';
import {AuthContext} from "../assets/contexts/AuthContext";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {loginStyles as styles} from "../assets/styles/styles";

const Login = ({navigation}: any) => {
    const insets = useSafeAreaInsets();

    useEffect(() => {
        console.log("Login screen mounted")
    }, [])

    const {control, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const [showPassword, setShowPassword] = useState(false);

    const Auth = useContext(AuthContext);

    const {mutate} = useMutation<any, Error, any>(Auth.login, {
        onSuccess: async (data: any) => {
            console.log(data)
            await Auth.setToken(data.token);
            navigation.navigate('Home');
        },
        onError: (error: Error) => {
            console.log(error)
        }
    })

    const onSubmit = async (data: any) => {
        console.log(data)
        mutate(data);
    }

    return (
        <View style={{
            flex: 1,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
        }}>
            <View style={styles.container}>
                <Image
                    source={require('../assets/images/logo.png')}
                    style={styles.logo}
                />
                <Text style={styles.heading}>{Auth.token}</Text>
                <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                            mode='outlined'
                            label='Username'
                            placeholder='Username'
                            style={styles.input}
                            error={errors.username !== undefined}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name='username'
                    rules={{required: 'Username is required'}}
                />
                {errors.username && (
                    <HelperText type='error' style={styles.helperText}>
                        {errors.username.message}
                    </HelperText>
                )}
                <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                            mode='outlined'
                            label='Password'
                            placeholder='Password'
                            secureTextEntry={!showPassword}
                            style={styles.input}
                            error={errors.password !== undefined}
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
                    name='password'
                    rules={{required: 'Password is required'}}
                />
                {errors.password && (
                    <HelperText type='error' style={styles.helperText}>
                        {errors.password.message}
                    </HelperText>
                )}
                <Button mode='contained' style={styles.button} onPress={handleSubmit(onSubmit)}>
                    Login
                </Button>
                <Button
                    mode='outlined'
                    style={styles.button}
                    onPress={() => navigation.navigate('Register')}
                >
                Don't have an account? Register here
                </Button>
            </View>
        </View>
    );
};

export default Login;