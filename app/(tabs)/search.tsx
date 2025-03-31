import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { Box, Text } from 'theme';
import { RecipeCard } from '~/components/RecipeCard';
import { RecipeCardSkeleton } from '~/components/SkeletonLoading';
import { useRandomMeals } from '~/hooks/useRecipes';
import { Recipe } from '~/types/recipe';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SearchScreen() {
  const { title, subtitle } = useLocalSearchParams<{ title: string; subtitle: string }>();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use the existing hook to fetch random recipes
  const { data, isLoading: isFetching } = useRandomMeals(10);

  // Add recipes one by one from the top of the list
  useEffect(() => {
    if (data && data.length > 0) {
      const addRecipesOneByOne = async () => {
        // Reset recipes array
        setRecipes([]);

        // Add each recipe from the top by prepending to the array
        // This will make each new recipe appear at the top of the list
        for (let i = data.length - 1; i >= 0; i--) {
          // Add recipe to state at the beginning of the array
          setRecipes((current) => [data[i], ...current]);

          // Wait 1 second before adding the next recipe
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        setIsLoading(false);
      };

      addRecipesOneByOne();
    }
  }, [data]);

  // Display loading skeleton while loading
  if (isLoading && isFetching) {
    return (
      <Box flex={1} padding="l_32" backgroundColor="white">
        <Text variant="title" marginBottom="l_32">
          {title || 'Search'}
        </Text>
        <Text variant="subtitle" marginBottom="xl_64">
          {subtitle || 'Discover recipes'}
        </Text>

        <Animated.FlatList
          data={[1, 2, 3, 4, 5]}
          renderItem={() => (
            <Box marginBottom="l_32">
              <RecipeCardSkeleton />
            </Box>
          )}
          keyExtractor={(_, index) => `skeleton-${index}`}
        />
      </Box>
    );
  }

  // Render recipe item for the FlatList
  const renderRecipeItem = ({ item }) => (
    <Box marginBottom="l_32">
      <RecipeCard recipe={item} vertical />
    </Box>
  );

  return (
    <Box flex={1} padding="l_32" backgroundColor="white">
      <Text variant="title" marginBottom="l_32">
        {title || 'Search'}
      </Text>
      <Text variant="subtitle" marginBottom="xl_64">
        {subtitle || 'Discover recipes'}
      </Text>

      <Animated.FlatList
        data={recipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item.idMeal}
        showsVerticalScrollIndicator={false}
        // Use LinearTransition for smooth item animations
        itemLayoutAnimation={LinearTransition.duration(800)}
        // Make space for new items animation
        contentContainerStyle={{ paddingTop: 10 }}
      />
    </Box>
  );
}
