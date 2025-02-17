import { Stack } from 'expo-router';
import { MainPageScreen } from '~/screens/mainPageScreen';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MainPageScreen />
    </>
  );
}
