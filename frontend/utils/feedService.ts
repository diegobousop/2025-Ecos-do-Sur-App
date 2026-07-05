import { getApiUrl } from './apiConfig';
import { NotificationItem } from './interfaces';

const extractItems = (data: unknown): NotificationItem[] => {
    if (Array.isArray(data)) {
        return data as NotificationItem[];
    }

    if (data && typeof data === 'object' && Array.isArray((data as { items?: unknown }).items)) {
        return (data as { items: NotificationItem[] }).items;
    }

    return [];
};

export const fetchFeed = async (): Promise<NotificationItem[]> => {
    const response = await fetch(getApiUrl('FEED'));

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: unknown = await response.json();
    return extractItems(data);
};

export const searchNotifications = async (query: string): Promise<NotificationItem[]> => {
    const url = `${getApiUrl('SEARCH_NOTIFICATIONS')}?q=${encodeURIComponent(query)}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: unknown = await response.json();
    return extractItems(data);
};
