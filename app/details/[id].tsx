import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Box, Text } from 'theme';
import { Image, ScrollView, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SECTIONS_DATA } from '~/screens/mainPageScreen';

type DetailParams = {
  id: string;
};

// Simulons une fonction pour récupérer les données du produit
const getProductById = (id: string) => {
  // Référence aux données de SECTIONS_DATA
  const allProducts = SECTIONS_DATA.flatMap(section => section.data);
  return allProducts.find(product => product.id === id);
};

export default function DetailScreen() {
  const { id } = useLocalSearchParams<DetailParams>();
  const product = getProductById(id);

  if (!product) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center">
        <Text variant="title">Produit non trouvé</Text>
      </Box>
    );
  }

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
          <Image 
            source={{ uri: product.image }} 
            style={styles.mainImage}
            resizeMode="cover"
          />

          <Box padding="ml_24">
            <Text variant="title" fontSize={24} marginTop="m_16">
              {product.title}
            </Text>
            <Text variant="body" color="gray" marginTop="xs_4">
              {product.subtitle}
            </Text>

            <Box flexDirection="row" alignItems="center" marginTop="m_16">
              <FontAwesome name="star" size={16} color="#FFD700" />
              <Text marginLeft="xs_4">4.3 Ratings</Text>
              <Box flexDirection="row" alignItems="center" marginLeft="l_32">
                <FontAwesome name="comment-o" size={16} color="gray" />
                <Text marginLeft="xs_4">980 Reviews</Text>
              </Box>
            </Box>

            <Box marginTop="l_32">
              <Text variant="title" fontSize={18}>
                Detail & Ingredient
              </Text>
              <Text 
                variant="body" 
                color="gray" 
                marginTop="m_16" 
                lineHeight={20}>
                {`Délicieux ${product.title} à ${product.price}€. ${product.subtitle}`}
              </Text>

              <Box flexDirection="row" flexWrap="wrap" marginTop="m_16">
                <Box 
                  padding="m_16" 
                  borderRadius="m_6"
                  marginRight="m_16"
                  marginBottom="m_16">
                  <Text>• Ingrédient 1</Text>
                </Box>
                <Box 
                  padding="m_16" 
                  borderRadius="m_6"
                  marginRight="m_16"
                  marginBottom="m_16">
                  <Text>• Ingrédient 2</Text>
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