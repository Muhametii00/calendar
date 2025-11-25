import ReactNativeBiometrics from 'react-native-biometrics';
import { Platform } from 'react-native';

const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: true,
});

export interface BiometricResult {
  success: boolean;
  error?: string;
}

export async function isBiometricAvailable(): Promise<boolean> {
  try {
    const { available } = await rnBiometrics.isSensorAvailable();
    return available;
  } catch (error) {
    console.error('Error checking biometric availability:', error);
    return false;
  }
}

export async function getBiometricType(): Promise<string | null> {
  try {
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    return available ? biometryType ?? null : null;
  } catch (error) {
    console.error('Error getting biometric type:', error);
    return null;
  }
}

export async function authenticateWithBiometrics(
  promptMessage: string = 'Authenticate to continue',
): Promise<BiometricResult> {
  try {
    const { available } = await rnBiometrics.isSensorAvailable();

    if (!available) {
      return {
        success: false,
        error: 'Biometric authentication is not available on this device',
      };
    }

    if (Platform.OS === 'ios') {
      await new Promise<void>(resolve => setTimeout(resolve, 50));
    }

    const promptOptions: any = {
      promptMessage,
      fallbackPromptMessage: 'Use passcode',
    };

    // Add cancel button text for iOS
    if (Platform.OS === 'ios') {
      promptOptions.cancelButtonText = 'Cancel';
    }

    const result = await rnBiometrics.simplePrompt(promptOptions);

    if (result.success) {
      return { success: true };
    }

    if (
      !result.error ||
      result.error === 'User cancellation' ||
      result.error === 'UserCancel'
    ) {
      return {
        success: false,
        error: 'User cancelled authentication',
      };
    }

    const errorMessage = result.error || 'Biometric authentication failed';

    if (
      errorMessage.includes('cancel') ||
      errorMessage.includes('Cancel') ||
      errorMessage.includes('UserCancel')
    ) {
      return {
        success: false,
        error: 'User cancelled authentication',
      };
    }

    return {
      success: false,
      error: errorMessage,
    };
  } catch (error: any) {
    console.error('Biometric authentication error:', error);

    const errorMessage =
      error?.message ||
      error?.toString() ||
      'An error occurred during biometric authentication';

    const errorCode = error?.code;
    const isUserCancellation =
      errorMessage.includes('cancel') ||
      errorMessage.includes('Cancel') ||
      errorMessage.includes('UserCancel') ||
      errorCode === 'UserCancel' ||
      errorCode === -128 ||
      String(errorCode) === '-128';

    if (isUserCancellation) {
      return {
        success: false,
        error: 'User cancelled authentication',
      };
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export function getBiometricName(biometryType: string | null): string {
  switch (biometryType) {
    case 'FaceID':
      return 'Face ID';
    case 'TouchID':
      return 'Touch ID';
    case 'Biometrics':
      return 'Biometric';
    default:
      return 'Biometric';
  }
}
