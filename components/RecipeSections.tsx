import { FlatList, Pressable } from 'react-native';
import { Box, Text } from 'theme';
import { Card } from './Card';
import { Recipe, Section } from '~/types/recipe';

const CARD_WIDTH = 190;
const CARD_HEIGHT = 250;

export const RecipeSections = ({ section }: { section: Section }) => {
  const handleSeeAll = () => {
    console.log('See all clicked for:', section.title);
  };

  return (
    <Box marginVertical="m_16">
      <Box 
        flexDirection="row" 
        justifyContent="space-between" 
        alignItems="center"
        marginHorizontal="l_32"
        marginBottom="xs_4">
        <Box flex={1}>
          <Text variant="section" color="black">
            {section.title}
          </Text>
        </Box>
        <Pressable onPress={handleSeeAll}>
          <Text variant="seeAll" color="orange">
            See all
          </Text>
        </Pressable>
      </Box>
      <Text variant="subtitle" color="gray" marginHorizontal="l_32" marginBottom="ml_24">
        {section.subtitle}
      </Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={section.data}
        contentContainerStyle={{ paddingHorizontal: 32 }}
        renderItem={({ item }) => (
          <Box marginRight="m_16">
            <Card
              title={item.title}
              image={item.image}
              subtitle={item.subtitle}
              price={item.price}
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
            />
          </Box>
        )}
        keyExtractor={(item) => item.id}
      />
    </Box>
  );
};
