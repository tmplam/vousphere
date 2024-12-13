"use client";
import { useQuery } from "@tanstack/react-query";
import { commonOptions } from "@/lib/react-query/options";
import { UserType } from "@/schema/auth.schema";

export function useCachedUserQuery(id: string) {
    return useQuery({
        queryKey: ["user", id],
        queryFn: () => {
            return getUserById(id);
        },
        throwOnError: true,
        ...commonOptions,
    });
}

export function useCachedUserList(currentPage: number, totalPage: number = 10) {
    return useQuery({
        queryKey: ["user", currentPage, totalPage],
        queryFn: () => {
            return getUserList(currentPage, totalPage);
        },
        throwOnError: true,
        ...commonOptions,
    });
}
async function getUserById(id: string): Promise<UserType> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
        id: "UUDI-123D",
        name: "John Doe dsfsd",
        username: "johndoe",
        email: "johndoe@example.com",
        image: "",
        phone: "1234567890",
        roles: [
            {
                id: 1,
                name: "admin",
                description: "Admin",
            },
            {
                id: 1,
                name: "user",
                description: "Admin",
            },
        ],
        status: true,
    };
}

async function getUserList(currentPage: number, totalPage: number): Promise<UserType[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [
        {
            id: "UUDI-123D",
            name: "John Doe",
            username: "johndoe",
            email: "johndoe@example.com",
            image: "",
            phone: "1234567890",
            roles: [
                {
                    id: 1,
                    name: "admin",
                    description: "Admin",
                },
                {
                    id: 2,
                    name: "counterpart",
                    description: "Admin",
                },
            ],
            status: true,
        },
        {
            id: "UUDI-125D",
            name: "Jane Smith",
            username: "janesmith",
            email: "janesmith@example.com",
            image: "",
            roles: [
                {
                    id: 2,
                    name: "user",
                    description: "User",
                },
            ],
            phone: "9876543210",
            status: false,
        },
        {
            id: "UUDI-126D",
            name: "Bob Wilson",
            username: "bobwilson",
            email: "bobwilson@example.com",
            image: "",
            roles: [
                {
                    id: 3,
                    name: "counterpart",
                    description: "Counterpart",
                },
            ],

            phone: "5555555555",
            status: true,
        },
    ];
}
