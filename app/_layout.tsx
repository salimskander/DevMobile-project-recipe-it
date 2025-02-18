import { ThemeProvider } from '@shopify/restyle';
import { Stack } from 'expo-router';
import { theme } from 'theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(onboarding)" options={{ headerShown: false}} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="detail/[id]" />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
