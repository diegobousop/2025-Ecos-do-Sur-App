// Configuración del API
export const API_CONFIG = {
    
    BASE_URL: 'http://192.168.1.132:4000',

    ENDPOINTS: {
        CHAT: '/api/chat',
        CALLBACK: '/api/callback',
        HEALTH: '/api/health',
        LOGIN: '/api/login',
        REGISTER: '/api/signUp',
        UPDATE_USERNAME: '/api/update-username',
    }
};

// Función helper para obtener la URL completa de un endpoint
export const getApiUrl = (endpoint: keyof typeof API_CONFIG.ENDPOINTS): string => {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint]}`;
};
