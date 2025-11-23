import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { BlurView } from '@react-native-community/blur';

interface BiometricBlurOverlayProps {
  visible: boolean;
}

export default function BiometricBlurOverlay({
  visible,
}: BiometricBlurOverlayProps) {
  if (!visible) {
    return null;
  }

  if (Platform.OS === 'ios') {
    return (
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="dark"
        blurAmount={10}
        reducedTransparencyFallbackColor="rgba(0, 0, 0, 0.8)"
      />
    );
  }

  // For Android, use a semi-transparent overlay since BlurView may not work as well
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
      ]}
    />
  );
}

