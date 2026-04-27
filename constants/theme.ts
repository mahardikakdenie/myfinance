/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#FF2D78';
const tintColorDark = '#FF2D78';

export const Colors = {
  light: {
    text: '#1A1A1A',
    secondaryText: '#737373',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    tint: tintColorLight,
    icon: '#A3A3A3',
    tabIconDefault: '#A3A3A3',
    tabIconSelected: tintColorLight,
    income: '#34C759',
    expense: '#FF3B30',
    border: '#E5E5E5',
  },
  dark: {
    text: '#F5F5F5',
    secondaryText: '#A3A3A3',
    background: '#121212',
    surface: '#1E1E1E',
    tint: tintColorDark,
    icon: '#737373',
    tabIconDefault: '#737373',
    tabIconSelected: tintColorDark,
    income: '#32D74B',
    expense: '#FF453A',
    border: '#262626',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
