import { Feather, AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, TouchableOpacity } from 'react-native';
import { Box, Text } from 'theme';

import { Recipe } from '~/types/recipe';

type RecipeCardProps = {
  recipe: Recipe;
};

/**
 * Card component to display a recipe with error handling for missing data
 */
export const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Check if recipe is valid
  if (!recipe || !recipe.idMeal) {
    return (
      <Box
        width={190}
        height={250}
        marginRight="xs_4"
        backgroundColor="cardBackground"
        borderRadius="l_12"
        borderWidth={2}
        borderColor="border"
        elevation={5}
        justifyContent="center"
        alignItems="center"
        padding="m_16">
        <Text variant="body" color="gray" textAlign="center">
          Recipe unavailable
        </Text>
      </Box>
    );
  }

  const handlePress = () => {
    router.push(`/details/${recipe.idMeal}`);
  };

  const handleImageError = () => {
    setImageError(true);
  };

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
            source={{ 
              uri: imageError 
                ? 'https://via.placeholder.com/400x300?text=No+Image' 
                : recipe.strMealThumb 
            }}
            style={{
              width: '100%',
              height: 150,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
            onError={handleImageError}
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
            {recipe.strMeal || 'Unnamed Recipe'}
          </Text>
          <Text variant="subtitle" color="gray" marginBottom="sm_12">
            {recipe.strCategory || 'Uncategorized'}
          </Text>
          <Text variant="section" color="black">
            {recipe.price || '0.00'} €
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
