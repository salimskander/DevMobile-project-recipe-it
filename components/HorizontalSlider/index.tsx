import React from 'react';
import { ScrollView, Dimensions } from 'react-native';
import { Box } from 'theme';

import { HorizontalSliderItem, SliderItemProps } from './HorizontalSliderItem';

type HorizontalSliderProps = {
  items: SliderItemProps[];
  currentIndex: number;
  onSlideChange: (index: number) => void;
};

const { width } = Dimensions.get('window');

export const HorizontalSlider = ({ items, currentIndex, onSlideChange }: HorizontalSliderProps) => {
  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    onSlideChange(slideIndex);
  };

  return (
    <>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        {items.map((item, index) => (
          <HorizontalSliderItem key={index} {...item} />
        ))}
      </ScrollView>
      <Box
        position="relative"
        bottom="50%"
        left={0}
        right={0}
        flexDirection="row"
        justifyContent="center"
        alignItems="center">
        {items.map((_, index) => (
          <Box
            key={index}
            width={25}
            height={currentIndex === index ? 5 : 3}
            borderRadius="s_3"
            backgroundColor={currentIndex === index ? 'orange' : 'gray'}
            margin="xs_4"
            alignSelf="center"
          />
        ))}
      </Box>
    </>
  );
};
