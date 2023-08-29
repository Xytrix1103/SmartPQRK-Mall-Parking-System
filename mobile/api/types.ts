export interface user {
    id: number;
    name: string;
    email: string;
    password: string;
    username: string;
    contact: string;
    address: string;
    number_plate: number_plate[];
    parking_log: parking_log[];
    reservations: reservation[];
}

export interface directory {
    id: number;
    name: string;
    lot_no: number;
    wing_id: number;
    floor_id: number;
    mall_id: number;
}

export interface mall {
    id: number;
    name: string;
    address: string;
    vacant: number;
    total: number;
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

export interface lot {
    id: number;
    lot_no: number;
    section: string;
    floor: floor;
    wing: wing;
}

export interface parking_log {
    id: number;
    number_plate: number_plate;
    directory: directory;
    lot: lot;
    entry_station: station,
    exit_station: station,
    entry_datetime: string;
    exit_datetime: string;
    reservation_id: number;
    paid: boolean;
    fees: number;
}

export interface reservation {
    id: number;
    number_plate: number_plate;
    directory: directory;
    lot: lot;
    reservation_datetime: string;
    is_cancelled: boolean;
    is_expired: boolean;
    is_fulfilled: boolean;
}