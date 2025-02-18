import { ThemeProvider } from '@shopify/restyle';
import { Stack } from 'expo-router';
import { theme } from 'theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { Animated, Dimensions } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

const queryClient = new QueryClient();
const { width } = Dimensions.get('window');

// Maintenir le splash screen visible pendant le chargement
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [loaded] = useFonts({
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
  });

  const fadeAnim = new Animated.Value(1);
  const scaleAnim = new Animated.Value(1);
  const { height, width } = Dimensions.get('window');

  useEffect(() => {
    async function prepare() {
      try {
        // Préchargement des ressources nécessaires ici
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady && loaded) {
      // On attend un petit délai avant de commencer l'animation
      // pour s'assurer que notre Vue animée est bien en place
      const timeout = setTimeout(async () => {
        await SplashScreen.hideAsync();
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.5,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start();
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [appIsReady, loaded]);

  if (!appIsReady || !loaded) {
    return null;
  }

  return (
    <>
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#EC994B',
          opacity: fadeAnim,
          zIndex: 999,
        }}
      >
        <Animated.Image
          source={require('../assets/icon.png')}
          style={{
            position: 'absolute',
            width: width * 0.6,
            height: width * 0.6,
            top: '50%',
            left: '50%',
            marginLeft: -(width * 0.6) / 2,
            marginTop: -(width * 0.6) / 2,
            transform: [{ scale: scaleAnim }],
          }}
          resizeMode="contain"
        />
      </Animated.View>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <Stack />
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}
