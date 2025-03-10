import { Stack } from 'expo-router';
import React from 'react';

import { OnboardingScreen } from '~/screens/onboardingScreen';

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
