import { ImageBackground } from 'react-native';
import React from 'react';
import { Box, Text } from 'theme';
import { Audio } from 'expo-av';
import { useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export default function SearchScreen() {
  const [sound, setSound] = React.useState<Audio.Sound>();

  async function playSound() {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync(
      require('~/assets/sounds/horror.mp3')
    );
    setSound(newSound);
    await newSound.playAsync();
  }

  useFocusEffect(
    React.useCallback(() => {
      playSound();
      return () => {
        if (sound) {
          sound.stopAsync().then(() => {
            sound.unloadAsync();
          });
        }
      };
    }, [])
  );

  return (
    <ImageBackground 
      source={{ uri: 'https://www.shutterstock.com/image-illustration/creepy-looking-figure-smiling-dark-600nw-2348912379.jpg' }}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <Box flex={1} alignItems="center" justifyContent="center">
        <Text variant="title" color="white" padding="l_32">ce screen n'est pas dans la maquette</Text>
      </Box>
    </ImageBackground>
  );
} 