import { Feather, AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, TouchableOpacity } from 'react-native';
import { Box, Text } from 'theme';

import { Recipe } from '~/types/recipe';

type RecipeCardProps = {
  recipe: Recipe;
  vertical?: boolean; // Add vertical prop for different layout
};

export const RecipeCard = ({ recipe, vertical = false }: RecipeCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handlePress = () => {
    router.push(`/details/${recipe.idMeal}`);
  };

  // Vertical layout for search page
  if (vertical) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
        <Box
          width="100%"
          height={120}
          backgroundColor="cardBackground"
          borderRadius="l_12"
          borderWidth={2}
          borderColor="border"
          elevation={5}
          flexDirection="row">
          <Image
            source={{ uri: recipe.strMealThumb }}
            style={{
              width: 120,
              height: '100%',
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
            }}
          />
          <Box flex={1} padding="m_16" justifyContent="space-between">
            <Box>
              <Text variant="body" color="black" numberOfLines={1}>
                {recipe.strMeal}
              </Text>
              <Text variant="subtitle" color="gray">
                {recipe.strCategory}
              </Text>
            </Box>
            <Box flexDirection="row" justifyContent="space-between" alignItems="center">
              <Text variant="section" color="black">
                {recipe.price} €
              </Text>
              <Pressable
                onPress={() => setIsFavorite(!isFavorite)}
                style={{
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  borderRadius: 16,
                  padding: 6,
                }}>
                {isFavorite ? (
                  <AntDesign name="heart" size={16} color="orange" />
                ) : (
                  <Feather name="heart" size={16} color="orange" />
                )}
              </Pressable>
            </Box>
          </Box>
        </Box>
      </TouchableOpacity>
    );
  }

  // Default horizontal layout (original)
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
      <Box
        width={190}
        height={250}
        marginRight="xs_4"
        backgroundColor="cardBackground"
        borderRadius="l_12"
        borderWidth={2}
        borderColor="border"
        elevation={5}>
        <Box position="relative">
          <Image
            source={{ uri: recipe.strMealThumb }}
            style={{
              width: '100%',
              height: 150,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          />
          <Pressable
            onPress={() => setIsFavorite(!isFavorite)}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: 3,
              padding: 3,
            }}>
            {isFavorite ? (
              <AntDesign name="heart" size={14} color="white" />
            ) : (
              <Feather name="heart" size={14} color="white" />
            )}
          </Pressable>
        </Box>
        <Box paddingHorizontal="m_16" paddingTop="s_8" paddingBottom="m_16">
          <Text variant="body" color="black" numberOfLines={1}>
            {recipe.strMeal}
          </Text>
          <Text variant="subtitle" color="gray" marginBottom="sm_12">
            {recipe.strCategory}
          </Text>
          <Text variant="section" color="black">
            {recipe.price} €
          </Text>
        </Box>
        <Pressable
          style={{
            position: 'absolute',
            bottom: 19,
            right: 19,
            backgroundColor: 'orange',
            width: 32,
            height: 32,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text color="white" style={{ fontSize: 20, lineHeight: 20 }}>
            +
          </Text>
        </Pressable>
      </Box>
    </TouchableOpacity>
  );
};
