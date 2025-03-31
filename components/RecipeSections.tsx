import { useState, useRef, useCallback } from 'react';
import { FlatList, Pressable, Animated, TouchableOpacity, Alert } from 'react-native';
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
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingIndex, setLoadingIndex] = useState(-1); // Track which index is currently loading
  const fadeAnim = useRef<Animated.Value[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const { refetch } = useRandomMeals(3);

  // Function to handle "See All" button
  const handleSeeAll = () => {
    console.log('See all clicked for:', section.title);
  };

  // Function to load more recipes with delay animation
  const loadMoreRecipes = async () => {
    // If already loading, don't trigger another load
    if (isLoading) return;
    
    setIsLoading(true);
    setLoadError(null);

    try {
      // Fetch 3 new recipes
      const result = await refetch();
      
      if (!result.data || result.data.length === 0) {
        setLoadError('Failed to load more recipes');
        throw new Error('No recipes returned from API');
      }
      
      const newRecipes = result.data || [];

      // Add animation values for each new recipe
      fadeAnim.current = newRecipes.map(() => new Animated.Value(0));

      // Scroll to the loading skeleton
      flatListRef.current?.scrollToEnd({ animated: true });

      // Add recipes one by one with animation
      for (let i = 0; i < newRecipes.length; i++) {
        // Set the current loading index
        setLoadingIndex(i);
        
        // Add delay between each recipe
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Add the new recipe
        setAdditionalRecipes(prev => {
          const updatedRecipes = [...prev, newRecipes[i]];
          
          // Scroll to the newly added recipe after state update
          setTimeout(() => {
            try {
              flatListRef.current?.scrollToIndex({
                index: section.recipes.length + updatedRecipes.length - 1,
                animated: true,
                viewPosition: 0.5, // Center the item
              });
            } catch (error) {
              console.error('Error scrolling to index:', error);
            }
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
      setLoadError('Failed to load recipes. Please try again.');
      // Show error alert to user
      Alert.alert(
        'Error Loading Recipes',
        'Failed to load more recipes. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
      setLoadingIndex(-1);
    }
  };

  // Combine original recipes with additional recipes
  const allRecipes = [...(section.recipes || []), ...additionalRecipes];

  // Render an empty state if no recipes are available
  const renderEmptyState = useCallback(() => {
    return (
      <Box 
        width={190}
        height={CARD_HEIGHT}
        marginRight="m_16"
        backgroundColor="cardBackground"
        borderRadius="l_12"
        justifyContent="center"
        alignItems="center"
        padding="m_16"
      >
        <Text variant="body" color="gray" textAlign="center">
          No recipes available
        </Text>
      </Box>
    );
  }, []);

  // Handle scroll to index errors
  const onScrollToIndexFailed = useCallback((info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    const wait = new Promise(resolve => setTimeout(resolve, 500));
    wait.then(() => {
      try {
        flatListRef.current?.scrollToIndex({
          index: info.index,
          animated: true,
          viewPosition: 0.5,
        });
      } catch (error) {
        console.warn('Scroll to index still failed after delay', error);
      }
    });
  }, []);

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
        data={allRecipes.length > 0 ? allRecipes : [null]} // Pass at least one item for empty state
        contentContainerStyle={{ paddingHorizontal: 32 }}
        onScrollToIndexFailed={onScrollToIndexFailed}
        renderItem={({ item, index }) => {
          // Show empty state if no recipes
          if (!item) {
            return renderEmptyState();
          }

          // Determine if this is an additional recipe
          const isAdditional = index >= (section.recipes?.length || 0);
          const additionalIndex = index - (section.recipes?.length || 0);

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
        keyExtractor={(item, index) => item ? `${item.idMeal}-${index}` : `empty-${index}`}
        ListFooterComponent={
          <TouchableOpacity
            onPress={loadMoreRecipes}
            disabled={isLoading}
            style={{
              width: isLoading ? 150 : 60,
              height: CARD_HEIGHT,
              backgroundColor: loadError ? '#FFEEEE' : '#f5f5f5',
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 8,
              ...(loadError && { borderWidth: 1, borderColor: '#FFAAAA' })
            }}>
            {isLoading ? (
              // Show skeleton loader with loading indicator
              <Box width="100%" height="100%" padding="m_16">
                <RecipeCardSkeleton />
              </Box>
            ) : loadError ? (
              <Box padding="m_16" alignItems="center">
                <Text style={{ color: 'red', textAlign: 'center' }}>
                  Error loading recipes
                </Text>
                <Text style={{ color: 'blue', marginTop: 8, textDecoration: 'underline' }}>
                  Try again
                </Text>
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
