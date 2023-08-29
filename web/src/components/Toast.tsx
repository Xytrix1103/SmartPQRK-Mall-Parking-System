import React from "react";
import { useToast } from '@chakra-ui/react'

export const Toast = () => {
    const toast = useToast();

    const showToast = (data: { title: any; description: any; status: any; }) => {
        toast({
            title: data.title,
            description: data.description,
            status: data.status,
            duration: 3000,
            isClosable: true,
            position: "top-right"
        })
    }

    return {
        showToast
    }
}