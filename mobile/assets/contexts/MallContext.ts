import {createContext, SetStateAction} from "react";
import {mall} from "../../api/types";

export const MallContext = createContext({
    mall: {id: 0, address: "", name: "", vacant: 0, total: 0} as mall,
    setMall: (mall: SetStateAction<mall>) => {},
});