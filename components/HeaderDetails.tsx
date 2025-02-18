import { MaterialIcons, Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Box, Text } from 'theme';

export const HeaderDetails = () => {
  return (
    <Box 
      flexDirection="row" 
      justifyContent="space-between" 
      alignItems="center" 
      paddingHorizontal="ml_24"
      paddingVertical="ml_24">
      <TouchableOpacity onPress={() => router.back()}>
        <MaterialIcons name="keyboard-arrow-left" size={35} color="black" />
      </TouchableOpacity>
      <Text variant="title" fontSize={20}>
        Food Details
      </Text>
      <TouchableOpacity>
        <Entypo name="dots-three-horizontal" size={24} color="black" />
      </TouchableOpacity>
    </Box>
  );
};
