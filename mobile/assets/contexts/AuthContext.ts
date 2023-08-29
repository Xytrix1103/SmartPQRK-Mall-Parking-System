import {createContext, SetStateAction} from "react";
import {mall} from "../../api/types";

export const AuthContext = createContext({
    token: "" as string | null,
    setToken: (token: string | null) => {},
    login: async (loginRequest: any) => { return {} },
    logout: () => {},
});