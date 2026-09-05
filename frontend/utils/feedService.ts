import { getApiUrl } from './apiConfig';
import { NotificationItem } from './interfaces';

// Tamaño de página por defecto para el scroll infinito del feed.
export const FEED_PAGE_SIZE = 20;

export interface FeedPage {
    items: NotificationItem[];
    // true si el backend indica que quedan más elementos por cargar.
    hasMore: boolean;
    // offset a usar para pedir la siguiente página.
    nextOffset: number;
}

// Normaliza la respuesta del backend (que puede ser un array plano o un objeto
// paginado {items, has_more, offset}) a nuestra forma FeedPage.
const extractPage = (data: unknown, requestOffset: number, limit: number): FeedPage => {
    if (Array.isArray(data)) {
        const items = data as NotificationItem[];
        return {
            items,
            hasMore: items.length >= limit,
            nextOffset: requestOffset + items.length,
        };
    }

    if (data && typeof data === 'object') {
        const obj = data as { items?: unknown; has_more?: unknown; offset?: unknown };
        const items = Array.isArray(obj.items) ? (obj.items as NotificationItem[]) : [];
        const baseOffset = typeof obj.offset === 'number' ? obj.offset : requestOffset;
        const hasMore = typeof obj.has_more === 'boolean' ? obj.has_more : items.length >= limit;

        return {
            items,
            hasMore,
            nextOffset: baseOffset + items.length,
        };
    }

    return { items: [], hasMore: false, nextOffset: requestOffset };
};

export const fetchFeed = async (
    limit: number = FEED_PAGE_SIZE,
    offset: number = 0,
): Promise<FeedPage> => {
    const url = `${getApiUrl('FEED')}?limit=${limit}&offset=${offset}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: unknown = await response.json();
    return extractPage(data, offset, limit);
};

export const deleteNotification = async (id: string, token: string): Promise<void> => {
    const url = `${getApiUrl('FEED')}/${encodeURIComponent(id)}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
};

export const searchNotifications = async (
    query: string,
    limit: number = FEED_PAGE_SIZE,
    offset: number = 0,
): Promise<FeedPage> => {
    const url = `${getApiUrl('SEARCH_NOTIFICATIONS')}?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: unknown = await response.json();
    return extractPage(data, offset, limit);
};
