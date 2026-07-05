import { getApiUrl } from './apiConfig';
import { NotificationItem } from './interfaces';

export const fetchFeed = async (): Promise<NotificationItem[]> => {
    const response = await fetch(getApiUrl('FEED'));

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: unknown = await response.json();

    if (Array.isArray(data)) {
        return data as NotificationItem[];
    }

    if (data && typeof data === 'object' && Array.isArray((data as { items?: unknown }).items)) {
        return (data as { items: NotificationItem[] }).items;
    }

    return [];
};
