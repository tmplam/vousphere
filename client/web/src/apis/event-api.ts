import { EventGameType, SubscriptionType } from "@/schema/event.schema";

export async function getMySubscription(): Promise<SubscriptionType | null> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const randomNumber = Math.floor(Math.random() * 1000);
    // return null;
    return {
        id: "UUDI-123D",
        name: "The Lunar New Year 2024 Buy One Get One Free Event only in Ho Chi Minh City",
        address: "123 Main Street, Anytown, USA - " + randomNumber,
        area: {
            id: "2",
            name: "Drink",
        },
        location: [10.7628, 106.6825],
        status: true,
    };
}

export async function getAllMyEvents(page: number, perPage: number): Promise<EventGameType[] | null> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const randomNumber = Math.floor(Math.random() * 1000);
    // return null;
    return [
        {
            id: 1,
            name: "New Year 2024",
            image: "https://c8.alamy.com/comp/2JB7FMY/coupon-mockup-with-50-percent-off-discount-voucher-gift-coupon-coupon-promotion-sale-vector-2JB7FMY.jpg",
            vouchers: [
                {
                    amount: 10,
                    voucher: {
                        code: "UUDI-123D",
                        qrCode: "https://c8.alamy.com/comp/2JB7FMY/coupon-mockup-with-50-percent-off-discount-voucher-gift-coupon-coupon-promotion-sale-vector-2JB7FMY.jpg",
                        image: "https://c8.alamy.com/comp/2JB7FMY/coupon-mockup-with-50-percent-off-discount-voucher-gift-coupon-coupon-promotion-sale-vector-2JB7FMY.jpg",
                        value: 10,
                        description: "Free 10% off on all products",
                        expiryDate: "2024-12-01T10:00:00Z",
                        status: true,
                    },
                },
                {
                    amount: 14,
                    voucher: {
                        code: "UUDI-125D",
                        qrCode: "https://c8.alamy.com/comp/2JB7FMY/coupon-mockup-with-50-percent-off-discount-voucher-gift-coupon-coupon-promotion-sale-vector-2JB7FMY.jpg",
                        image: "https://c8.alamy.com/comp/2JB7FMY/coupon-mockup-with-50-percent-off-discount-voucher-gift-coupon-coupon-promotion-sale-vector-2JB7FMY.jpg",
                        value: 14,
                        description: "Free 14% off on all products",
                        expiryDate: "2024-12-01T10:00:00Z",
                        status: true,
                    },
                },
            ],
            startTime: "2024-12-01T10:00:00Z",
            endTime: "2024-12-01T12:00:00Z",
            games: [],
        },
        {
            id: 2,
            name: "A thank giving party 2024 with best wishes to all",
            image: "https://c8.alamy.com/comp/2JB7FMY/coupon-mockup-with-50-percent-off-discount-voucher-gift-coupon-coupon-promotion-sale-vector-2JB7FMY.jpg",
            vouchers: [
                {
                    amount: 10,
                    voucher: {
                        code: "UUDI-123D",
                        qrCode: "https://c8.alamy.com/comp/2JB7FMY/coupon-mockup-with-50-percent-off-discount-voucher-gift-coupon-coupon-promotion-sale-vector-2JB7FMY.jpg",
                        image: "https://c8.alamy.com/comp/2JB7FMY/coupon-mockup-with-50-percent-off-discount-voucher-gift-coupon-coupon-promotion-sale-vector-2JB7FMY.jpg",
                        value: 10,
                        description: "Free 10% off on all products",
                        expiryDate: "2024-12-01T10:00:00Z",
                        status: true,
                    },
                },
            ],
            startTime: "2024-12-02T14:00:00Z",
            endTime: "2024-12-02T16:00:00Z",
            games: [],
        },
    ];
}

export async function getEventDetail(id: number): Promise<EventGameType | null> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // return null;
    return {
        id: 1,
        name: "New Year 2024",
        image: "https://c8.alamy.com/comp/2JB7FMY/coupon-mockup-with-50-percent-off-discount-voucher-gift-coupon-coupon-promotion-sale-vector-2JB7FMY.jpg",
        vouchers: [
            {
                amount: 10,
                voucher: {
                    code: "UUDI-123D",
                    qrCode: "https://c8.alamy.com/comp/2JB7FMY/coupon-mockup-with-50-percent-off-discount-voucher-gift-coupon-coupon-promotion-sale-vector-2JB7FMY.jpg",
                    image: "https://c8.alamy.com/comp/2JB7FMY/coupon-mockup-with-50-percent-off-discount-voucher-gift-coupon-coupon-promotion-sale-vector-2JB7FMY.jpg",
                    value: 10,
                    description: "Free 10% off on all products",
                    expiryDate: "2024-12-01T10:00:00Z",
                    status: true,
                },
            },
            {
                amount: 14,
                voucher: {
                    code: "UUDI-125D",
                    qrCode: "https://c8.alamy.com/comp/2JB7FMY/coupon-mockup-with-50-percent-off-discount-voucher-gift-coupon-coupon-promotion-sale-vector-2JB7FMY.jpg",
                    image: "https://c8.alamy.com/comp/2JB7FMY/coupon-mockup-with-50-percent-off-discount-voucher-gift-coupon-coupon-promotion-sale-vector-2JB7FMY.jpg",
                    value: 14,
                    description: "Free 14% off on all products",
                    expiryDate: "2024-12-01T10:00:00Z",
                    status: true,
                },
            },
        ],
        startTime: "2024-12-01T10:00:00Z",
        endTime: "2024-12-01T12:00:00Z",
        games: [
            {
                id: "HDFS-sdfd",
                name: "HQ Trivia Game",
                type: "Quiz",
                image: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQHTS5qluf5pGj6LUlIkPUXGK0ez0V0p67SCr-sZOnWVsLF4LwiqPbz4-qqVrMQygAuJWFE_Ima1aIE1Xn3MRHAihHqAIBx1JkZusra7dFGig",
                allowTrading: true,
                guide: "User will have to answer the questions and win the game if they get it right.",
            },
            {
                id: "HDFS-2323",
                name: "Shake your phone",
                type: "collect",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCSjazoiTIpiz00YLORty3X6_r9XzbgaIOaw&s",
                allowTrading: false,
                guide: "Shake your phone to randomly receive rewards or combine items to exchange for rewards.",
            },
        ],
    };
}
