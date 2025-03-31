import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '~/components/Button';
import { HorizontalSlider } from '~/components/HorizontalSlider';

const slides = [
  {
    title: 'Bienvenue sur Recipe-it',
    description: 'Découvrez des milliers de recettes délicieuses',
    image: {
      uri: 'https://www.foodandwine.com/thmb/fjNakOY7IcuvZac1hR3JcSo7vzI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/FAW-recipes-pasta-sausage-basil-and-mustard-hero-06-cfd1c0a2989e474ea7e574a38182bbee.jpg',
    },
  },
  {
    title: 'Créez vos recettes',
    description: 'Partagez vos meilleures recettes avec la communauté',
    image: {
      uri: 'https://media.istockphoto.com/id/522279541/photo/group-of-young-friends-enjoying-meal-in-outdoor-restaurant.jpg?s=612x612&w=0&k=20&c=ivazxF9oE1IYRuuYN9AI-Y1uibu6U21Gt8Nb1Pqvhhs=',
    },
  },
  {
    title: 'Organisez vos repas',
    description: 'Planifiez vos repas et générez votre liste de courses',
    image: {
      uri: 'https://maisonpapille.fr/wp-content/uploads/2022/08/maison_papille_recrutement_chef_photoslide10.jpeg',
    },
  },
];

export const OnboardingScreen = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const insets = useSafeAreaInsets();

  // Animation: bouton qui monte depuis le bas de l'écran
  const buttonTranslateY = useSharedValue(100);

  useEffect(() => {
    if (currentSlide === slides.length - 1) {
      setShowButton(true);
      buttonTranslateY.value = withSpring(0, {
        damping: 15,
        stiffness: 100,
      });
    } else {
      buttonTranslateY.value = 100;
      setShowButton(false);
    }
  }, [currentSlide]);

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: buttonTranslateY.value }],
      opacity: 1 - buttonTranslateY.value / 100,
    };
  });

  const handleFinish = async () => {
    try {
      // Enregistre que l'onboarding a été complété
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
      {showButton && (
        <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
          <Button
            title="Get started"
            onPress={handleFinish}
            style={{
              marginBottom: insets.bottom + 1,
            }}
          />
        </Animated.View>
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
    fontFamily: 'Monserrat',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 51,
    right: 51,
  },
  button: {
    // Cette propriété est transférée à buttonContainer
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
});
