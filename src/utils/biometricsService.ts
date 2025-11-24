import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: true,
});

export interface BiometricResult {
  success: boolean;
  error?: string;
}

// Check if biometrics is available on the device
export async function isBiometricAvailable(): Promise<boolean> {
  try {
    const { available } = await rnBiometrics.isSensorAvailable();
    return available;
  } catch (error) {
    console.error('Error checking biometric availability:', error);
    return false;
  }
}

// Get the type of biometric available (Face ID, Touch ID, Fingerprint, etc.)

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

    const { success, error } = await rnBiometrics.simplePrompt({
      promptMessage,
      fallbackPromptMessage: 'Use passcode',
    });

    if (success) {
      return { success: true };
    } else {
      return {
        success: false,
        error: error || 'Biometric authentication failed',
      };
    }
  } catch (error: any) {
    console.error('Biometric authentication error:', error);
    return {
      success: false,
      error:
        error?.message || 'An error occurred during biometric authentication',
    };
  }
}

// Get a user-friendly name for the biometric type
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
