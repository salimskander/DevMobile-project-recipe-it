import React from 'react';
import { OnboardingScreen } from '~/screens/onboardingScreen';
import { Stack } from 'expo-router';

export default function Onboarding() {
  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
          gestureEnabled: false,
        }} 
      />
      <OnboardingScreen />
    </>
  );
}
