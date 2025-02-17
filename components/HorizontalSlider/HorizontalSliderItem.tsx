import { Box, Text } from 'theme';
import { Image, ImageSourcePropType, Dimensions } from 'react-native';

export type SliderItemProps = {
  title: string;
  description: string;
  image: ImageSourcePropType;
};

const { width } = Dimensions.get('window');

export const HorizontalSliderItem = ({ title, description, image }: SliderItemProps) => {
  return (
    <Box width={width} alignItems="center" padding="ml_24">
      <Image 
        source={image} 
        style={{ width: width * 1, height: width * 0.9}} 
        resizeMode="contain" 
      />
      <Text variant="title" marginTop="l_32">
        {title}
      </Text>
      <Text 
        variant="body" 
        textAlign="center" 
        marginTop="m_16" 
        color="gray">
        {description}
      </Text>
    </Box>
  );
}; 