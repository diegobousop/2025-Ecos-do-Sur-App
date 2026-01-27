// Configuración del API
export const API_CONFIG = {
    
    BASE_URL: 'http://192.168.1.134:4000',

    ENDPOINTS: {
        CHAT: '/api/chat',
        CALLBACK: '/api/callback',
        HEALTH: '/api/health',
        LOGIN: '/api/login',
        REGISTER: '/api/signUp',
        REQUEST_SIGNUP_CODE: '/api/signUp/request-code',
        VERIFY_SIGNUP_CODE: '/api/signUp/verify-code',
        UPDATE_USERNAME: '/api/update-username',
        CHECK_USER: '/api/check-user',
    }
};

// Función helper para obtener la URL completa de un endpoint
export const getApiUrl = (endpoint: keyof typeof API_CONFIG.ENDPOINTS): string => {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint]}`;
};
