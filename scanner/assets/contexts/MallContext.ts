import {createContext, SetStateAction} from "react";
import {mall} from "../../api/types";

export const MallContext = createContext({
    mall: {id: 0, address: "", name: ""} as mall,
    setMall: (mall: SetStateAction<mall>) => {},
});