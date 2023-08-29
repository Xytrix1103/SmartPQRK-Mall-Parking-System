import React, {createRef, useEffect, useState} from 'react';
import {
    Badge,
    Box,
    Button,
    Flex,
    FormControl, FormErrorMessage,
    FormLabel,
    Grid,
    GridItem,
    Heading,
    Input,
    Link, Select,
    Stack, Table, TableContainer, Tbody, Td,
    Text, Th, Thead, Tr
} from "@chakra-ui/react";
import {Sidebar} from "../components/Sidebar";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
    useGetActivityByMonth,
    useGetParkingActivity,
    useGetParkingHoursByMonth,
    useGetRevenueByMonth
} from "../api/activityAPI";
import {useGetLots} from "../api/lotsAPI";
import {useGetLotsStatus} from "../api/mallAPI";
import {useGetReservations} from "../api/reservationsAPI";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
            margin: 10,
        },
        title: {
            display: false,
            text: 'Chart.js Line Chart',
        },
    },
};

const Dashboard = () => {
    const {data: activity, refetch: updateActivity} = useGetActivityByMonth();
    const {data: allActivity, refetch: updateAllActivity} = useGetParkingActivity();
    const {data: reservations, refetch: updateReservations} = useGetReservations();
    const {data: revenue, refetch: updateRevenue} = useGetRevenueByMonth();
    const {data: lots, refetch: updateLots} = useGetLotsStatus();
    const {data: parking_hours, refetch: updateParkingHours} = useGetParkingHoursByMonth();
    const [dataType, setDataType] = useState('activity');
    const [chartData, setChartData] = useState(activity);

    let chartReference: any = createRef();

    useEffect(() => {
        if (dataType == "activity") {
            setChartData(activity);
        } else if (dataType == "revenue") {
            setChartData(revenue);
        } else if (dataType == "parking_hours") {
            setChartData(parking_hours);
        }
    }, [dataType]);

    useEffect(() => {
        console.log(chartData);
        chartReference.current?.chartInstance?.update();
    }, [chartData]);

    //run updateLots every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            updateLots();
            updateActivity();
            updateRevenue();
            updateParkingHours();
            updateAllActivity();
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const getLabel = (dataType: string) => {
        if (dataType == "activity") {
            return "# of Visitors";
        } else if (dataType == "revenue") {
            return "Revenue Generated (RM)";
        } else if (dataType == "parking_hours") {
            return "Total Parking Hours";
        }
    }

    const getChartData = (dataType: string) => {
        if (dataType == "activity") {
            return activity;
        } else if (dataType == "revenue") {
            return revenue;
        } else if (dataType == "parking_hours") {
            return parking_hours;
        }
    }

    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', "October", "November", "December"],
        datasets: [{
            label: getLabel(dataType),
            data: getChartData(dataType),
            fill: false,
            borderColor: 'blue',
            tension: 0.1,
            backgroundColor: 'blue',
            pointRadius: 5,
            pointHoverRadius: 10,
            pointHitRadius: 30,
            pointBorderWidth: 2,
            pointStyle: 'rectRounded'
        }]
    }

    return (
        <Flex h="100vh" bg="gray.100" overflowY="auto" maxH="100vh">
            <Sidebar/>
            <Box
                as="main"
                w="80vw"
                h="100vh"
                borderLeft="1px"
                borderColor="gray.200"
            >
                <Flex justify="center" mx="auto" maxW="container" maxH="container" w="100%" h="auto">
                    <Stack spacing="8" align="left" p="8" w="100%">
                        <Heading
                            as="h1"
                            size="lg"
                            fontWeight="bold"
                            color="gray.900"
                        >
                            Dashboard
                        </Heading>
                        <Grid
                            templateRows="repeat(1, 1fr)"
                            templateColumns="repeat(2, 1fr)"
                            gap={4}
                            w="100%"
                            h="450px"
                        >
                            <GridItem colSpan={1} rowSpan={1} h="inherit">
                                <Box
                                    bg="white"
                                    boxShadow="xl"
                                    rounded="lg"
                                    p="8"
                                    overflow="hidden"
                                    w="100%"
                                    h="100%"
                                >
                                    <Flex justify="flex-end">
                                        <FormControl id="dataType" w="20%">
                                            <FormLabel>Data Type</FormLabel>
                                            <Select
                                                defaultValue={dataType}
                                                onChange={(e) => setDataType(e.target.value)}
                                            >
                                                <option value="activity">Activity</option>
                                                <option value="revenue">Revenue</option>
                                                <option value="parking_hours">Parking Hours</option>
                                            </Select>
                                        </FormControl>
                                    </Flex>
                                    <Line
                                        data={data}
                                        options={options}
                                        width={800}
                                        height={300}
                                        ref={chartReference}
                                    />
                                </Box>
                            </GridItem>
                            <GridItem colSpan={1} rowSpan={1} h="inherit">
                                <Box
                                    bg="white"
                                    boxShadow="xl"
                                    rounded="lg"
                                    p="8"
                                    overflow="hidden"
                                    w="100%"
                                    h="inherit"
                                >
                                    <TableContainer
                                        overflowY="auto"
                                        h="inherit"
                                        maxH="inherit"
                                    >
                                        <Table
                                            variant="striped"
                                            colorScheme="gray"
                                            size="sm"
                                            align="center"
                                            textAlign="center"
                                        >
                                            <Thead
                                                textTransform="uppercase"
                                                textAlign="center"
                                            >
                                                <Tr>
                                                    <Th>Lot No</Th>
                                                    <Th>Floor</Th>
                                                    <Th>Section</Th>
                                                    <Th>Status</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                            {
                                                lots?.map((lot: any) => {
                                                    return (
                                                        <>
                                                            <Tr>
                                                                <Td textAlign="center">{lot.lot_no}</Td>
                                                                <Td textAlign="center">{lot.floor.floor_no}</Td>
                                                                <Td textAlign="center">{lot.section}</Td>
                                                                <Td justifyContent="center">
                                                                    {!lot.occupied ?
                                                                        <Badge colorScheme="green">Vacant</Badge>
                                                                        :
                                                                        <Badge colorScheme="red">Occupied</Badge>
                                                                    }
                                                                </Td>
                                                            </Tr>
                                                        </>
                                                    )
                                                })
                                            }
                                            </Tbody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </GridItem>
                        </Grid>
                        <Box
                            bg="white"
                            boxShadow="xl"
                            rounded="lg"
                            p="8"
                            w="100%"
                            h="inherit"
                        >
                            <TableContainer
                                overflowY="auto"
                                h="inherit"
                                maxH="inherit"
                            >
                                <Table
                                    variant="striped"
                                    colorScheme="gray"
                                    size="sm"
                                    align="center"
                                    textAlign="center"
                                    w="100%"
                                    h="inherit"
                                >
                                    <Thead
                                        textTransform="uppercase"
                                        textAlign="center"
                                    >
                                        <Tr>
                                            <Th textAlign="center">Lot No</Th>
                                            <Th textAlign="center">User</Th>
                                            <Th textAlign="center">Time In</Th>
                                            <Th textAlign="center">Time Out</Th>
                                            <Th textAlign="center">Fees</Th>
                                            <Th textAlign="center">Reserved</Th>
                                            <Th textAlign="center">Status</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {
                                            allActivity?.map((activity: any) => {
                                                return (
                                                    <>
                                                        <Tr>
                                                            <Td textAlign="center">{activity.lot.floor.floor_no}-{activity.lot.section}-{activity.lot.lot_no}</Td>
                                                            <Td textAlign="center">{activity.user.username}</Td>
                                                            <Td textAlign="center">
                                                                {
                                                                    activity.entry_datetime ?
                                                                        new Date(activity.entry_datetime).toLocaleString("en-US", {timeZone: "Asia/Kuala_Lumpur"})
                                                                        :
                                                                        "-"
                                                                }
                                                            </Td>
                                                            <Td textAlign="center">
                                                                {
                                                                    activity.exit_datetime ?
                                                                        new Date(activity.exit_datetime).toLocaleString("en-US", {timeZone: "Asia/Kuala_Lumpur"})
                                                                        :
                                                                        "-"
                                                                }
                                                            </Td>
                                                            <Td textAlign="center">{activity.fees ? activity.fees : "-"}</Td>
                                                            <Td textAlign="center">
                                                                {
                                                                    activity.reservation_id !== null ?
                                                                        <Badge colorScheme="green">Yes</Badge>
                                                                        :
                                                                        <Badge colorScheme="red">No</Badge>
                                                                }
                                                            </Td>
                                                            <Td textAlign="center">
                                                                {
                                                                    activity.exit_datetime ?
                                                                        <Badge colorScheme="green">Exited</Badge>
                                                                        :
                                                                        <Badge colorScheme="red">Parked</Badge>
                                                                }
                                                            </Td>
                                                        </Tr>
                                                    </>
                                                )
                                            })
                                        }
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </Box>
                        {/*<Box*/}
                        {/*    bg="white"*/}
                        {/*    boxShadow="xl"*/}
                        {/*    rounded="lg"*/}
                        {/*    p="8"*/}
                        {/*    w="100%"*/}
                        {/*    h="inherit"*/}
                        {/*>*/}
                        {/*    <TableContainer*/}
                        {/*        overflowY="auto"*/}
                        {/*        h="inherit"*/}
                        {/*        maxH="inherit"*/}
                        {/*    >*/}
                        {/*        <Table*/}
                        {/*            variant="striped"*/}
                        {/*            colorScheme="gray"*/}
                        {/*            size="sm"*/}
                        {/*            align="center"*/}
                        {/*            textAlign="center"*/}
                        {/*            w="100%"*/}
                        {/*            h="inherit"*/}
                        {/*        >*/}
                        {/*            <Thead*/}
                        {/*                textTransform="uppercase"*/}
                        {/*                textAlign="center"*/}
                        {/*            >*/}
                        {/*                <Tr>*/}
                        {/*                    <Th textAlign="center">Lot No</Th>*/}
                        {/*                    <Th textAlign="center">User</Th>*/}
                        {/*                    <Th textAlign="center">Reservation Time</Th>*/}
                        {/*                    <Th textAlign="center">Destination</Th>*/}
                        {/*                </Tr>*/}
                        {/*            </Thead>*/}
                        {/*            <Tbody>*/}
                        {/*                {*/}
                        {/*                    allActivity?.map((activity: any) => {*/}
                        {/*                        return (*/}
                        {/*                            <>*/}
                        {/*                                <Tr>*/}
                        {/*                                    <Td textAlign="center">{activity.lot.lot_no}</Td>*/}
                        {/*                                    <Td textAlign="center">{activity.user.username}</Td>*/}
                        {/*                                    <Td textAlign="center">*/}
                        {/*                                        {*/}
                        {/*                                            activity.entry_datetime ?*/}
                        {/*                                                new Date(activity.entry_datetime).toLocaleString("en-US", {timeZone: "Asia/Kuala_Lumpur"})*/}
                        {/*                                                :*/}
                        {/*                                                "-"*/}
                        {/*                                        }*/}
                        {/*                                    </Td>*/}
                        {/*                                    <Td textAlign="center">*/}
                        {/*                                        {*/}
                        {/*                                            activity.exit_datetime ?*/}
                        {/*                                                new Date(activity.exit_datetime).toLocaleString("en-US", {timeZone: "Asia/Kuala_Lumpur"})*/}
                        {/*                                                :*/}
                        {/*                                                "-"*/}
                        {/*                                        }*/}
                        {/*                                    </Td>*/}
                        {/*                                    <Td textAlign="center">{activity.fees ? activity.fees : "-"}</Td>*/}
                        {/*                                    <Td textAlign="center">*/}
                        {/*                                        {*/}
                        {/*                                            activity.reservation_id ?*/}
                        {/*                                                <Badge colorScheme="green">Yes</Badge>*/}
                        {/*                                                :*/}
                        {/*                                                <Badge colorScheme="red">No</Badge>*/}
                        {/*                                        }*/}
                        {/*                                    </Td>*/}
                        {/*                                    <Td textAlign="center">*/}
                        {/*                                        {*/}
                        {/*                                            activity.exit_datetime ?*/}
                        {/*                                                <Badge colorScheme="green">Exited</Badge>*/}
                        {/*                                                :*/}
                        {/*                                                <Badge colorScheme="red">Parked</Badge>*/}
                        {/*                                        }*/}
                        {/*                                    </Td>*/}
                        {/*                                </Tr>*/}
                        {/*                            </>*/}
                        {/*                        )*/}
                        {/*                    })*/}
                        {/*                }*/}
                        {/*            </Tbody>*/}
                        {/*        </Table>*/}
                        {/*    </TableContainer>*/}
                        {/*</Box>*/}
                    </Stack>
                </Flex>
            </Box>
        </Flex>
    )
}

export default Dashboard;