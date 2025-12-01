import { getApiUrl } from './apiConfig';
import { Message, Role } from './interfaces';

export interface ChatRequest {
    message: string;
    user_id: string;
    type: 'urgent' | 'info' | 'text';
}

export interface ChatResponse {
    response: {
        text: string;
        options: { text: string; callback_data: string }[][];
    };
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

            const data: ChatResponse = await response.json();

            // Convertir la respuesta del backend al formato de Message
            return {
                role: Role.Bot,
                content: data.response.text,
                options: data.response.options
            };
        } catch (error) {
            console.error('Error sending message to chatbot:', error);
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
}

export default new ChatbotService();
