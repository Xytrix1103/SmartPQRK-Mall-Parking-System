import React from "react";
import {ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, HelperText } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {registerStyles as styles} from "../assets/styles/styles";
import {useRegister} from "../api/user";

const Register = () => {
    const { control, handleSubmit, formState: { errors }, } = useForm({
        defaultValues: {
            name: "",
            email: "",
            contact: "",
            address: "",
            username: "",
            password: "",
            password_confirmation: "",
        },
    });

    const insets = useSafeAreaInsets();
    const {mutate: register} = useRegister();

    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const onSubmit = (data: any) => {
        console.log(data)
        register(data);
    }

    return (
        <View style={{
            flex: 1,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            width: '100%',
        }}>
            <View style={styles.container}>
                <Text style={styles.heading}>Register</Text>
                <ScrollView style={{width: '100%'}}>
                    <View style={styles.form}>
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
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    mode='outlined'
                                    label='Password'
                                    placeholder='Password'
                                    secureTextEntry={!showPassword}
                                    left={<TextInput.Icon icon='lock' color='#000' size={24} />}
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
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    mode='outlined'
                                    label='Confirm Password'
                                    placeholder='Confirm Password'
                                    left={<TextInput.Icon icon='lock' color='#000' size={24} />}
                                    secureTextEntry={!showPassword}
                                    style={styles.input}
                                    error={errors.password_confirmation !== undefined}
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
                            name='password_confirmation'
                            rules={{required: 'Password is required'}}
                        />
                        {errors.password_confirmation && (
                            <HelperText type='error' style={styles.helperText}>
                                {errors.password_confirmation.message}
                            </HelperText>
                        )}
                    </View>
                    <Button mode='contained' style={styles.button} onPress={handleSubmit(onSubmit)}>
                        Register
                    </Button>
                </ScrollView>
            </View>
        </View>
    );
}

export default Register;