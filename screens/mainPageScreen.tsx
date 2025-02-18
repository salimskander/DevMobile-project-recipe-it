import { LinearGradient } from 'expo-linear-gradient';
import { Image, FlatList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Box, Text } from 'theme';

import { RecipeSections } from '~/components/RecipeSections';
import { useRandomMeals } from '~/hooks/useRecipes';

const Header = () => (
  <Box marginHorizontal="l_32" marginBottom="l_32">
    <Text variant="title" color="black" marginBottom="ml_24">
      Lets find your best favorite food!
    </Text>
    <Box height={170} borderRadius="l_12" overflow="hidden">
      <LinearGradient colors={['#D48C4A', '#EC994B']} style={{ flex: 1, flexDirection: 'row' }}>
        <Box width="40%" height="100%">
          <Image
            source={{
              uri: 'https://static.vecteezy.com/system/resources/previews/045/960/480/non_2x/noodles-in-bowl-with-chopsticks-transparent-background-free-png.png',
            }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </Box>
        <Box flex={1} padding="ml_24" justifyContent="space-between">
          <Box>
            <Text variant="subtitle" color="white" marginBottom="s_8">
              Special Offer
            </Text>
            <Text variant="body" color="white">
              Fried noodles with special chicken katsu
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
  </Box>
);

export const SECTIONS_DATA = [
  {
    id: '1',
    title: 'Popular',
    subtitle: 'See the most popular food on order',
  },
  {
    id: '2',
    title: 'New Menu',
    subtitle: 'Try our new menu on the list',
  },
  {
    id: '3',
    title: 'Recommandés pour vous',
    subtitle: 'Based on your previous order',
  },
];

export const MainPageScreen = () => {
  const insets = useSafeAreaInsets();
  const { data: recipes, isLoading } = useRandomMeals(9);

  if (isLoading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color="orange" />
      </Box>
    );
  }

  const splitRecipes = recipes
    ? [recipes.slice(0, 3), recipes.slice(3, 6), recipes.slice(6, 9)]
    : [];

  const sectionsWithData = SECTIONS_DATA.map((section, index) => ({
    ...section,
    recipes: splitRecipes[index] || [],
  }));

  return (
    <Box flex={1} backgroundColor="background" style={{ paddingTop: insets.top }}>
      <Box paddingHorizontal="l_32" paddingBottom="l_32" flexDirection="row" alignItems="center">
        <Box width={45} height={45} borderRadius="round" overflow="hidden" marginRight="m_16">
          <Image
            source={{
              uri: 'https://www.programme-tv.net/imgre/fit/~1~tel~2023~06~08~0969f748-fad7-445d-9023-c3fbd37ac987.jpeg/720x405/crop-from/top/quality/80/focus-point/637,202/jeffrey-dahmer-les-confidences-d-un-serial-killer-13-octobre.jpg',
            }}
            style={{ width: '100%', height: '100%' }}
          />
        </Box>
        <Box>
          <Text variant="subtitle" color="gray">
            Deliver to
          </Text>
          <Text variant="body" color="black">
            Your Destination
          </Text>
        </Box>
      </Box>
      <FlatList
        ListHeaderComponent={Header}
        data={sectionsWithData}
        renderItem={({ item }) => <RecipeSections section={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </Box>
  );
};
