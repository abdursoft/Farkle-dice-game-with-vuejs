import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

let echoInstance = null;

export function getEcho(token) {
    if (!echoInstance) {
        echoInstance = new Echo({
            broadcaster: 'pusher',
            key: import.meta.env.VITE_PUSHER_APP_KEY,
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
            forceTLS: false,
            authEndpoint: 'http://localhost:8000/api/broadcasting/auth',
            auth: {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        });

        // Optional connection logging
        echoInstance.connector.pusher.connection.bind('connected', () => {
            console.log('Connected to Pusher server');
        });

        echoInstance.connector.pusher.connection.bind('error', (err) => {
            console.error('Pusher connection error:', err);
        });
    }

    return echoInstance;
}
