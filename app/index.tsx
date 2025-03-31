import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const onboardingStatus = await AsyncStorage.getItem('is_onboarded');
        setIsOnboarded(onboardingStatus === 'true');
      } catch (error) {
        console.error('Error reading onboarding status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  // Afficher un écran de chargement pendant la vérification
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#EC994B" />
      </View>
    );
  }

  // Rediriger selon le statut d'onboarding
  return isOnboarded ? <Redirect href="/(tabs)" /> : <Redirect href="/onboarding" />;
}
