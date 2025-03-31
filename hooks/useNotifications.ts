import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Audio } from 'expo-av';
import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';

// Configure how notifications should appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationProps {
  title: string;
  body: string;
  data?: any;
}

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const [sound, setSound] = useState<Audio.Sound>();
  const [permissionStatus, setPermissionStatus] = useState<Notifications.NotificationPermissionsStatus | null>(null);

  // Load and play GTA V notification sound
  async function playNotificationSound() {
    try {
      // Unload any existing sound
      if (sound) {
        await sound.unloadAsync();
      }
      
      // Load the GTA V notification sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('~/assets/sounds/GTA V Notification.mp3')
      );
      
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  }

  useEffect(() => {
    // Register for push notifications
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });

    // Set up notification listeners
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
      // Play GTA V sound when notification is received
      playNotificationSound();
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification response:', response);
      // Handle notification response (e.g., navigate to a screen)
    });

    // Clean up listeners and sound
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Send a notification
  const sendNotification = async ({ title, body, data = {} }: NotificationProps) => {
    // Play notification sound
    playNotificationSound();
    
    // Schedule the notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: false, // Enable sound for the notification
      },
      trigger: null, // Immediate notification
    });
  };

  // Check if permissions are granted
  const checkPermissions = async () => {
    const status = await Notifications.getPermissionsAsync();
    setPermissionStatus(status);
    return status;
  };

  // Request permissions if not granted
  const requestPermissions = async () => {
    const status = await Notifications.requestPermissionsAsync();
    setPermissionStatus(status);
    return status;
  };

  return {
    expoPushToken,
    notification,
    sendNotification,
    checkPermissions,
    requestPermissions,
    permissionStatus,
  };
};

// Helper function to register for push notifications
async function registerForPushNotificationsAsync() {
  let token;
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF9F0A',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return undefined;
    }
    
    try {
      // For Expo Go app
      if (Constants.executionEnvironment === 'standalone') {
        // Production app
        token = (await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId,
        })).data;
      } else {
        // Expo Go
        token = (await Notifications.getExpoPushTokenAsync()).data;
      }
      console.log('Push token:', token);
    } catch (error) {
      console.log('Error getting push token:', error);
    }
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}