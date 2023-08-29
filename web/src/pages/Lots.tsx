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
import {useCreateLot, useDeleteLot, useGetLots, useUpdateLot} from "../api/lotsAPI";
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
    IEditCell,
    Search,
    SaveEventArgs,
    ForeignKey,
    CommandColumn,
    CommandModel
} from '@syncfusion/ej2-react-grids';
import {DataManager, Query} from '@syncfusion/ej2-data';
import {useGetFloors} from "../api/floorsAPI";
import {useGetWings} from "../api/wingsAPI";

const Lots = () => {
    // Grid reference to refresh grid
    const gridRef = useRef<GridComponent>(null);
    const {showToast} = Toast();
    const [searchText, setSearchText] = useState<string>("");
    const {data: lots, refetch: updateLots} = useGetLots();

    const updateGrid = () => {
        updateLots();
    }

    // Fetch floors data
    const {data: floors} = useGetFloors(
        (data) => {
            console.log(data);
        }
    );

    // Fetch wings data
    const {data: wings} = useGetWings(
        (data) => {
            console.log(data);
        }
    );

    const {mutate: updateLot} = useUpdateLot();
    const {mutate: deleteLot} = useDeleteLot();
    const {mutate: createLot} = useCreateLot();

    const editOptions: EditSettingsModel = {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
        mode: 'Dialog' as EditMode,
        showDeleteConfirmDialog: true,
        showConfirmDialog: true
    };
    const pageOptions = {pageSizes: true, pageSize: 10};
    const floorParams: IEditCell = {
        params: {
            actionComplete: () => {
            },
            allowFiltering: true,
            dataSource: new DataManager(floors),
            fields: {text: "floor_no", value: "id"},
            query: new Query(),
        }
    };
    const wingParams: IEditCell = {
        params: {
            actionComplete: () => {
            },
            allowFiltering: true,
            dataSource: new DataManager(wings),
            fields: {text: "wing", value: "id"},
            query: new Query()
        }
    };

    const actionComplete = (args: SaveEventArgs) => {
        if (args.requestType === 'save') {
            const data = args.data;
            console.log(data)
            // @ts-ignore
            if (data.id === null || data.id === undefined) {
                createLot(data, {
                    onSuccess: () => {
                        showToast({
                            title: "Lot created",
                            description: "Lot created successfully",
                            status: "success"
                        });

                        updateGrid();
                    }
                });
            } else {
                updateLot(data, {
                    onSuccess: () => {
                        showToast({
                            title: "Lot updated",
                            description: "Lot updated successfully",
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
            deleteLot(deletedData, {
                onSuccess: () => {
                    showToast({
                        title: "Lot deleted",
                        description: "Lot deleted successfully",
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
    }, [lots, floors, wings]);

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
                <Flex align="center" justify="center" mx="auto" maxW="container" maxH="container">
                    <Stack spacing="8" align="left" p="8">
                        <Heading
                            as="h1"
                            size="lg"
                            fontWeight="bold"
                            color="gray.900"
                        >
                            Parking Lots
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
                            dataSource={lots}
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
                                    field='lot_no'
                                    headerText="Lot No."
                                    width='100'
                                    textAlign="Center"
                                    headerTextAlign="Center"
                                    editType="numericedit"
                                    edit={
                                        {
                                            params: {
                                                decimals: 0,
                                                format: 'n'
                                            }
                                        }
                                    }
                                />
                                <ColumnDirective
                                    field='section'
                                    headerText="Section"
                                    width='100'
                                    textAlign="Center"
                                    headerTextAlign="Center"
                                    editType="stringedit"
                                />
                                <ColumnDirective
                                    field='wing_id'
                                    headerText="Wing"
                                    width='100'
                                    textAlign="Center"
                                    headerTextAlign="Center"
                                    editType="dropdownedit"
                                    edit={wingParams}
                                    foreignKeyValue="wing" // Update this to "wingID"
                                    foreignKeyField="id" // Update this to "wing"
                                    dataSource={wings}
                                />
                                <ColumnDirective
                                    field='floor_id'
                                    headerText="Floor"
                                    width='100'
                                    textAlign="Center"
                                    headerTextAlign="Center"
                                    editType="dropdownedit"
                                    edit={floorParams}
                                    foreignKeyValue="floor_no" // Update this to "floorID"
                                    foreignKeyField="id" // Update this to "floor_no"
                                    dataSource={floors}
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
                                services={[Page, Sort, Edit, Search, ForeignKey, CommandColumn]}
                            />
                        </GridComponent>
                    </Stack>
                </Flex>
            </Box>
        </Flex>
    );
};

export default Lots;

