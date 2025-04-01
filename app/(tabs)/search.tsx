import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  LayoutAnimation,
  Platform,
  UIManager,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { Box, Text } from 'theme';
import { RecipeCard } from '~/components/RecipeCard';
import { RecipeCardSkeleton } from '~/components/SkeletonLoading';
import { useRandomMeals } from '~/hooks/useRecipes';
import { api } from '~/services/api';
import { Recipe } from '~/types/recipe';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Popular search suggestions
const SEARCH_SUGGESTIONS = [
  'Pasta', 'Chicken', 'Vegetarian', 'Dessert', 'Breakfast',
  'Italian', 'Mexican', 'Asian', 'Quick meals', 'Healthy'
];

// Debounce timeout (ms)
const DEBOUNCE_TIMEOUT = 500;

export default function SearchScreen() {
  const { title, subtitle } = useLocalSearchParams<{ title: string; subtitle: string }>();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  // Track if user has performed at least one search
  const hasSearched = useRef(false);
  // Reference to the recipe loading timeout
  const recipeLoadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use the existing hook to fetch random recipes
  const { data, isLoading: isFetching } = useRandomMeals(10);

  // Search for recipes using the API service
  const searchRecipes = async (query: string) => {
    if (!query.trim()) {
      // If the query is empty, reset to the initial random recipes
      if (data) {
        // If user has already searched before, just set all recipes at once
        if (hasSearched.current) {
          setRecipes(data);
        } else {
          // If this is the initial load, keep the animation behavior
          addRecipesOneByOne();
        }
      }
      return;
    }
    
    // Mark that user has searched at least once
    hasSearched.current = true;
    
    setIsSearching(true);
    try {
      // Use the API service to search for meals
      const mealsData = await api.searchMeals(query);
      
      // Add animation when updating recipes
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setRecipes(mealsData);
    } catch (error) {
      console.error('Error searching recipes:', error);
      setRecipes([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input changes with debounce
  const handleSearchInputChange = (text: string) => {
    // Stop the recipe loading animation immediately when user types
    if (recipeLoadingTimeoutRef.current) {
      clearTimeout(recipeLoadingTimeoutRef.current);
      recipeLoadingTimeoutRef.current = null;
    }
    
    setSearchQuery(text);
    
    // Clear previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Set new timeout to search recipes after user stops typing
    const newTimeout = setTimeout(() => {
      searchRecipes(text);
    }, DEBOUNCE_TIMEOUT);
    
    setTypingTimeout(newTimeout as unknown as NodeJS.Timeout);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    // Stop the recipe loading animation when user clicks a suggestion
    if (recipeLoadingTimeoutRef.current) {
      clearTimeout(recipeLoadingTimeoutRef.current);
      recipeLoadingTimeoutRef.current = null;
    }
    
    setSearchQuery(suggestion);
    searchRecipes(suggestion);
  };

  // Add recipes one by one animation function
  const addRecipesOneByOne = async () => {
    if (!data || data.length === 0) return;
    
    // Reset recipes array
    setRecipes([]);

    // Add each recipe from the top by prepending to the array
    // This will make each new recipe appear at the top of the list
    for (let i = data.length - 1; i >= 0; i--) {
      // Check if user has started typing or searching, if so, stop adding recipes
      if (searchQuery.trim() !== '' || hasSearched.current) {
        break;
      }
      
      // Add recipe to state at the beginning of the array
      setRecipes((current) => [data[i], ...current]);

      // Wait 1 second before adding the next recipe
      // Store the timeout reference so we can cancel it if needed
      await new Promise((resolve) => {
        recipeLoadingTimeoutRef.current = setTimeout(resolve, 1000) as unknown as NodeJS.Timeout;
      });
    }

    // Clear the reference since the animation is complete
    recipeLoadingTimeoutRef.current = null;
    setIsLoading(false);
  };

  // Add recipes one by one from the top of the list (only on initial load)
  useEffect(() => {
    if (data && data.length > 0 && !searchQuery && !hasSearched.current) {
      addRecipesOneByOne();
    } else if (data && hasSearched.current) {
      // If user has already searched, just set recipes directly
      setRecipes(data);
      setIsLoading(false);
    }
  }, [data]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      // Clean up typing timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      
      // Clean up recipe loading timeout
      if (recipeLoadingTimeoutRef.current) {
        clearTimeout(recipeLoadingTimeoutRef.current);
      }
    };
  }, [typingTimeout]);

  // Display loading skeleton while loading
  if (isLoading && isFetching && !searchQuery) {
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
  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <Box marginBottom="l_32">
      <RecipeCard recipe={item} vertical />
    </Box>
  );

  return (
    <Box flex={1} padding="l_32" backgroundColor="white">
      <Text variant="title" marginBottom="l_32">
        {title || 'Search'}
      </Text>
      <Text variant="subtitle" marginBottom="m_16">
        {subtitle || 'Discover recipes'}
      </Text>

      {/* Search Bar */}
      <Box 
        flexDirection="row" 
        alignItems="center" 
        borderWidth={1} 
        borderColor="border" 
        borderRadius="l_12" 
        paddingHorizontal="m_16" 
        marginBottom="m_16"
        backgroundColor="background"
        height={50}
      >
        <TextInput
          placeholder="Search for recipes..."
          value={searchQuery}
          onChangeText={handleSearchInputChange}
          style={{ flex: 1, fontSize: 16, fontFamily: 'Poppins-Regular' }}
          returnKeyType="search"
          onSubmitEditing={() => searchRecipes(searchQuery)}
        />
        {isSearching ? (
          <ActivityIndicator size="small" color="#888" />
        ) : (
          <TouchableOpacity onPress={() => searchRecipes(searchQuery)}>
            <Ionicons name="search" size={24} color="#888" />
          </TouchableOpacity>
        )}
      </Box>

      {/* Category Suggestions - Extended to screen edges */}
      <Box 
      style={{        marginHorizontal: -32}} // Negative margin to extend to the screen edges
        marginBottom="l_32"
      >
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ 
            paddingHorizontal: 32, // Add padding to match the screen padding
          }}
        >
          {SEARCH_SUGGESTIONS.map((suggestion, index) => (
            <TouchableOpacity
              key={`suggestion-${index}`}
              onPress={() => handleSuggestionClick(suggestion)}
            >
              <Box 
                paddingHorizontal="m_16" 
                paddingVertical="s_8"
                backgroundColor={searchQuery === suggestion ? "blue" : "background"}
                borderRadius="round" 
                marginRight="m_16"
                borderWidth={1}
                borderColor="border"
              >
                <Text 
                  variant="body" 
                  color={searchQuery === suggestion ? "white" : "black"}
                >
                  {suggestion}
                </Text>
              </Box>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Box>

      {/* No results message */}
      {searchQuery && recipes.length === 0 && !isSearching && (
        <Box alignItems="center" marginTop="xl_64">
          <Text variant="body">No recipes found for "{searchQuery}"</Text>
        </Box>
      )}

      <Animated.FlatList
        data={recipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item.idMeal}
        showsVerticalScrollIndicator={false}
        // Use LinearTransition for smooth item animations
        itemLayoutAnimation={LinearTransition.duration(800)}
        // Make space for new items animation
        contentContainerStyle={{ paddingTop: 10 }}
        // Empty list message
        ListEmptyComponent={
          searchQuery && !isSearching ? null : (
            <Box alignItems="center" marginTop="xl_64">
              <Text variant="body">Loading recipes...</Text>
            </Box>
          )
        }
      />
    </Box>
  );
}
