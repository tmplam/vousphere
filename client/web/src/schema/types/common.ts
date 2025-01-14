export type BrandType = {
    id: number | null;
    brandName: string | null;
    lat: number | null;
    long: number | null;
    address: string | null;
    domain: string | null;
};

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

export type PaginationV2Type<T> = {
    page: number;
    perPage: number;
    total: number;
    totalPage: number;
    data: T[];
};
