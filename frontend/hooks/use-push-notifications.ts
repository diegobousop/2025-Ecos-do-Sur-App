import { useCallback, useEffect, useRef, useState } from 'react';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import Constants from 'expo-constants';
import { Platform } from 'react-native';

export interface PushNotificationState {
    notification?: Notifications.Notification;
    expoPushToken?: string;
    error: string | null;
    permissionStatus: string | null;
    isDevice: boolean;
    projectId?: string;
    refreshPushToken: () => Promise<void>;
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: false,
        shouldShowAlert: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const usePushNotifications = (): PushNotificationState => {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId as string | undefined;

    const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
    const [notification, setNotification] = useState<Notifications.Notification | undefined>();
    const [error, setError] = useState<string | null>(null);
    const [permissionStatus, setPermissionStatus] = useState<string | null>(null);

    const notificationListener = useRef<Notifications.Subscription>(null);
    const responseListener = useRef<Notifications.Subscription>(null);

    const registerForPushNotificationsAsync = useCallback(async (): Promise<string | undefined> => {
        if (!Device.isDevice) {
            console.log('Must use physical device for Push Notifications');
            throw new Error('Debes usar un dispositivo físico para las notificaciones push');
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        setPermissionStatus(finalStatus);

        if (finalStatus !== 'granted') {
            throw new Error(`Permiso de notificaciones no concedido (status: ${finalStatus})`);
        }

        if (!projectId) {
            throw new Error('Falta projectId en app.json (extra.eas.projectId)');
        }

        const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        console.log('expoConfig.extra.eas.projectId =', projectId);

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return token;
    }, [projectId]);

    const refreshPushToken = useCallback(async () => {
        setError(null);
        try {
            const token = await registerForPushNotificationsAsync();
            setExpoPushToken(token);
        } catch (e) {
            setExpoPushToken(undefined);
            setError(e instanceof Error ? e.message : String(e));
            console.error('Error registering for push notifications:', e);
        }
    }, [registerForPushNotificationsAsync]);

    useEffect(() => {
        refreshPushToken();

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            notificationListener.current?.remove();
            responseListener.current?.remove();
        };
    }, [refreshPushToken]);

    return {
        notification,
        expoPushToken,
        error,
        permissionStatus,
        isDevice: Device.isDevice,
        projectId,
        refreshPushToken,
    };
};
