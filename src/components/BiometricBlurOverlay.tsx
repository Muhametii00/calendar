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

  return (
    <BlurView
      style={StyleSheet.absoluteFill}
      blurType="dark"
      blurAmount={10}
      reducedTransparencyFallbackColor="rgba(0, 0, 0, 0.8)"
    />
  );
}
