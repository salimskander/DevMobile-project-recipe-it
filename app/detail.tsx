import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Box, Text } from 'theme';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type DetailParams = {
  title?: string;
  description?: string;
  imageUrl?: string;
  rating?: string;
  reviews?: string;
  ingredients?: string[];
};

export default function DetailScreen() {
  const params = useLocalSearchParams<DetailParams>();

  return (
    <>
      <Stack.Screen 
        options={{
          headerTitle: 'Food Detail',
          headerBackTitle: '',
        }} 
      />
      <ScrollView>
        <Box flex={1}>
          {/* Image principale */}
          <Image 
            source={{ uri: params.imageUrl }} 
            style={styles.mainImage}
            resizeMode="cover"
          />

          {/* Titre et sous-titre */}
          <Box padding="ml_24">
            <Text variant="title" fontSize={24} marginTop="m_16">
              {params.title}
            </Text>
            <Text variant="body" color="gray" marginTop="xs_4">
              With tomato sauce
            </Text>

            {/* Étoiles et avis */}
            <Box flexDirection="row" alignItems="center" marginTop="m_16">
              <FontAwesome name="star" size={16} color="#FFD700" />
              <Text marginLeft="xs_4">{params.rating || '4.3'} Ratings</Text>
              <Box 
                flexDirection="row" 
                alignItems="center" 
                marginLeft="l_32">
                <FontAwesome name="comment-o" size={16} color="gray" />
                <Text marginLeft="xs_4">{params.reviews || '980'} Reviews</Text>
              </Box>
            </Box>

            {/* Section détails et ingrédients */}
            <Box marginTop="l_32">
              <Text variant="title" fontSize={18}>
                Detail & Ingredient
              </Text>
              <Text 
                variant="body" 
                color="gray" 
                marginTop="m_16" 
                lineHeight={20}>
                {params.description}
              </Text>

              {/* Liste des ingrédients */}
              <Box flexDirection="row" flexWrap="wrap" marginTop="m_16">
                <Box 
                  padding="m_16" 
                  borderRadius="m_6"
                  marginRight="m_16"
                  marginBottom="m_16">
                  <Text>• Pepperoni</Text>
                </Box>
                <Box 
                  padding="m_16" 
                  borderRadius="m_6"
                  marginRight="m_16"
                  marginBottom="m_16">
                  <Text>• Oregano</Text>
                </Box>
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