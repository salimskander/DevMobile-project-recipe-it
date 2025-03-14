import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useEffect } from 'react';
import { Dimensions, ScrollView, Animated, Image } from 'react-native';
import { Box, Text } from 'theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const SPACING = 48;

const SPECIAL_OFFERS = [
  {
    id: '1',
    title: 'Special Offer',
    description: 'Fried noodles with special chicken katsu',
    image:
      'https://static.vecteezy.com/system/resources/previews/045/960/480/non_2x/noodles-in-bowl-with-chopsticks-transparent-background-free-png.png',
    colors: ['#D48C4A', '#EC994B'],
  },
  {
    id: '2',
    title: 'New Recipe',
    description: 'Homemade pizza with fresh ingredients',
    image: 'https://pngimg.com/d/pizza_PNG44095.png',
    colors: ['#4A90E2', '#357ABD'],
  },
  {
    id: '3',
    title: 'Chef Special',
    description: 'Grilled salmon with vegetables',
    image: 'https://static.vecteezy.com/system/resources/previews/049/664/161/non_2x/grilled-salmon-with-asparagus-and-lemon-a-delicious-and-healthy-dinner-with-transparent-background-png.png',
    colors: ['#50C878', '#2E8B57'],
  },
];

export const SpecialOffersCarousel = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // Modifier la façon dont nous créons extendedOffers pour avoir des clés uniques
  const extendedOffers = [
    ...SPECIAL_OFFERS.map((offer) => ({ ...offer, key: `${offer.id}-1` })),
    ...SPECIAL_OFFERS.map((offer) => ({ ...offer, key: `${offer.id}-2` })),
    ...SPECIAL_OFFERS.map((offer) => ({ ...offer, key: `${offer.id}-3` })),
  ].slice(0, 7);

  const SIDE_PADDING = (width - CARD_WIDTH) / 2;
  const defaultPosition = 3 * (CARD_WIDTH + SPACING);

  useEffect(() => {
    scrollViewRef.current?.scrollTo({
      x: defaultPosition,
      animated: false,
    });
  }, []);

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
    useNativeDriver: false,
  });

  const handleScrollEnd = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(offsetX / (CARD_WIDTH + SPACING));

    if (extendedOffers[currentIndex]?.id === '1') {
      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollTo({
          x: 3 * (CARD_WIDTH + SPACING),
          animated: false,
        });
      });
    }
  };

  const renderItem = (offer: (typeof extendedOffers)[0]) => {
    return (
      <Box
        key={offer.key} // Utiliser la nouvelle clé unique
        height={170}
        width={CARD_WIDTH}
        style={{ marginHorizontal: SPACING / 2 }}
        borderRadius="l_12"
        overflow="hidden">
        <LinearGradient
          colors={[offer.colors[0], offer.colors[1]]}
          style={{ flex: 1, flexDirection: 'row' }}>
          <Box width="40%" height="100%">
            <Image
              source={{ uri: offer.image }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </Box>
          <Box flex={1} padding="ml_24" justifyContent="space-between">
            <Box>
              <Text variant="subtitle" color="white" marginBottom="s_8">
                {offer.title}
              </Text>
              <Text variant="body" color="white">
                {offer.description}
              </Text>
            </Box>
            <Box
              backgroundColor="darkGray"
              borderRadius="m_6"
              paddingVertical="s_8"
              paddingHorizontal="m_16"
              alignSelf="flex-start">
              <Text variant="buttonText" color="white">
                Buy Now
              </Text>
            </Box>
          </Box>
        </LinearGradient>
      </Box>
    );
  };

  return (
    <Box height={170}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + SPACING}
        snapToAlignment="center"
        contentContainerStyle={{
          paddingHorizontal: SIDE_PADDING - SPACING / 2,
        }}>
        {extendedOffers.map((offer) => renderItem(offer))}
      </ScrollView>
    </Box>
  );
};
