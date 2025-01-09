// export type UserType = {
//     id: number | null;
//     name: string | null;
//     username: string | null;
//     email: string | null;
//     phone: string | null;
//     status: boolean | null;
//     role: RoleType | null;
// };

// export type UserStateType = Omit<UserType, "phone">;

export type BrandType = {
    id: number | null;
    brandName: string | null;
    lat: number | null;
    long: number | null;
    address: string | null;
    domain: string | null;
};

// export type Customer = {
//     id: string;
//     name: string;
//     email: string;
//     image_url: string;
// };

// export type GameType = {
//     name: string;
//     type: string;
//     image: string;
//     allowTrading: boolean;
//     guide: string;
// };

// export type EventGameType = {
//     id: number;
//     name: string;
//     image: string;
//     voucherCount: number;
//     startTime: string;
//     endTime: string;
// };

// export type VoucherType = {
//     code: string;
//     qrCode: string;
//     image: string;
//     value: number;
//     description: string;
//     expiryDate: string;
//     status: boolean;
// };

export type ImageType = {
    imageId: string;
};

export type PaginationType<T> = {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    data: T[];
};
