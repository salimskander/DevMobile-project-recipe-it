import { router } from 'expo-router';
import { useState, useRef } from 'react';
import { FlatList, Pressable, Animated, TouchableOpacity } from 'react-native';

import { Box, Text } from 'theme';
import { RecipeCard } from './RecipeCard';
import { RecipeCardSkeleton } from './SkeletonLoading';
import { useRandomMeals } from '~/hooks/useRecipes';
import { Recipe } from '~/types/recipe';

type SectionWithRecipes = {
  id: string;
  title: string;
  subtitle: string;
  recipes: Recipe[];
};

const CARD_HEIGHT = 250;

export const RecipeSections = ({ section }: { section: SectionWithRecipes }) => {
  const [additionalRecipes, setAdditionalRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = useRef<Animated.Value[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const { refetch } = useRandomMeals(3);

  // Function to handle "See All" button - navigate to search page with section data
  const handleSeeAll = () => {
    // Navigate to search page and pass the section data
    router.push({
      pathname: '/(tabs)/search',
      params: {
        title: section.title,
        subtitle: section.subtitle,
      },
    });
  };

  // Function to load more recipes with delay animation
  const loadMoreRecipes = async () => {
    setIsLoading(true);

    try {
      // Fetch 3 new recipes
      const result = await refetch();
      const newRecipes = result.data || [];

      // Add animation values for each new recipe
      fadeAnim.current = newRecipes.map(() => new Animated.Value(0));

      // Scroll to the loading skeleton
      flatListRef.current?.scrollToEnd({ animated: true });

      // Add recipes one by one with animation
      for (let i = 0; i < newRecipes.length; i++) {
        // Add delay between each recipe
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Add the new recipe
        setAdditionalRecipes((prev) => {
          const updatedRecipes = [...prev, newRecipes[i]];

          // Scroll to the newly added recipe after state update
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: section.recipes.length + updatedRecipes.length - 1,
              animated: true,
              viewPosition: 0.5, // Center the item
            });
          }, 100);

          return updatedRecipes;
        });

        // Animate the new recipe
        Animated.timing(fadeAnim.current[i], {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    } catch (error) {
      console.error('Error fetching more recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Combine original recipes with additional recipes
  const allRecipes = [...section.recipes, ...additionalRecipes];

  // Handle scroll to index errors
  const onScrollToIndexFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    const wait = new Promise((resolve) => setTimeout(resolve, 500));
    wait.then(() => {
      flatListRef.current?.scrollToIndex({
        index: info.index,
        animated: true,
        viewPosition: 0.5,
      });
    });
  };

  return (
    <Box marginVertical="m_16">
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        marginHorizontal="l_32"
        marginBottom="xs_4">
        <Box flex={1}>
          <Text variant="section" color="black">
            {section.title}
          </Text>
        </Box>
        <Pressable onPress={handleSeeAll}>
          <Text variant="seeAll" color="orange">
            See all
          </Text>
        </Pressable>
      </Box>
      <Text variant="subtitle" color="gray" marginHorizontal="l_32" marginBottom="ml_24">
        {section.subtitle}
      </Text>
      <FlatList
        ref={flatListRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={allRecipes}
        contentContainerStyle={{ paddingHorizontal: 32 }}
        onScrollToIndexFailed={onScrollToIndexFailed}
        renderItem={({ item, index }) => {
          // Determine if this is an additional recipe
          const isAdditional = index >= section.recipes.length;
          const additionalIndex = index - section.recipes.length;

          if (isAdditional) {
            return (
              <Animated.View
                style={{
                  opacity: fadeAnim.current[additionalIndex] || 1,
                  marginRight: 16,
                }}>
                <RecipeCard recipe={item} />
              </Animated.View>
            );
          }

          return (
            <Box marginRight="m_16">
              <RecipeCard recipe={item} />
            </Box>
          );
        }}
        keyExtractor={(item, index) => `${item.idMeal}-${index}`}
        ListFooterComponent={
          <TouchableOpacity
            onPress={loadMoreRecipes}
            disabled={isLoading}
            style={{
              width: isLoading ? 150 : 60,
              height: CARD_HEIGHT,
              backgroundColor: '#f5f5f5',
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 8,
            }}>
            {isLoading ? (
              // Show skeleton loader with loading indicator
              <Box width="100%" height="100%" padding="m_16">
                <RecipeCardSkeleton />
              </Box>
            ) : (
              <Text style={{ fontSize: 28, color: 'orange' }}>+</Text>
            )}
          </TouchableOpacity>
        }
      />
    </Box>
  );
};
