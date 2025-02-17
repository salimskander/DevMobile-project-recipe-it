import React from 'react';
import { Stack, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button } from '~/components/Button';

import { ScreenContent } from '~/components/ScreenContent';

export default function TabTwo() {
  const handleNavigateToDetail = () => {
    router.push({
      pathname: '/detail',
      params: {
        title: 'Special Pizza',
        description: 'Meat lovers is filled with toppings of sliced beef sausage, minced beef, beef burger, and chicken sausage. In one bite, you can taste a variety of processed meat that are many and dense. Especially the minced meat which still has fiber in it.',
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
        rating: '4.3',
        reviews: '980',
        ingredients: ['Pepperoni', 'Oregano']
      }
    });
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Tab Two' }} />
      <View style={styles.container}>
        <ScreenContent path="app/(tabs)/two.tsx" title="Tab Two">
          <Button 
            title="Voir le détail" 
            onPress={handleNavigateToDetail}
            style={{ marginTop: 20 }}
          />
        </ScreenContent>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
