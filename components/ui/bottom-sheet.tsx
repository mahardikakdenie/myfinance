import React, { useEffect, useCallback } from 'react';
import { StyleSheet, View, Pressable, Dimensions, Keyboard } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  runOnJS,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number;
}

export function BottomSheet({ visible, onClose, children, height = SCREEN_HEIGHT * 0.5 }: BottomSheetProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const active = useSharedValue(false);

  const scrollTo = useCallback((destination: number) => {
    'worklet';
    active.value = destination !== SCREEN_HEIGHT;
    translateY.value = withSpring(destination, { damping: 20, stiffness: 100 });
  }, []);

  useEffect(() => {
    if (visible) {
      scrollTo(SCREEN_HEIGHT - height);
    } else {
      scrollTo(SCREEN_HEIGHT);
    }
  }, [visible, height, scrollTo]);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateY.value = Math.max(SCREEN_HEIGHT - height + event.translationY, SCREEN_HEIGHT - height - 20);
    })
    .onEnd((event) => {
      if (event.translationY > 100 || event.velocityY > 500) {
        runOnJS(onClose)();
      } else {
        scrollTo(SCREEN_HEIGHT - height);
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const rBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translateY.value,
        [SCREEN_HEIGHT, SCREEN_HEIGHT - height],
        [0, 1],
        Extrapolate.CLAMP
      ),
      display: translateY.value === SCREEN_HEIGHT ? 'none' : 'flex',
    };
  });

  if (!visible && translateY.value === SCREEN_HEIGHT) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={visible ? 'auto' : 'none'}>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, rBackdropStyle]}>
        <Pressable style={styles.flex} onPress={() => {
          Keyboard.dismiss();
          onClose();
        }} />
      </Animated.View>

      {/* Sheet */}
      <GestureDetector gesture={gesture}>
        <Animated.View 
          style={[
            styles.sheet, 
            { height, backgroundColor: theme.background }, 
            rBottomSheetStyle
          ]}>
          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: theme.icon + '40' }]} />
          </View>
          <View style={styles.content}>
            {children}
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
});
