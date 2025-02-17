import { Feather, AntDesign } from '@expo/vector-icons';
import { Image, Pressable, TouchableOpacity } from 'react-native';
import { Box, Text } from 'theme';
import { useState } from 'react';
import { router } from 'expo-router';

type CardProps = {
  title: string;
  image: string;
  width: number;
  height: number;
  subtitle?: string;
  price?: string;
  id: string;
};

export const Card = ({ title, image, width, height, subtitle, price, id }: CardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handlePress = () => {
    router.push({
      pathname: '/detail',
      params: { id }
    });
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
      <Box
        backgroundColor="cardBackground"
        borderRadius="l_12"
        borderWidth={2}
        borderColor="border"
        marginVertical="s_8"
        width={width}
        height={height}
        elevation={5}>
        <Box position="relative">
          <Image 
            source={{ uri: image }} 
            style={{ 
              width: '100%', 
              height: height * 0.6,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12
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
          <Box>
            <Text variant="body" color="black">
              {title}
            </Text>
            <Text variant="subtitle" color="gray" marginBottom="sm_12">
              {subtitle}
            </Text>
            <Text variant="section" color="black">
              {price} €
            </Text>
          </Box>
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
