import { SubscriptionType } from "@/schema/event.schema";

export async function getMySubscription(): Promise<SubscriptionType> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    return {
        id: "UUDI-123D",
        name: "The Lunar New Year 2024 Buy One Get One Free Event only in Ho Chi Minh City",
        address: "123 Main Street, Anytown, USA",
        area: "Food",
        location: [10.7628, 106.6825],
        status: true,
    };
}
