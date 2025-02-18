import { AntDesign } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Box, Text } from 'theme';

import { HeaderDetails } from '~/components/HeaderDetails';
import { useMealById } from '~/hooks/useRecipes';

type DetailParams = {
  id: string;
};

export default function DetailScreen() {
  const { id } = useLocalSearchParams<DetailParams>();
  const { data: recipe, isLoading } = useMealById(id);
  const [quantity, setQuantity] = useState(1);
  const insets = useSafeAreaInsets();

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

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Box flex={1} style={{ paddingTop: insets.top }}>
        <HeaderDetails />
        <ScrollView>
          <Box flex={1}>
            <Image
              source={{ uri: recipe.strMealThumb }}
              style={styles.mainImage}
              resizeMode="cover"
            />
            <Box paddingHorizontal="ml_24">
              {/* Container principal titre et sélecteur */}
              <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                <Box flex={1}>
                  <Text variant="title" fontSize={24} marginTop="m_16">
                    {recipe.strMeal}
                  </Text>
                  <Text variant="bodyRegular" color="gray">
                    {recipe.strCategory} • {recipe.strArea}
                  </Text>
                  <Text variant="title" color="orange" marginTop="s_8" fontSize={20}>
                    {(Number(recipe.price) * quantity).toFixed(2)} €
                  </Text>
                </Box>
                <Box
                  flexDirection="row"
                  alignItems="center"
                  backgroundColor="orange"
                  shadowColor="orange"
                  shadowOffset={{
                    width: 0,
                    height: 4,
                  }}
                  shadowOpacity={0.8}
                  borderRadius="round"
                  padding="xs_4"
                  width={80} // Ajout d'une largeur fixe
                  justifyContent="space-between">
                  <TouchableOpacity onPress={handleDecrement}>
                    <Box width={20} alignItems="center">
                      <Text color="white" fontSize={20}>-</Text>
                    </Box>
                  </TouchableOpacity>
                  <Box width={20} alignItems="center">
                    <Text color="white" fontSize={18}>{quantity}</Text>
                  </Box>
                  <TouchableOpacity onPress={handleIncrement}>
                    <Box width={20} alignItems="center">
                      <Text color="white" fontSize={20}>+</Text>
                    </Box>
                  </TouchableOpacity>
                </Box>
              </Box>

              {/* Container ratings et comments */}
              <Box
                flexDirection="row"
                justifyContent="space-between"
                marginTop="ml_24"
                marginBottom="l_32">
                <Box flexDirection="row" alignItems="center">
                  <AntDesign name="star" size={24} color="#FFD700" />
                  <Text marginLeft="xs_4" variant="bodyRegular" color="black">
                    {recipe.rating} Ratings
                  </Text>
                </Box>
                <Box flexDirection="row" alignItems="center">
                  <AntDesign name="message1" size={24} color="gray" />
                  <Text marginLeft="xs_4" variant="bodyRegular" color="black">
                    {recipe.comments} Comments
                  </Text>
                </Box>
              </Box>

              {/* Reste du contenu */}
              <Box>
                <Text variant="title" fontSize={18} color="black">
                  Detail & Ingredient
                </Text>
                <Text variant="bodyRegular" color="black" marginTop="m_16" lineHeight={20}>
                  {recipe.strInstructions}
                </Text>
                <Box flexDirection="row" flexWrap="wrap" marginTop="ml_24">
                  {ingredients.map((ingredient, index) => (
                    <Box key={index} padding="sm_12" borderRadius="m_6" marginBottom="s_8">
                      <Text color="black">• {ingredient}</Text>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </ScrollView>
      </Box>
    </>
  );
}

const styles = StyleSheet.create({
  mainImage: {
    width: '100%',
    height: 300,
    borderRadius: 20,
    paddingHorizontal: 25,
  },
});
