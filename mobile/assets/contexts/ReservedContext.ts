import {createContext, SetStateAction} from "react";
import {mall} from "../../api/types";

export const ReservedContext = createContext({
    reserved: false,
    setReserved: (reserved: SetStateAction<boolean>) => {},
});