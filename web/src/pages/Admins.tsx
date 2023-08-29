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

const Admins = () => {
    // Grid reference to refresh grid
    const gridRef = useRef<GridComponent>(null);
    const {showToast} = Toast();
    const [admins, setAdmins] = useState<any>();
    const [searchText, setSearchText] = useState<string>("");
    const {mutate: getAdmins} = useGetAdmins();

    const updateGrid = () => {
        getAdmins(null, {
            onSuccess: (data) => {
                console.log(data);
                setAdmins(data);
            }
        });
    }

    const {mutate: updateAdmin} = useUpdateAdmin();
    const {mutate: deleteAdmin} = useDeleteAdmin();
    const {mutate: createAdmin} = useCreateAdmin();

    const editOptions: EditSettingsModel = {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
        mode: 'Dialog' as EditMode,
        showDeleteConfirmDialog: true,
        showConfirmDialog: true
    };
    const pageOptions = {pageSizes: true, pageSize: 10};

    const actionComplete = (args: SaveEventArgs) => {
        if (args.requestType === 'save') {
            const data = args.data;
            console.log(data)
            // @ts-ignore
            if (data.id === null || data.id === undefined) {
                createAdmin(data, {
                    onSuccess: () => {
                        showToast({
                            title: "Admin created",
                            description: "Admin created successfully",
                            status: "success"
                        });

                        updateGrid();
                    }
                });
            } else {
                updateAdmin(data, {
                    onSuccess: () => {
                        showToast({
                            title: "Admin updated",
                            description: "Admin updated successfully",
                            status: "success"
                        });
                        updateGrid();
                    }
                });
            }

        } else if (args.requestType === 'delete') {
            // @ts-ignore
            const deletedData = args.data[0];
            console.log(deletedData)
            deleteAdmin(deletedData, {
                onSuccess: () => {
                    showToast({
                        title: "Admin deleted",
                        description: "Admin deleted successfully",
                        status: "success"
                    });
                    updateGrid();
                }
            });
        }
    };

    const commands: CommandModel[] = [
        {type: 'Edit', buttonOption: {cssClass: 'e-flat', iconCss: 'e-edit e-icons'}},
        {type: 'Delete', buttonOption: {cssClass: 'e-flat', iconCss: 'e-delete e-icons'}},
    ];

    useEffect(() => {
        if (gridRef.current) {
            gridRef.current.refreshColumns();
            gridRef.current.refresh();
        }
    }, [admins]);

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
                    Admins
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
        leftIcon={<AddIcon/>}
        colorScheme="blue"
        size="sm"
        px="5"
        variant="outline"
        onClick={() => {
            gridRef.current?.addRecord();
        }}
        _hover={{
            bg: "blue.500",
            color: "white"
        }}
    >
        Add
    </Button>
    <Button
        leftIcon={<RepeatIcon/>}
        colorScheme="blue"
        size="sm"
        px="6"
        variant="outline"
        onClick={() => {
            updateGrid();
            showToast({
                title: "Admins refreshed",
                description: "Admins refreshed successfully",
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
        dataSource={admins}
        editSettings={editOptions}
        pageSettings={pageOptions}
        enableStickyHeader={true}
        allowPaging={true}
        allowSorting={true}
        allowFiltering={true}
        ref={gridRef}
        actionComplete={actionComplete}
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
                field='username'
                headerText="Username"
                width='100'
                textAlign="Center"
                headerTextAlign="Center"
                editType="stringedit"
            />
            <ColumnDirective
                field='password'
                headerText="Password"
                width='100'
                textAlign="Center"
                headerTextAlign="Center"
                editType="stringedit"
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
            <ColumnDirective
                field=""
                headerText="Commands"
                width="100"
                textAlign="Center"
                headerTextAlign="Center"
                allowFiltering={false}
                commands={commands}
            />
        </ColumnsDirective>
        <Inject
            services={[Page, Sort, Edit, Search, CommandColumn]}
        />
    </GridComponent>
</Stack>
</Flex>
</Box>
</Flex>
)
    ;
};

export default Admins;

