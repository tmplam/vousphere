import { keepPreviousData } from "@tanstack/react-query";

export const commonOptions = {
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    staleTime: 10000, // Data will be fresh for 5 seconds
    retry: 2, // Retry 2 times before displaying an error
    retryDelay: 1000, // Wait 1 second between retries
    placeholderData: keepPreviousData,
    manual: true,
};
