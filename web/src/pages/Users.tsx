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

const Users = () => {
    // Grid reference to refresh grid
    const gridRef = useRef<GridComponent>(null);
    const {showToast} = Toast();
    const [searchText, setSearchText] = useState<string>("");
    const {data: users, refetch: updateUsers} = useGetUsers();

    const updateGrid = () => {
        updateUsers();
        gridRef.current?.refresh();
    }

    const pageOptions = {pageSizes: true, pageSize: 10};

    useEffect(() => {
        if (gridRef.current) {
            gridRef.current.refreshColumns();
            gridRef.current.refresh();
        }
    }, [users]);

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
                            Users
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
                                            title: "Users refreshed",
                                            description: "Users refreshed successfully",
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
                            dataSource={users}
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
                                    field='name'
                                    headerText="Name"
                                    width='100'
                                    textAlign="Center"
                                    headerTextAlign="Center"
                                    editType="stringedit"
                                />
                                <ColumnDirective
                                    field='email'
                                    headerText="Email"
                                    width='100'
                                    textAlign="Center"
                                    headerTextAlign="Center"
                                    editType="stringedit"
                                    validationRules={{required: true, email: true}}
                                />
                                <ColumnDirective
                                    field='contact'
                                    headerText="Contact"
                                    width='100'
                                    textAlign="Center"
                                    headerTextAlign="Center"
                                    editType="stringedit"
                                    validationRules={{required: true, number: true}}
                                />
                                <ColumnDirective
                                    field='address'
                                    headerText="Address"
                                    width='100'
                                    textAlign="Center"
                                    headerTextAlign="Center"
                                    editType="stringedit"
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

export default Users;

