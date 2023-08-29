import {createContext, SetStateAction} from "react";
import {station} from "../../api/types";

export const StationContext = createContext({
    station: {id: 0, is_entrance: false, mall_id: 0} as station,
    setStation: (station: SetStateAction<station>) => {},
});