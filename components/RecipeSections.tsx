import { FlatList, Pressable } from 'react-native';
import { Box, Text } from 'theme';
import { RecipeCard } from './RecipeCard';
import { Recipe } from '~/types/recipe';

type SectionWithRecipes = {
  id: string;
  title: string;
  subtitle: string;
  recipes: Recipe[];
};

const CARD_WIDTH = 190;
const CARD_HEIGHT = 250;

export const RecipeSections = ({ section }: { section: SectionWithRecipes }) => {
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
        data={section.recipes}
        contentContainerStyle={{ paddingHorizontal: 32 }}
        renderItem={({ item }) => (
          <Box marginRight="m_16">
            <RecipeCard recipe={item} />
          </Box>
        )}
        keyExtractor={(item) => item.idMeal}
      />
    </Box>
  );
};
