import { useEffect, useRef, useState } from 'react';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import Constants from 'expo-constants';
import { Platform } from 'react-native';

export interface PushNotificationState{
    notification?: Notifications.Notification;
    expoPushToken?: Notifications.ExpoPushToken;
}

export const usePushNotifications = () : PushNotificationState => {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: false,
            shouldShowAlert: true,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    });
    const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken | undefined>();
    
    const [notification, setNotification] = useState<Notifications.Notification | undefined>();

    const notificationListener = useRef<Notifications.Subscription>(null);
    const responseListener = useRef<Notifications.Subscription>(null);

    async function registerForPushNotificationsAsync(): Promise<Notifications.ExpoPushToken | undefined> {
        let token;

        if (Device.isDevice) {
            const {status: existingStatus} = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const {status} = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }

            token = (await Notifications.getExpoPushTokenAsync({
                projectId: Constants.expoConfig?.extra?.eas?.projectId,
            })).data;

            if(Platform.OS === 'android'){
                Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }
            return token;
        }else{
            console.log('Must use physical device for Push Notifications');
        }
    }

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

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
    }, []);

    return {
        notification,
        expoPushToken
    };


};