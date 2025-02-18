import { Redirect } from 'expo-router';
import { useState } from 'react';

export default function Index() {
  const [isOnboarded, setIsOnboarded] = useState(false);

  return isOnboarded ? <Redirect href="/(tabs)" /> : <Redirect href="/onboarding" />;
}
