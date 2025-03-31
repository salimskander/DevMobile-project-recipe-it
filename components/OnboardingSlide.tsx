import { Box, Text } from 'theme';
import { Image, ImageSourcePropType, Dimensions } from 'react-native';

type OnboardingSlideProps = {
  title: string;
  description: string;
  image: ImageSourcePropType;
};

const { width } = Dimensions.get('window');

export const OnboardingSlide = ({ title, description, image }: OnboardingSlideProps) => {
  return (
    <Box width={width} alignItems="center" padding="ml_24">
      <Image 
        source={image} 
        style={{ width: width * 0.8, height: width * 0.8 }} 
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