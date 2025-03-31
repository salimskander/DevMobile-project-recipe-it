import React, { useEffect } from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';
import { Box } from '~/theme';

// Animation values for the skeleton shimmer effect
const AnimatedBox = Animated.createAnimatedComponent(Box);
const { width } = Dimensions.get('window');

/**
 * Base skeleton component that provides the shimmer animation
 */
export const Skeleton = ({ children, style }: { children: React.ReactNode, style?: any }) => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    // Create the shimmer animation
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      })
    ).start();

    // Clean up animation when component unmounts
    return () => {
      animatedValue.setValue(0);
    };
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={[styles.container, style]}>
      {children}
      <AnimatedBox
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ translateX }],
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          },
        ]}
      />
    </View>
  );
};

/**
 * Recipe card skeleton for horizontal lists
 */
export const RecipeCardSkeleton = () => {
  return (
    <Skeleton style={styles.recipeCard}>
      <Box style={styles.recipeImage} backgroundColor="gray" opacity={0.2} borderRadius="l_12" />
      <Box style={styles.recipeTitle} backgroundColor="gray" opacity={0.2} borderRadius="s_3" marginTop="s_8" />
      <Box style={styles.recipeSubtitle} backgroundColor="gray" opacity={0.2} borderRadius="s_3" marginTop="xs_4" />
      <Box style={styles.recipeRating} backgroundColor="gray" opacity={0.2} borderRadius="s_3" marginTop="xs_4" />
    </Skeleton>
  );
};

/**
 * Recipe section skeleton with title and items
 */
export const RecipeSectionSkeleton = () => {
  return (
    <Box padding="m_16" marginBottom="m_16">
      <Skeleton style={styles.sectionTitle}>
        <Box backgroundColor="gray" opacity={0.2} borderRadius="s_3" height={24} width={150} />
      </Skeleton>
      <Skeleton style={styles.sectionSubtitle}>
        <Box backgroundColor="gray" opacity={0.2} borderRadius="s_3" height={16} width={220} marginTop="xs_4" />
      </Skeleton>
      
      <Box flexDirection="row" marginTop="m_16">
        {[1, 2, 3].map((item) => (
          <Box key={item} marginRight="m_16" width={150}>
            <RecipeCardSkeleton />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

/**
 * Recipe detail page skeleton
 */
export const RecipeDetailSkeleton = () => {
  return (
    <Box flex={1} padding="m_16">
      <Skeleton style={styles.detailImage}>
        <Box backgroundColor="gray" opacity={0.2} borderRadius="l_12" height={200} width="100%" />
      </Skeleton>
      
      <Skeleton style={{ marginTop: 16 }}>
        <Box backgroundColor="gray" opacity={0.2} borderRadius="s_3" height={32} width="80%" />
      </Skeleton>
      
      <Skeleton style={{ marginTop: 8 }}>
        <Box backgroundColor="gray" opacity={0.2} borderRadius="s_3" height={20} width="60%" />
      </Skeleton>
      
      <Box flexDirection="row" justifyContent="space-between" marginTop="m_16">
        {[1, 2, 3].map((item) => (
          <Skeleton key={item} style={{ width: '30%' }}>
            <Box backgroundColor="gray" opacity={0.2} borderRadius="l_12" height={80} width="100%" />
          </Skeleton>
        ))}
      </Box>
      
      <Skeleton style={{ marginTop: 24 }}>
        <Box backgroundColor="gray" opacity={0.2} borderRadius="s_3" height={24} width="40%" />
      </Skeleton>
      
      <Box marginTop="m_16">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} style={{ marginBottom: 8 }}>
            <Box backgroundColor="gray" opacity={0.2} borderRadius="s_3" height={16} width="100%" />
          </Skeleton>
        ))}
      </Box>
    </Box>
  );
};

/**
 * Main screen skeleton with multiple sections
 */
export const MainScreenSkeleton = () => {
  return (
    <Box flex={1}>
      <Box padding="m_16" flexDirection="row" alignItems="center">
        <Skeleton style={styles.profileImageSkeleton}>
          <Box backgroundColor="gray" opacity={0.2} borderRadius="round" height={45} width={45} />
        </Skeleton>
        <Box marginLeft="m_16">
          <Skeleton>
            <Box backgroundColor="gray" opacity={0.2} borderRadius="s_3" height={16} width={80} />
          </Skeleton>
          <Skeleton style={{ marginTop: 4 }}>
            <Box backgroundColor="gray" opacity={0.2} borderRadius="s_3" height={20} width={120} />
          </Skeleton>
        </Box>
      </Box>
      
      <Box padding="m_16">
        <Skeleton>
          <Box backgroundColor="gray" opacity={0.2} borderRadius="s_3" height={28} width="80%" />
        </Skeleton>
      </Box>
      
      <Box height={160} padding="s_8">
        <Skeleton style={{ height: '100%', borderRadius: 12 }}>
          <Box backgroundColor="gray" opacity={0.2} borderRadius="l_12" height="100%" width="100%" />
        </Skeleton>
      </Box>
      
      {[1, 2, 3].map((section) => (
        <RecipeSectionSkeleton key={section} />
      ))}
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  recipeCard: {
    width: 150,
    height: 220,
  },
  recipeImage: {
    height: 150,
    width: '100%',
    borderRadius: 12,
  },
  recipeTitle: {
    height: 20,
    width: '90%',
  },
  recipeSubtitle: {
    height: 16,
    width: '70%',
  },
  recipeRating: {
    height: 16,
    width: '40%',
  },
  sectionTitle: {
    height: 24,
    width: 150,
  },
  sectionSubtitle: {
    height: 16,
    width: 220,
  },
  detailImage: {
    height: 200,
    width: '100%',
    borderRadius: 12,
  },
  profileImageSkeleton: {
    height: 45,
    width: 45,
    borderRadius: 45,
  }
});