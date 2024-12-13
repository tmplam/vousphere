"use client";

import { QueryClientProvider, QueryClient, QueryCache } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
    const { toast } = useToast();
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // gcTime: 10 * 60 * 1000, // Data will be garbage collected after 10 minutes of being unused
                        gcTime: Infinity,
                    },
                },
                queryCache: new QueryCache({
                    onError: (error) => {
                        toast({
                            title: "Error",
                            description: error?.message || "Unexpected error! Please try again.",
                            variant: "destructive",
                        });
                    },
                }),
            })
    );

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default ReactQueryProvider;
