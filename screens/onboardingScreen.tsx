import { View, StyleSheet, Text, ImageBackground } from 'react-native';
import { useState } from 'react';
import { Redirect, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '~/components/Button';
import { HorizontalSlider } from '~/components/HorizontalSlider';
import { LinearGradient } from 'expo-linear-gradient';

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
      router.push('/(tabs)');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 91 }]}>
      <HorizontalSlider 
        items={slides}
        currentIndex={currentSlide}
        onSlideChange={setCurrentSlide}
      />
      {currentSlide === slides.length - 1 && (
        <Button 
          title="Commencer" 
          onPress={handleFinish} 
          style={[
            styles.button,
            { 
              marginBottom: insets.bottom + 16
            }
          ]} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  title: {
    // poppins
    fontFamily: 'Poppins',
  },
  description: {
    // monserrat
    fontFamily: 'Monserrat'
  },
  button: {
    position: 'absolute',
    bottom: 0,
    left: 51,
    right: 51,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
});
