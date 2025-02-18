import { createTheme, useTheme as useRestyleTheme } from '@shopify/restyle';
import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

type NamedStyles<T> = {
  [P in keyof T]: ViewStyle | TextStyle | ImageStyle;
};

const palette = {
  gray: '#C5C4CB',
  blue: '#007AFF',
  darkGray: '#38434D',
  white: '#FFFFFF',
  black: '#46474B',
  purple: '#6366F1',
  orange: '#EC994B',
  cardBackground: '#FFFFFF',
  shadowColor: '#000000',
  background: '#FFFFFF',
  border: '#F2F2F2',
};

const theme = createTheme({
  colors: {
    ...palette,
    cardBackground: palette.cardBackground,
    shadowColor: palette.shadowColor,
    background: palette.background,
  },
  spacing: {
    xs_4: 4,
    s_8: 8,
    sm_12: 12,
    m_16: 16,
    ml_24: 24,
    l_32: 32,
    xl_64: 64,
  },
  borderRadii: {
    s_3: 3,
    m_6: 6,
    l_12: 12,
    xl_24: 24,
    round: 9999,
  },
  textVariants: {
    buttonText: {
      fontSize: 8,
      fontFamily: 'Poppins-Bold',
    },
    subtitle: {
      fontSize: 12,
      fontFamily: 'Poppins-Regular',
    },
    body: {
      fontSize: 16,
      fontFamily: 'Poppins-Bold',
    },
    bodyRegular: {
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
    },
    title: { fontSize: 24, fontFamily: 'Poppins-Bold' },
    large: {
      fontSize: 36,
      fontFamily: 'Poppins-Regular',
    },
    extra_large: {
      fontSize: 64,
      fontFamily: 'Poppins-Bold',
    },
    section: {
      fontSize: 18,
      fontFamily: 'Poppins-Bold',
    },
    seeAll: {
      fontSize: 14,
      fontFamily: 'Poppins-Bold',
      textDecorationLine: 'underline',
    },
    normal: {
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
    },
    defaults: {
      // We can define a default text variant here.
    },
  },
  buttonVariants: {
    defaults: {
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primary: {
      backgroundColor: 'white',
      borderRadius: 6,
      paddingVertical: 12,
      paddingHorizontal: 24,
    },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: 'white',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 24,
    },
    disabled: {
      backgroundColor: 'gray',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 24,
      opacity: 0.5,
    }
  },
});

export const useTheme = () => {
  return useRestyleTheme<Theme>();
};

export const makeStyles = <T extends NamedStyles<T> | NamedStyles<unknown>>(
  styles: (theme: Theme) => T
) => {
  return () => {
    return styles(theme);
  };
};

export type Theme = typeof theme;
export default theme;
