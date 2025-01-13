/* Khiem workspace - Define notification types */
export type NotificationListType = {
    data: Notification[];
    total: number;
    totalPage: number;
    page: number;
    perPage: number;
};
export type Notification = {
    id: string;
    userId: string;
    notificationType: string;
    title: string;
    message: string;
    data: any;
    createdAt: string;
    isSeen: boolean;
};
export type BranchRegisteredData = {
    brandId: string;
    brandName: string;
};
export type BrandEventCreatedData = {
    eventId: string;
    eventName: string;
    brandId: string;
    brandName: string;
};
export type EventApprovedData = {
    brandId: string;
    eventId: string;
    eventName: string;
};