// Configuración del API
// Para desarrollo local con emulador Android: usa 10.0.2.2
// Para desarrollo local con emulador iOS: usa localhost
// Para dispositivo físico: usa la IP de tu máquina (ej: 192.168.1.100)

export const API_CONFIG = {
    // Cambia esto según tu entorno:
    // - Emulador Android: 'http://10.0.2.2:4000'
    // - Emulador iOS: 'http://localhost:4000'
    // - Dispositivo físico: 'http://TU_IP_LOCAL:4000' (ej: 'http://192.168.1.100:4000')
    BASE_URL: 'http://192.168.1.132:4000',

    ENDPOINTS: {
        CHAT: '/chat',
        HEALTH: '/health'
    }
};

// Función helper para obtener la URL completa de un endpoint
export const getApiUrl = (endpoint: keyof typeof API_CONFIG.ENDPOINTS): string => {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint]}`;
};
