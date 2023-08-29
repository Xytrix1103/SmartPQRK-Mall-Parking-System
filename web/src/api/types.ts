export interface loginRequest {
    username: string;
    password: string;
}

export interface loginResponse {
    msg: string;
    token: string;
}

export interface logoutRequest {
    token: string;
}

export interface logoutResponse {
    msg: string;
    success: boolean;
}

export interface loginResponse {
    msg: string;
    token: string;
    mall_id: string;
}

export interface directoryRequest {
    mall_id: string;
}

export interface directory {
    id: string;
    lot_no: string;
    name: string;
    wing: string;
    floor: string;
}

