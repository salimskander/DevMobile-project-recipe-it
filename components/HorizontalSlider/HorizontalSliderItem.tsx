import { LinearGradient } from 'expo-linear-gradient';
import { ImageSourcePropType, Dimensions, ImageBackground } from 'react-native';
import { Box, Text } from 'theme';

export type SliderItemProps = {
  title: string;
  description: string;
  image: ImageSourcePropType;
};

const { width } = Dimensions.get('window');

export const HorizontalSliderItem = ({ title, description, image }: SliderItemProps) => {
  return (
    <Box width={width} alignItems="center" padding="ml_24">
      <ImageBackground
        source={image}
        style={{ width: width * 1, height: width * 0.9 }}
        resizeMode="contain">
        {/* Gradient du haut */}
        <LinearGradient
          colors={['#F5F5F5', '#F5F5F5', 'rgba(245, 245, 245, 0)']}
          locations={[0, 0.3, 1]}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: '40%',
          }}
        />
        {/* Gradient du bas */}
        <LinearGradient
          colors={['rgba(245, 245, 245, 0)', '#F5F5F5', '#F5F5F5']}
          locations={[0, 0.7, 1]}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '40%',
          }}
        />
      </ImageBackground>
      <Text variant="title" marginTop="l_32">
        {title}
      </Text>
      <Text variant="body" textAlign="center" marginTop="m_16" color="gray">
        {description}
      </Text>
    </Box>
  );
};