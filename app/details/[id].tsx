import { AntDesign } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CountUp } from 'use-count-up';
import { Box, Text } from 'theme';
import { HeaderDetails } from '~/components/HeaderDetails';
import { RecipeDetailSkeleton } from '~/components/SkeletonLoading';
import { useMealById } from '~/hooks/useRecipes';

type DetailParams = {
  id: string;
};

/**
 * Detail screen for showing recipe information
 * Includes error handling for invalid or incomplete data
 */
export default function DetailScreen() {
  const { id } = useLocalSearchParams<DetailParams>();
  const { data: recipe, isLoading, isError, error } = useMealById(id || '');
  const [quantity, setQuantity] = useState(1);
  const [startPrice, setStartPrice] = useState(0);
  const [key, setKey] = useState(0);
  const [imageError, setImageError] = useState(false);
  const insets = useSafeAreaInsets();

  // Handle invalid ID parameter
  useEffect(() => {
    if (!id) {
      Alert.alert(
        "Error",
        "Invalid recipe ID",
        [{ text: "Go back", onPress: () => router.back() }]
      );
    }
  }, [id]);

  // Handle API errors
  useEffect(() => {
    if (isError) {
      Alert.alert(
        "Error Loading Recipe",
        "Failed to load recipe details. Please try again later.",
        [{ text: "Go back", onPress: () => router.back() }]
      );
    }
  }, [isError, error]);

  const currentTotal = recipe && recipe.price ? Number(recipe.price) * quantity : 0;

  const handleIncrement = () => {
    setStartPrice(currentTotal);
    setQuantity((prev) => prev + 1);
    setKey((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setStartPrice(currentTotal);
    setQuantity((prev) => Math.max(1, prev - 1));
    setKey((prev) => prev + 1);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Show skeleton loading while fetching data
  if (isLoading) {
    return (
      <Box flex={1} style={{ paddingTop: insets.top }}>
        <HeaderDetails />
        <RecipeDetailSkeleton />
      </Box>
    );
  }

  // Handle missing recipe data
  if (!recipe) {
    return (
      <Box flex={1} style={{ paddingTop: insets.top }}>
        <HeaderDetails />
        <Box flex={1} alignItems="center" justifyContent="center" padding="ml_24">
          <AntDesign name="exclamationcircleo" size={64} color="gray" />
          <Text variant="title" textAlign="center" marginTop="m_16">
            Recipe not found
          </Text>
          <Text variant="body" color="gray" textAlign="center" marginTop="s_8">
            The recipe you're looking for might have been removed or is temporarily unavailable.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              backgroundColor: "orange",
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 12,
              marginTop: 24,
            }}
          >
            <Text variant="body" color="white">
              Go Back
            </Text>
          </TouchableOpacity>
        </Box>
      </Box>
    );
  }

  // Create an array of non-null ingredients
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}` as keyof typeof recipe];
    const measure = recipe[`strMeasure${i}` as keyof typeof recipe];
    if (ingredient && ingredient.trim() !== '') {
      ingredients.push(`${measure || ''} ${ingredient}`);
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false, // This ensures header is always hidden
        }}
      />
      <Box flex={1} style={{ paddingTop: insets.top }}>
        <HeaderDetails />
        <ScrollView>
          <Box flex={1} style={{ paddingBottom: insets.bottom + 50 }}>
            <Image
              source={{ 
                uri: imageError 
                  ? 'https://via.placeholder.com/400x300?text=No+Image' 
                  : recipe.strMealThumb 
              }}
              style={styles.mainImage}
              resizeMode="cover"
              onError={handleImageError}
            />
            <Box paddingHorizontal="ml_24">
              {/* Main container for title and selector */}
              <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                <Box flex={1}>
                  <Text variant="title" fontSize={24} marginTop="m_16">
                    {recipe.strMeal || 'Unnamed Recipe'}
                  </Text>
                  <Text variant="bodyRegular" color="gray">
                    {recipe.strCategory || 'Uncategorized'} • {recipe.strArea || 'Unknown Origin'}
                  </Text>
                  <Text variant="title" color="orange" marginTop="s_8" fontSize={20}>
                    <CountUp
                      isCounting
                      start={0}
                      end={Number(recipe.price) || 0}
                      duration={1}
                      decimalPlaces={2}
                      formatter={(value) => `${value.toFixed(2)} €`}
                    />
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
                  width={80} // Fixed width
                  justifyContent="space-between">
                  <TouchableOpacity onPress={handleDecrement}>
                    <Box width={20} alignItems="center">
                      <Text color="white" fontSize={20}>
                        -
                      </Text>
                    </Box>
                  </TouchableOpacity>
                  <Box width={20} alignItems="center">
                    <Text color="white" fontSize={18}>
                      {quantity}
                    </Text>
                  </Box>
                  <TouchableOpacity onPress={handleIncrement}>
                    <Box width={20} alignItems="center">
                      <Text color="white" fontSize={20}>
                        +
                      </Text>
                    </Box>
                  </TouchableOpacity>
                </Box>
              </Box>
              {/* Ratings and comments container */}
              <Box
                flexDirection="row"
                justifyContent="space-between"
                marginTop="ml_24"
                marginBottom="l_32">
                <Box flexDirection="row" alignItems="center">
                  <AntDesign name="star" size={24} color="#FFD700" />
                  <Text marginLeft="xs_4" variant="bodyRegular" color="black">
                    {recipe.rating || '0.0'} Ratings
                  </Text>
                </Box>
                <Box flexDirection="row" alignItems="center">
                  <AntDesign name="message1" size={24} color="gray" />
                  <Text marginLeft="xs_4" variant="bodyRegular" color="black">
                    {recipe.comments || '0'} Comments
                  </Text>
                </Box>
              </Box>
              {/* Remaining content */}
              <Box>
                <Text variant="title" fontSize={18} color="black">
                  Detail & Ingredient
                </Text>
                <Text variant="bodyRegular" color="black" marginTop="m_16" lineHeight={20}>
                  {recipe.strInstructions || 'No instructions available for this recipe.'}
                </Text>
                
                {ingredients.length > 0 ? (
                  <Box flexDirection="row" flexWrap="wrap" marginTop="ml_24">
                    {ingredients.map((ingredient, index) => (
                      <Box key={index} padding="sm_12" borderRadius="m_6" marginBottom="s_8">
                        <Text color="black">• {ingredient}</Text>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box padding="m_16" marginTop="ml_24" backgroundColor="#F5F5F5" borderRadius="m_6">
                    <Text color="gray">No ingredients information available.</Text>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </ScrollView>
        {/* Add to cart button */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          paddingHorizontal="xl_64"
          style={{ paddingBottom: insets.bottom + 10 }}
          shadowColor="black"
          shadowOffset={{ width: 0, height: -2 }}
          shadowOpacity={0.1}
          shadowRadius={4}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              // Add to cart logic here
              Alert.alert("Success", `Added ${recipe.strMeal} to cart`, [{ text: "OK" }]);
            }}>
            <Box
              backgroundColor="orange"
              borderRadius="xl_24"
              padding="sm_12"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center">
              <Text variant="body" color="white">
                Ajouter au panier
              </Text>
              <Text variant="body" color="white">
                <CountUp
                  key={key}
                  isCounting
                  start={startPrice}
                  end={currentTotal}
                  duration={1}
                  decimalPlaces={2}
                  formatter={(value) => `${value.toFixed(2)} €`}
                />
              </Text>
            </Box>
          </TouchableOpacity>
        </Box>
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
