export interface user {
    id: number;
    name: string;
    email: string;
    password: string;
    username: string;
    contact: string;
    address: string;
}

export interface directory {
    id: number;
    name: string;
    lot_no: string;
    wingID: number;
    floorID: number;
    mall_id: number;
}

export interface mall {
    id: number;
    name: string;
    address: string;
}

export interface number_plate {
    id: number;
    number_plate: string;
}

export interface floor {
    id: number;
    floor_no: string;
    mall_id: number;
}

export interface wing {
    id: number;
    wing: string;
    mall_id: number;
}

export interface station {
    id: number;
    is_entrance: boolean;
    mall_id: number;
}