export type NavigationType = {
    href: string;
    title: string;
};

export type ErrorResponse = {
    statusCode: number;
    message: string;
    isSuccess: boolean;
    data: any;
    validationErrors: any;
};

export type SuccessResponse<T> = {
    statusCode: number;
    message: string;
    isSuccess: boolean;
    data: T;
    validationErrors: any;
};

type EntityErrorPayload = {
    message: string;
    errors: {
        field: string;
        message: string;
    }[];
};

export class HttpError extends Error {
    status: number;
    payload: {
        message: string;
        [key: string]: any;
    };
    constructor({ status, payload }: { status: number; payload: any }) {
        super("Http Error");
        this.status = status;
        this.payload = payload;
    }
}

export class EntityError extends HttpError {
    status: 422;
    payload: EntityErrorPayload;
    constructor({ status, payload }: { status: 422; payload: EntityErrorPayload }) {
        super({ status, payload });
        this.status = status;
        this.payload = payload;
    }
}
