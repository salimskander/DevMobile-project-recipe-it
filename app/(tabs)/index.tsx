import { useEffect } from 'react';
import { Redirect, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const isOnboarded = await AsyncStorage.getItem('is_onboarded');
      if (!isOnboarded) {
        return <Redirect href="/(onboarding)" />;
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return <Redirect href="/(onboarding)" />;
    }
  };

  return null;
}
