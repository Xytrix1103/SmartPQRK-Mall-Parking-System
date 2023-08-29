import {createContext, SetStateAction} from "react";
import {mall} from "../../api/types";

export const ParkedContext = createContext({
    parked: false,
    setParked: (parked: SetStateAction<boolean>) => {},
});