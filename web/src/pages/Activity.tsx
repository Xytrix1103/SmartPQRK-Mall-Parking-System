import React, {useEffect, useState, useRef} from 'react';
import {
    Box, Button,
    Flex,
    Heading, IconButton, Input, InputGroup, InputLeftElement, InputRightElement,
    Stack,
} from "@chakra-ui/react";
import {SearchIcon, AddIcon, SmallCloseIcon, RepeatIcon} from "@chakra-ui/icons";
import {Sidebar} from "../components/Sidebar";
import {Toast} from "../components/Toast";
import {useCreateAdmin, useDeleteAdmin, useGetAdmins, useUpdateAdmin} from "../api/adminsAPI";
import {
    Edit,
    Inject,
    Page,
    Sort,
    EditMode,
    EditSettingsModel,
    ColumnDirective,
    ColumnsDirective,
    GridComponent,
    Search,
    SaveEventArgs,
    CommandColumn,
    CommandModel
} from '@syncfusion/ej2-react-grids';
import {useGetUsers} from "../api/usersAPI";
import {useGetParkingActivity} from "../api/activityAPI";

const Activity = () => {
    const gridRef = useRef<GridComponent>(null);
    const {showToast} = Toast();
    const [searchText, setSearchText] = useState<string>("");
    const {data: activity, refetch: updateActivity} = useGetParkingActivity();

    const updateGrid = () => {
        updateActivity().then(() => {
            if (gridRef.current) {
                gridRef.current.dataSource = activity;
                gridRef.current.refresh();
            }
        });
    }

    const pageOptions = {pageSizes: true, pageSize: 10};

    useEffect(() => {
        console.log(activity)

        if (gridRef.current) {
            gridRef.current.dataSource = activity;
            gridRef.current.refresh();
        }
    }, [activity]);

    useEffect(() => {
        updateGrid();
    }, []);

    const searchGrid = (e: any) => {
        gridRef.current?.search(e.target.value);
        setSearchText(e.target.value);
    }

    const clearSearch = () => {
        searchGrid({target: {value: ''}});
        setSearchText("");
    }

    // @ts-ignore
    return (
        <Flex h="100vh" bg="gray.100">
            <Sidebar/>
            <Box
                as="main"
                w="80vw"
                h="100vh"
                borderLeft="1px"
                borderColor="gray.200"
            >
                < Flex align="center" justify="center" mx="auto" maxW="container" maxH="container">
                    <Stack spacing="8" align="left" p="8">
                        <Heading
                            as="h1"
                            size="lg"
                            fontWeight="bold"
                            color="gray.900"
                        >
                            Parking Activity
                        </Heading>
                        <Flex w="100%" justify="flex-start">
                            <Stack direction="row" align="center" justify="center" spacing="8">
                                <InputGroup>
                                    <InputLeftElement children={<SearchIcon/>} pointerEvents="none"/>
                                    <Input
                                        id="search"
                                        type="text"
                                        variant="flushed"
                                        placeholder="Search"
                                        size="md"
                                        w="100%"
                                        onChange={searchGrid}
                                        value={searchText}
                                        _hover={{
                                            borderColor: "blue.500"
                                        }}
                                        _focus={{
                                            borderColor: "blue.500"
                                        }}
                                    />
                                    <InputRightElement>
                                        <IconButton
                                            aria-label="Clear search"
                                            icon={<SmallCloseIcon/>}
                                            size="sm"
                                            onClick={clearSearch}
                                            visibility={searchText.length > 0 ? "visible" : "hidden"}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                                <Button
                                    leftIcon={<RepeatIcon/>}
                                    colorScheme="blue"
                                    size="sm"
                                    px="6"
                                    variant="outline"
                                    onClick={() => {
                                        updateGrid();
                                        showToast({
                                            title: "Parking activity refreshed",
                                            description: "Parking activity refreshed successfully",
                                            status: "success"
                                        });
                                    }}
                                    _hover={{
                                        bg: "blue.500",
                                        color: "white"
                                    }}
                                >
                                    Refresh
                                </Button>
                            </Stack>
                        </Flex>
                        <GridComponent
                            dataSource={activity}
                            pageSettings={pageOptions}
                            enableStickyHeader={true}
                            allowPaging={true}
                            allowSorting={true}
                            allowFiltering={true}
                            ref={gridRef}
                        >
                            <ColumnsDirective>
                                <ColumnDirective
                                    field='id'
                                    headerText="ID"
                                    isPrimaryKey={true}
                                    isIdentity={true}
                                    width='50'
                                    textAlign="Center"
                                    headerTextAlign="Center"
                                />
                                <ColumnDirective
                                    field='lot'
                                    headerText="Lot"
                                    width='100'
                                    textAlign="Center"
                                    headerTextAlign="Center"
                                    template={(props: any) => {
                                        return <div>{props.lot.floor.floor_no}-{props.lot.section}-{props.lot.lot_no}</div>
                                    }}
                                />
                                <ColumnDirective
                                    field='user_id'
                                    headerText="User"
                                    width='100'
                                    textAlign="Center"
                                    headerTextAlign="Center"
                                />
                                <ColumnDirective
                                    field='directory.name'
                                    headerText="Directory"
                                    width='100'
                                    textAlign="Center"
                                    headerTextAlign="Center"
                                />
                                <ColumnDirective
                                    field='entry_station.name'
                                    headerText="Entry Station"
                                    width='100'
                                    textAlign="Center"
                                    headerTextAlign="Center"
                                />
                                <ColumnDirective
                                    field='exit_station.name'
                                    headerText="Exit Station"
                                    width='100'
                                    textAlign="Center"
                                    headerTextAlign="Center"
                                />
                                <ColumnDirective
                                    field='number_plate.number_plate'
                                    headerText="Number Plate"
                                    width='100'
                                    textAlign="Center"
                                    headerTextAlign="Center"
                                />
                                <ColumnDirective
                                    field='entry_datetime'
                                    headerText="Enter Datetime"
                                    width='100'
                                    textAlign="Center"
                                    headerTextAlign="Center"
                                    template={(props: any) => {
                                        {
                                            return props.entry_datetime ?
                                            <div>
                                                {new Date(props.entry_datetime).toLocaleString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'numeric',
                                                    year: 'numeric',
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                    hour12: false
                                                })}
                                            </div> : ""
                                        }
                                    }}
                                />
                                <ColumnDirective
                                    field='exit_datetime'
                                    headerText="Exit Datetime"
                                    width='100'
                                    textAlign="Center"
                                    headerTextAlign="Center"
                                    template={(props: any) => {
                                        {
                                            return props.exit_datetime ?
                                                <div>
                                                    {new Date(props.exit_datetime).toLocaleString('en-GB', {
                                                        day: 'numeric',
                                                        month: 'numeric',
                                                        year: 'numeric',
                                                        hour: 'numeric',
                                                        minute: 'numeric',
                                                        hour12: false
                                                    })}
                                                </div> : ""
                                        }
                                    }}
                                />
                            </ColumnsDirective>
                            <Inject
                                services={[Page, Sort, Search]}
                            />
                        </GridComponent>
                    </Stack>
                </Flex>
            </Box>
        </Flex>
    )
        ;
};

export default Activity;

