import { getApiUrl } from './apiConfig';
import { Message, Role } from './interfaces';

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

class ChatbotService {
    /**
     * Envía un mensaje al chatbot y recibe una respuesta
     */
    async sendMessage(request: ChatRequest): Promise<Message> {
        try {
            const response = await fetch(getApiUrl('CHAT'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: any = await response.json();

            // Normalizar la respuesta si viene como string plano
            let content = '';
            let options: any[] = [];

            if (typeof data === 'string') {
                content = data;
            } else if (data && typeof data === 'object') {
                content = data.text || '';
                options = data.options || [];
            }

            // Convertir la respuesta del backend al formato de Message
            return {
                id: Date.now().toString(),
                role: Role.Bot,
                content: content,
                options: options
            };
        } catch (error) {
            console.error('Error sending message to chatbot:', error);
            throw error;
        }
    }

    /**
     * Envía un callback al chatbot (para botones)
     */
    async sendCallback(request: CallbackRequest): Promise<Message> {
        try {
            const response = await fetch(getApiUrl('CALLBACK'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: any = await response.json();

            // Normalizar la respuesta si viene como string plano
            let content = '';
            let options: any[] = [];

            if (typeof data === 'string') {
                content = data;
            } else if (data && typeof data === 'object') {
                content = data.text || '';
                options = data.options || [];
            }

            return {
                id: Date.now().toString(),
                role: Role.Bot,
                content: content,
                options: options
            };
        } catch (error) {
            console.error('Error sending callback to chatbot:', error);
            throw error;
        }
    }

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

    async register(userName: string, email: string, password: string, language: string, gender: string) {
        try{
            const response = await fetch (getApiUrl('REGISTER'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userName, email, password, language, gender, role: 'user'}),
            });
            return response.json();

        }catch (error) {
            console.error('Error signing up:', error);
            throw error;
        }
    }

    /**
     * Verifica si el servidor está disponible
     */
    async checkHealth(): Promise<boolean> {
        try {
            const response = await fetch(getApiUrl('HEALTH'));
            return response.ok;
        } catch (error) {
            console.error('Health check failed:', error);
            return false;
        }
    }

    async updateUsername(userId: string, newUsername: string): Promise<boolean> {
        try {
            const response = await fetch(getApiUrl('UPDATE_USERNAME'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, newUsername }),
            });
            return response.ok;
        } catch (error) {
            console.error('Error updating username:', error);
            return false;
        }
    }
}

export default new ChatbotService();
