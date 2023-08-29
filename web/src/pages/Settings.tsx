import React from "react";
import {Sidebar} from "../components/Sidebar";
import {
    Box, Button,
    Flex,
    Heading, IconButton,
    Input,
    InputGroup,
    InputRightElement, ListIcon,
    ListItem,
    Stack,
    UnorderedList
} from "@chakra-ui/react";
import {Toast} from "../components/Toast";
import {useGetMall} from "../api/mallAPI";
import {useCreateFloor, useDeleteFloor, useGetFloors, useUpdateFloor} from "../api/floorsAPI";
import {AddIcon, CheckCircleIcon, DeleteIcon, EditIcon, CloseIcon} from "@chakra-ui/icons";
import {useCreateWing, useDeleteWing, useGetWings, useUpdateWing} from "../api/wingsAPI";
import useModals from "../components/Modals";


const Settings = () => {
    const {showToast} = Toast();
    const {confirm} = useModals();

    const newFloorRef = React.useRef<HTMLInputElement>(null);
    const newWingRef = React.useRef<HTMLInputElement>(null);

    const [editFloorID, setEditFloorID] = React.useState(0);
    const [editFloorNo, setEditFloorNo] = React.useState("");
    const [editWingID, setEditWingID] = React.useState(0);
    const [editWing, setEditWing] = React.useState("");

    const {data: mallData} = useGetMall();

    const {data: floors} = useGetFloors(
        (data) => {
            console.log(data);
        }
    );

    const {mutate: updateFloor} = useUpdateFloor(
        (data) => {
            console.log(data);
            setEditFloorID(0);
            showToast({
                title: "Floor Updated.",
                description: "Floor has been updated successfully.",
                status: "success",
            });
        }
    );

    const {mutate: deleteFloor} = useDeleteFloor(
        (data) => {
            console.log(data);
            floors?.splice(floors.findIndex((floor: any) => floor.id === data.id), 1);
            showToast({
                title: "Floor Deleted.",
                description: "Floor has been deleted successfully.",
                status: "success",
            });
        }
    );

    const {mutate: createFloor} = useCreateFloor(
        (data) => {
            console.log(data);
            floors?.push(data);
            newFloorRef.current!.value = "";
            showToast({
                title: "Floor Created.",
                description: "Floor has been created successfully.",
                status: "success",
            });
        }
    );

    const {data: wings} = useGetWings(
        (data) => {
            console.log(data);
        }
    );

    const {mutate: updateWing} = useUpdateWing(
        (data) => {
            console.log(data);
            setEditWingID(0);
            showToast({
                title: "Wing Updated.",
                description: "Wing has been updated successfully.",
                status: "success",
            });
        }
    );

    const {mutate: deleteWing} = useDeleteWing(
        (data) => {
            console.log(data);
            wings?.splice(wings.findIndex((wing: any) => wing.id === data.id), 1);
            showToast({
                title: "Wing Deleted.",
                description: "Wing has been deleted successfully.",
                status: "success",
            });
        }
    );

    const {mutate: createWing} = useCreateWing(
        (data) => {
            console.log(data);
            wings?.push(data);
            newWingRef.current!.value = "";
            showToast({
                title: "Wing Created.",
                description: "Wing has been created successfully.",
                status: "success",
            });
        }
    );

    return (
        <Flex h="100vh" bg="gray.100" overflow="scroll" overflowX="hidden" maxH="100vh">
            <Sidebar/>
            <Box
                as="main"
                w="80vw"
                h="100vh"
                borderLeft="1px"
                borderColor="gray.200"
            >
                <Flex align="center" justify="center" mx="auto" maxW="container" maxH="container">
                    <Stack spacing="4" align="left" p="8" w="100%">
                        <Heading
                            as="h1"
                            size="lg"
                            fontWeight="bold"
                            color="gray.900"
                        >
                            Settings
                        </Heading>
                        <Flex w="100%" justify="flex-start">
                            <Stack direction="column" align="left" justify="left" spacing="4" w="100%">
                                <Stack direction="row" align="center" justify="left" spacing="4" w="100%">
                                    <Heading
                                        as="h2"
                                        size="sm"
                                        fontWeight="bold"
                                        color="gray.900"
                                    >
                                        Name
                                    </Heading>
                                    <Input
                                        type="text"
                                        placeholder="Mall Name"
                                        size="md"
                                        ml="4"
                                        w="auto"
                                        variant="flushed"
                                        opacity="0.8"
                                        defaultValue={mallData?.name}
                                    />
                                </Stack>
                                <Stack direction="row" align="center" justify="left" spacing="4" w="100%">
                                    <Heading
                                        as="h2"
                                        size="sm"
                                        fontWeight="bold"
                                        color="gray.900"
                                    >
                                        Address
                                    </Heading>
                                    <Input
                                        type="text"
                                        placeholder="Mall Address"
                                        size="md"
                                        ml="4"
                                        w="auto"
                                        variant="flushed"
                                        opacity="0.8"
                                        defaultValue={mallData?.address}
                                    />
                                </Stack>
                                <Stack direction="column" align="left" justify="left" spacing="2" w="100%">
                                    <Heading
                                        as="h2"
                                        size="sm"
                                        fontWeight="bold"
                                        color="gray.900"
                                    >
                                        Floors
                                    </Heading>
                                    <Box>
                                        <UnorderedList spacing={2}>
                                            {floors?.map((floor: any) => (
                                                <ListItem key={floor.id}>
                                                    <Flex>
                                                        <Input
                                                            type="text"
                                                            size="md"
                                                            ml="4"
                                                            w="auto"
                                                            variant={editFloorID !== floor.id ? "unstyled" : "filled"}
                                                            defaultValue={floor.floor_no}
                                                            isReadOnly={editFloorID !== floor.id || editFloorID === 0}
                                                            onChange={(e) => {
                                                                setEditFloorNo(e.target.value);
                                                            }}
                                                        />
                                                        <Stack direction="row" ml="2" spacing="2" align="center" justify="center">
                                                            {
                                                                editFloorID !== floor.id ? (
                                                                    <>
                                                                        <IconButton
                                                                            size="sm"
                                                                            aria-label="Edit Floor"
                                                                            icon={<EditIcon/>}
                                                                            onClick={() => setEditFloorID(floor.id)}
                                                                        />
                                                                        <IconButton
                                                                            size="sm"
                                                                            aria-label="Delete Floor"
                                                                            icon={<DeleteIcon/>}
                                                                            onClick={async () => {
                                                                                if (await confirm("Are you sure you want to delete this floor?")) {
                                                                                    deleteFloor({
                                                                                        id: floor.id
                                                                                    });
                                                                                }
                                                                            }}
                                                                        />
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <IconButton
                                                                            size="sm"
                                                                            aria-label="Save Edit Floor"
                                                                            icon={<CheckCircleIcon/>}
                                                                            colorScheme="green"
                                                                            onClick={() => {
                                                                                updateFloor({
                                                                                    id: floor.id,
                                                                                    floor_no: editFloorNo
                                                                                });
                                                                            }}
                                                                        />
                                                                        <IconButton
                                                                            size="sm"
                                                                            aria-label="Cancel Edit Floor"
                                                                            icon={<CloseIcon/>}
                                                                            colorScheme="red"
                                                                            onClick={() => setEditFloorID(0)}
                                                                        />
                                                                    </>
                                                                )
                                                            }
                                                        </Stack>
                                                    </Flex>
                                                </ListItem>
                                            ))}
                                            <ListItem key={0}>
                                                <Flex>
                                                    <Stack direction="row" align="center" justify="left" spacing="4" w="100%">
                                                        <Input
                                                            type="text"
                                                            placeholder="New Floor Name"
                                                            size="md"
                                                            ml="4"
                                                            w="auto"
                                                            ref={newFloorRef}
                                                        />
                                                        <Box ml="2">
                                                            <IconButton
                                                                size="sm"
                                                                aria-label="Add Floor"
                                                                icon={<AddIcon/>}
                                                                onClick={() => {
                                                                    createFloor({
                                                                        floor_no: newFloorRef.current?.value,
                                                                        token: localStorage.getItem("token")
                                                                    });
                                                                }}
                                                            />
                                                        </Box>
                                                    </Stack>
                                                </Flex>
                                            </ListItem>
                                        </UnorderedList>
                                    </Box>
                                </Stack>
                                <Stack direction="column" align="left" justify="left" spacing="2" w="100%">
                                    <Heading
                                        as="h2"
                                        size="sm"
                                        fontWeight="bold"
                                        color="gray.900"
                                    >
                                        Wings
                                    </Heading>
                                    <Box>
                                        <UnorderedList spacing={2}>
                                            {wings?.map((wing: any) => (
                                                <ListItem key={wing.id}>
                                                    <Flex>
                                                        <Input
                                                            type="text"
                                                            size="md"
                                                            ml="4"
                                                            w="auto"
                                                            variant={editWingID !== wing.id ? "unstyled" : "filled"}
                                                            defaultValue={wing.wing}
                                                            isReadOnly={editWingID !== wing.id || editWingID === 0}
                                                            onChange={(e) => {
                                                                setEditWing(e.target.value);
                                                            }}
                                                        />
                                                        <Stack direction="row" ml="2" spacing="2" align="center" justify="center">
                                                            {
                                                                editWingID !== wing.id ? (
                                                                    <>
                                                                        <IconButton
                                                                            size="sm"
                                                                            aria-label="Edit Wing"
                                                                            icon={<EditIcon/>}
                                                                            onClick={() => setEditWingID(wing.id)}
                                                                        />
                                                                        <IconButton
                                                                            size="sm"
                                                                            aria-label="Delete Wing"
                                                                            icon={<DeleteIcon/>}
                                                                            onClick={async () => {
                                                                                if (await confirm("Are you sure you want to delete this wing?")) {
                                                                                    deleteWing({
                                                                                        id: wing.id
                                                                                    });
                                                                                }
                                                                            }}
                                                                        />
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <IconButton
                                                                            size="sm"
                                                                            aria-label="Save Edit Wing"
                                                                            icon={<CheckCircleIcon/>}
                                                                            colorScheme="green"
                                                                            onClick={() => {
                                                                                updateWing({
                                                                                    id: wing.id,
                                                                                    wing: editWing
                                                                                });
                                                                            }}
                                                                        />
                                                                        <IconButton
                                                                            size="sm"
                                                                            aria-label="Cancel Edit Wing"
                                                                            icon={<CloseIcon/>}
                                                                            colorScheme="red"
                                                                            onClick={() => setEditWingID(0)}
                                                                        />
                                                                    </>
                                                                )
                                                            }
                                                        </Stack>
                                                    </Flex>
                                                </ListItem>
                                            ))}
                                            <ListItem key={0}>
                                                <Flex>
                                                    <Stack direction="row" align="center" justify="left" spacing="4" w="100%">
                                                        <Input
                                                            type="text"
                                                            placeholder="New Wing Name"
                                                            size="md"
                                                            ml="4"
                                                            w="auto"
                                                            ref={newWingRef}
                                                        />
                                                        <Box ml="2">
                                                            <IconButton
                                                                size="sm"
                                                                aria-label="Add Wing"
                                                                icon={<AddIcon/>}
                                                                onClick={() => {
                                                                    createWing({
                                                                        wing: newWingRef.current?.value,
                                                                        token: localStorage.getItem("token")
                                                                    });
                                                                }}
                                                            />
                                                        </Box>
                                                    </Stack>
                                                </Flex>
                                            </ListItem>
                                        </UnorderedList>
                                    </Box>
                                </Stack>
                            </Stack>
                        </Flex>
                    </Stack>
                </Flex>
            </Box>
        </Flex>
    )
}

export default Settings;