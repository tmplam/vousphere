// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type RoleType = {
    id: number | null;
    name: string | null;
    description: string | null;
};
export type UserType = {
    id: number | null;
    name: string | null;
    username: string | null;
    email: string | null;
    phone: string | null;
    status: boolean | null;
    role: RoleType | null;
};

export type UserStateType = Omit<UserType, "phone">;

export type BrandType = {
    id: number | null;
    brandName: string | null;
    lat: number | null;
    long: number | null;
    address: string | null;
    domain: string | null;
};

export type Customer = {
    id: string;
    name: string;
    email: string;
    image_url: string;
};

export type GameType = {
    name: string;
    type: string;
    image: string;
    allowTrading: boolean;
    guide: string;
};

export type EventGameType = {
    id: number;
    name: string;
    image: string;
    voucherCount: number;
    startTime: string;
    endTime: string;
};

export type VoucherType = {
    code: string;
    qrCode: string;
    image: string;
    value: number;
    description: string;
    expiryDate: string;
    status: boolean;
};
