import * as SecureStore from 'expo-secure-store';
import { getApiUrl } from './apiConfig';

export interface ChatRequest {
    message: string;
    user_id: string;
    type: 'urgent' | 'info' | 'text';
    language_code: string;
}

export interface CallbackRequest {
    data: string;
    user_id: string;
    language_code: string;
}

export interface ChatResponse {
    text: string;
    options: { text: string; callback_data: string }[][];
}


class UserService {

    async login (userName: string, password: string) {
        try{
            const response = await fetch (getApiUrl('LOGIN'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userName, password}),
            });
            return response.json();

        }catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    }

    async getAllUsers(page: number = 1, limit: number = 5, userId?: string, search?: string) {
        try {
            const userIdParam = userId ? `&userId=${encodeURIComponent(userId)}` : '';
            const searchParam = search && search.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
            const response = await fetch(getApiUrl('GET_ALL_USERS') + `?page=${page}&limit=${limit}${userIdParam}${searchParam}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.json();
        }
        catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    async getUserStats(userId: string, timeRange: string = '7days') {
        try {
            const response = await fetch(getApiUrl('USER_STATS') + `?userId=${encodeURIComponent(userId)}&timeRange=${timeRange}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.json();
        }
        catch (error) {
            console.error('Error fetching user stats:', error);
            throw error;
        }
    }

    async getUserConversations(userId: string, page: number = 1, limit: number = 20, includeMessages: boolean = false) {
        try {
            const messagesParam = includeMessages ? '&include_messages=true' : '';
            const response = await fetch(
                `${getApiUrl('GET_USER_CONVERSATIONS')}/${userId}?page=${page}&limit=${limit}${messagesParam}`, 
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.json();
        }
        catch (error) {
            console.error('Error fetching conversations:', error);
            throw error;
        }
    }

    async saveChat(chatId: number, category: string, token: string) {
        try {
            if (await SecureStore.getItemAsync('settings.saveDataToEcos') === 'false') {return;}
            const response = await fetch(getApiUrl('SAVE_CHAT'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ chatId, category }),
            });
            
            if (!response.ok) {
                const text = await response.text();
                console.error('Server response:', response.status, text);
                throw new Error(`Server error: ${response.status}`);
            }
            return response.json();
        }
        catch (error) {
            console.error('Error saving chat:', error);
            throw error;
        }
    }
}

export default new UserService();