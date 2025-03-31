import { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '~/components/Button';
import { useNotifications } from '~/hooks/useNotifications';
import { Box, Text } from 'theme';

export default function ProfileScreen() {
  const { sendNotification, checkPermissions, requestPermissions } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();

  // Function to handle sending a notification
  const handleSendNotification = async () => {
    setIsLoading(true);
    
    try {
      // Check if we have permission
      const permissionStatus = await checkPermissions();
      
      if (permissionStatus?.granted !== true) {
        // Request permissions if not granted
        const newStatus = await requestPermissions();
        
        if (newStatus?.granted !== true) {
          Alert.alert(
            'Permission Required',
            'Please enable notifications for Recipe-it in your device settings to receive updates about new recipes!',
            [{ text: 'OK' }]
          );
          setIsLoading(false);
          return;
        }
      }
      
      // Send a notification
      await sendNotification({
        title: 'New Recipe Available!',
        body: 'Check out our latest recipes and cooking inspiration just for you!',
        data: { screen: 'home' },
      });
      
      Alert.alert('Success', 'Notification sent successfully!');
    } catch (error) {
      console.error('Error sending notification:', error);
      Alert.alert('Error', 'Failed to send notification. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box flex={1} padding="ml_24" style={{ paddingTop: insets.top }}>
      <Box marginBottom="xl_64">
        <Text variant="title">Profile Screen</Text>
      </Box>
      
      <Box>
        <Text variant="body" marginBottom="ml_24">
          Notification System
        </Text>
        
        <Box marginBottom="ml_24">
          <Text variant="bodyRegular" color="gray" marginBottom="m_16">
            Press the button below to send yourself a test notification
          </Text>
          
          <Button 
            title={isLoading ? 'Sending...' : 'Send Test Notification'}
            onPress={handleSendNotification}
            disabled={isLoading}
          />
        </Box>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});