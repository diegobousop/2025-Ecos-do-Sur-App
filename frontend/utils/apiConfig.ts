// Configuración del API
export const API_CONFIG = {
    
    BASE_URL: 'https://api.ecosdosur.org',

    ENDPOINTS: {
        HEALTH: '/api/health',

        CHAT: '/api/chat',
        CALLBACK: '/api/callback',
        FEED: '/api/feed',
        SEARCH_NOTIFICATIONS: '/api/notifications/search',

        LOGIN: '/api/login',
        REGISTER: '/api/signUp',
        GET_ALL_USERS: '/api/users',
        USER_STATS: '/api/user-stats',
        GET_USER_CONVERSATIONS: '/api/conversations',
        SAVE_CHAT: '/api/chat/save',
        REQUEST_SIGNUP_CODE: '/api/signUp/request-code',
        VERIFY_SIGNUP_CODE: '/api/signUp/verify-code',
        UPDATE_USERNAME: '/api/update-username',
        CHECK_USER: '/api/check-user',
        DELETE_ACCOUNT: '/api/user',
    }
};

// Función helper para obtener la URL completa de un endpoint
export const getApiUrl = (endpoint: keyof typeof API_CONFIG.ENDPOINTS): string => {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint]}`;
};
