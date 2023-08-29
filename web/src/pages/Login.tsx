import React from 'react';
import {
    Button,
    Flex,
    FormControl, FormErrorMessage,
    FormLabel,
    Grid,
    GridItem,
    Heading, IconButton, Image,
    Input, InputGroup, InputRightElement,
    Stack,
    Text
} from "@chakra-ui/react";
import {ViewIcon, ViewOffIcon} from "@chakra-ui/icons";
import {useForm} from "react-hook-form";
import {authenticateLogin, login} from "../api/auth";
import {loginRequest, loginResponse} from "../api/types";
import {useMutation} from "react-query";
import {useNavigate} from "react-router-dom";
import useModals from "../components/Modals";
import logo from "../assets/images/logo.png";

function Login() {
    const navigate = useNavigate();
    const {alert} = useModals();
    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)

    const {mutate} = useMutation<loginResponse, Error, loginRequest>(login, {
        onSuccess: (data: loginResponse) => {
            console.log(data)
            if(data && data.token != "") {
                authenticateLogin(navigate).then();
            } else {
                alert("Login failed. Please try again.").then();
            }
        }
    })

    const {register, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            username: '',
            password: '',
        }
    });

    const onSubmit = async (data: loginRequest) => {
        mutate(data);
    }

    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            w={'100%'}
            h={'100%'}
            bg={'gray.50'}>
            <Stack spacing={20} mx={'auto'} maxW={'lg'} py={12} px={6} w={'100%'} h={'100%'}>
                <Image src={logo} alt="Logo" width="200px" height="auto" alignSelf="center"/>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid templateColumns="repeat(4, 1fr)" gap={10}>
                        <GridItem colSpan={4}>
                            <FormControl id="username" isInvalid={!!errors.username}>
                                <FormLabel>Username</FormLabel>
                                <Input
                                    {...register("username", {
                                            required: "Username is required",
                                        }
                                    )}
                                    placeholder="Username"
                                />
                                <FormErrorMessage>
                                    {errors.username && errors.username.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={4}>
                            <FormControl id="password" isInvalid={!!errors.password}>
                                <FormLabel>Password</FormLabel>
                                <InputGroup>
                                    <Input
                                        {...register("password", {
                                                required: "Password is required",
                                            }
                                        )}
                                        placeholder="Password"
                                        type={show ? 'text' : 'password'}
                                    />
                                    <InputRightElement>
                                        <IconButton variant="unstyled" aria-label="Toggle password visibility" icon={!show ? <ViewOffIcon/> : <ViewIcon/>} onClick={handleClick} />
                                    </InputRightElement>
                                </InputGroup>
                                <FormErrorMessage>
                                    {errors.password && errors.password.message}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={4} alignSelf="center" justifySelf="center">
                            <Button
                                type="submit"
                                bg={'blue.400'}
                                color={'white'}
                                alignSelf={'center'}
                                _hover={{
                                    bg: 'blue.500',
                                }
                                }>
                                Login
                            </Button>
                        </GridItem>
                    </Grid>
                </form>
            </Stack>
        </Flex>
    )
}

export default Login;