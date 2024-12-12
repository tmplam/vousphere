import { toast } from "@/hooks/use-toast";
import { EntityError, ErrorResponse } from "@/schema/http.schema";
import { clsx, type ClassValue } from "clsx";
import { Params } from "next/dist/server/request/params";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const defaultAvatar = "https://wutheringlab.com/wp-content/uploads/Shorekeeper-icon.webp";
export const isClient = () => typeof window !== "undefined";

export const handleErrorApi = ({
    error,
    setError,
    duration,
}: {
    error: any;
    setError?: UseFormSetError<any>;
    duration?: number;
}) => {
    if (error instanceof EntityError && setError) {
        error.payload.errors.forEach((item) => {
            setError(item.field, {
                type: "server",
                message: item.message,
            });
        });
    } else {
        toast({
            title: "Error",
            description: error?.payload?.message || "Unexpected error! Please try again.",
            variant: "destructive",
            duration: duration || 2000,
        });
    }
};

export const handleErrorForm = ({ error, setError }: { error: EntityError; setError: UseFormSetError<any> }) => {
    error.payload.errors.forEach((item) => {
        setError(item.field, {
            type: "server",
            message: item.message,
        });
    });
};

/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
    return path.startsWith("/") ? path.slice(1) : path;
};

export function getQueryParams<T>(params: Params, key: string): T {
    const value = params[key];
    if (!value) throw new Error(`"${key}" not found`);
    return typeof value === "string" ? (value as T) : (value[0] as T);
}
