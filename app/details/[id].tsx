import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Box, Text } from 'theme';
import { Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useMealById } from '~/hooks/useRecipes';

type DetailParams = {
  id: string;
};

export default function DetailScreen() {
  const { id } = useLocalSearchParams<DetailParams>();
  const { data: recipe, isLoading } = useMealById(id);

  if (isLoading) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" color="orange" />
      </Box>
    );
  }

  if (!recipe) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center">
        <Text variant="title">Recette non trouvée</Text>
      </Box>
    );
  }

  // Créer un tableau des ingrédients non-nuls
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}` as keyof typeof recipe];
    const measure = recipe[`strMeasure${i}` as keyof typeof recipe];
    
    if (ingredient && ingredient.trim() !== '') {
      ingredients.push(`${measure} ${ingredient}`);
    }
  }

  return (
    <>
      <Stack.Screen 
        options={{
          headerTitle: recipe.strMeal,
          headerBackTitle: '',
        }} 
      />
      <ScrollView>
        <Box flex={1}>
          <Image 
            source={{ uri: recipe.strMealThumb }} 
            style={styles.mainImage}
            resizeMode="cover"
          />

          <Box padding="ml_24">
            <Text variant="title" fontSize={24} marginTop="m_16">
              {recipe.strMeal}
            </Text>
            <Text variant="body" color="gray" marginTop="xs_4">
              {recipe.strCategory} • {recipe.strArea}
            </Text>

            <Box marginTop="l_32">
              <Text variant="title" fontSize={18}>
                Instructions
              </Text>
              <Text 
                variant="body" 
                color="gray" 
                marginTop="m_16" 
                lineHeight={20}>
                {recipe.strInstructions}
              </Text>

              <Text variant="title" fontSize={18} marginTop="l_32">
                Ingrédients
              </Text>
              <Box flexDirection="row" flexWrap="wrap" marginTop="m_16">
                {ingredients.map((ingredient, index) => (
                  <Box 
                    key={index}
                    padding="m_16" 
                    borderRadius="m_6"
                    marginRight="m_16"
                    marginBottom="m_16"
                    backgroundColor="cardBackground">
                    <Text>• {ingredient}</Text>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  mainImage: {
    width: '100%',
    height: 300,
  },
});