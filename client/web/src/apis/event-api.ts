import { SubscriptionType } from "@/schema/event.schema";

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
