import {Box, Button, Flex, Heading, Spacer, Stack} from "@chakra-ui/react";
import {NavLink, useNavigate} from "react-router-dom";
import {Link as ChakraLink, Text, Image} from "@chakra-ui/react";
import logo from "../assets/images/logo.png";
import React from "react";
import {logout} from "../api/auth";
import useModals from "./Modals";
import {useGetMall} from "../api/mallAPI";
import {useGetAdmin} from "../api/adminsAPI";

export const Sidebar = () => {
    const navigate = useNavigate();

    const {confirm} = useModals();

    const {data} = useGetMall();

    const {data: admin} = useGetAdmin();

    const onClick = async () => {
        if(await confirm("Are you sure you want to logout?")) {
           if(logout().success) {
               navigate("/")
           }
        }
    }

    return (
        <Box
            as="aside"
            w="20vw"
            h="100vh"
            bg="white"
            borderRight="1px"
            borderColor="gray.200"
            boxShadow="md"
            dropShadow="md"
            textShadow="md"
            position="sticky"
            top="0"
        >
            <Flex align="center" justify="center" mx="auto" maxW="container" maxH="container">
                <Stack spacing="2" align="center" p="8">
                    <ChakraLink display="flex" alignItems="center">
                        <Stack spacing="4" align="center" direction="column">
                            <Image src={logo} h={20} alt="KH Education Group Logo" />
                            <Heading
                                as="h1"
                                size="lg"
                                fontWeight="bold"
                                color="gray.900"
                            >
                                SmartPQRK
                            </Heading>
                        </Stack>
                    </ChakraLink>
                    <Heading
                        as="h3"
                        size="md"
                        fontWeight="bold"
                        color="gray.900"
                    >
                        {data?.name}
                    </Heading>
                    <Heading
                        as="h3"
                        size="sm"
                        fontWeight="bold"
                        color="gray.900"
                    >
                        {admin?.name}
                    </Heading>
                    <Box
                        w="100%"
                        h="1px"
                        bg="black"
                        border="1px"
                        borderColor="black"
                    />
                    <Stack spacing="4" align="center" w="100%">
                        <ChakraLink
                            display="flex"
                            alignItems="center"
                            as={NavLink}
                            to="/dashboard"
                            _hover={{ textColor: "blue", fontWeight: "bold" }}
                            _activeLink={{ textColor: "blue", fontWeight: "bold" }}
                        >
                            <Text fontSize="md">Dashboard</Text>
                        </ChakraLink>
                        <ChakraLink
                            display="flex"
                            alignItems="center"
                            as={NavLink}
                            to="/directory"
                            _hover={{ textColor: "blue", fontWeight: "bold" }}
                            _activeLink={{ textColor: "blue", fontWeight: "bold" }}
                        >
                            <Text fontSize="md">Directory</Text>
                        </ChakraLink>
                        <ChakraLink
                            display="flex"
                            alignItems="center"
                            as={NavLink}
                            to="/lots"
                            _hover={{ textColor: "blue", fontWeight: "bold" }}
                            _activeLink={{ textColor: "blue", fontWeight: "bold" }}
                        >
                            <Text fontSize="md">Parking Lots</Text>
                        </ChakraLink>
                        <ChakraLink
                            display="flex"
                            alignItems="center"
                            as={NavLink}
                            to="/activity"
                            _hover={{ textColor: "blue", fontWeight: "bold" }}
                            _activeLink={{ textColor: "blue", fontWeight: "bold" }}
                        >
                            <Text fontSize="md">Parking Activity</Text>
                        </ChakraLink>
                        <ChakraLink
                            display="flex"
                            alignItems="center"
                            as={NavLink}
                            to="/reservations"
                            _hover={{ textColor: "blue", fontWeight: "bold" }}
                            _activeLink={{ textColor: "blue", fontWeight: "bold" }}
                        >
                            <Text fontSize="md">Parking Reservations</Text>
                        </ChakraLink>
                        <ChakraLink
                            display="flex"
                            alignItems="center"
                            as={NavLink}
                            to="/admins"
                            _hover={{ textColor: "blue", fontWeight: "bold" }}
                            _activeLink={{ textColor: "blue", fontWeight: "bold" }}
                        >
                            <Text fontSize="md">Admins</Text>
                        </ChakraLink>
                        <ChakraLink
                            display="flex"
                            alignItems="center"
                            as={NavLink}
                            to="/users"
                            _hover={{ textColor: "blue", fontWeight: "bold" }}
                            _activeLink={{ textColor: "blue", fontWeight: "bold" }}
                        >
                            <Text fontSize="md">Users</Text>
                        </ChakraLink>
                        <ChakraLink
                            display="flex"
                            alignItems="center"
                            as={NavLink}
                            to="/settings"
                            _hover={{ textColor: "blue", fontWeight: "bold" }}
                            _activeLink={{ textColor: "blue", fontWeight: "bold" }}
                        >
                            <Text fontSize="md">Settings</Text>
                        </ChakraLink>
                        <Spacer />
                        <Button
                            colorScheme="blue"
                            variant="outline"
                            size="md"
                            w="80%"
                            h="12"
                            borderRadius="0"
                            _hover={{ bg: "blue.300" }}
                            _active={{ bg: "blue.300" }}
                            onClick={onClick}
                        >
                            Logout
                        </Button>
                    </Stack>
                </Stack>
            </Flex>
        </Box>
    )
}