import { View, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Redirect, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '~/components/Button';
import { HorizontalSlider } from '~/components/HorizontalSlider';

const slides = [
  {
    title: 'Bienvenue sur Recipe-it',
    description: 'Découvrez des milliers de recettes délicieuses',
    image: { uri: 'https://www.foodandwine.com/thmb/fjNakOY7IcuvZac1hR3JcSo7vzI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/FAW-recipes-pasta-sausage-basil-and-mustard-hero-06-cfd1c0a2989e474ea7e574a38182bbee.jpg' },
  },
  {
    title: 'Créez vos recettes',
    description: 'Partagez vos meilleures recettes avec la communauté',
    image: { uri: 'https://media.istockphoto.com/id/522279541/photo/group-of-young-friends-enjoying-meal-in-outdoor-restaurant.jpg?s=612x612&w=0&k=20&c=ivazxF9oE1IYRuuYN9AI-Y1uibu6U21Gt8Nb1Pqvhhs=' },
  },
  {
    title: 'Organisez vos repas',
    description: 'Planifiez vos repas et générez votre liste de courses',
    image: { uri: 'https://maisonpapille.fr/wp-content/uploads/2022/08/maison_papille_recrutement_chef_photoslide10.jpeg' },
  },
];

export const OnboardingScreen = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const insets = useSafeAreaInsets();

  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem('is_onboarded', 'true');
      router.push('/(tabs)')
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 91, paddingBottom: insets.bottom + 16 }]}>
      <HorizontalSlider 
        items={slides}
        currentIndex={currentSlide}
        onSlideChange={setCurrentSlide}
      />
      {currentSlide === slides.length - 1 && (
        <Button 
          title="Commencer" 
          onPress={handleFinish} 
          style={{ 
            marginHorizontal: 51,
            marginBottom: insets.bottom
          }} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
