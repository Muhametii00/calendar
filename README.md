# Calendar App

A React Native calendar application with Firebase authentication, biometric security, and event management.

## Prerequisites

Before you begin, ensure you have the following software installed on your development machine:

### Core Requirements

- **Node.js**: >= 20.0.0
- **npm** or **yarn** (latest version recommended)
- **TypeScript**: ^5.8.3

### React Native & Core Dependencies

- **React**: 19.1.1
- **React Native**: 0.82.1
- **@react-native-community/cli**: 20.0.0

### Android Development

- **Android Studio**: Latest stable version
- **Gradle**: 9.0.0
- **Android Build Tools**: 36.0.0
- **Android SDK**:
  - Minimum SDK Version: 24
  - Compile SDK Version: 36
  - Target SDK Version: 36
- **NDK**: 27.1.12297006
- **Kotlin**: 2.1.20
- **Google Services Plugin**: 4.4.0
- **Firebase BOM**: 34.6.0

### iOS Development

- **Xcode**: Latest stable version (compatible with iOS 15.1+)
- **iOS Deployment Target**: 15.1
- **Swift**: 5.0
- **CocoaPods**: >= 1.13.0 (excluding 1.15.0 and 1.15.1)
- **Ruby**: >= 2.6.10

### Additional Tools

- **Java Development Kit (JDK)**: Required for Android development
- **Watchman** (optional but recommended): For better file watching performance

## Installation

### 1. Clone the Repository

```sh
git clone <repository-url>
cd calendar
```

### 2. Install Node Dependencies

```sh
npm install
# OR
yarn install
```

### 3. iOS Setup

If you're developing for iOS, install CocoaPods dependencies:

```sh
# Install Ruby dependencies (first time only)
bundle install

# Install CocoaPods dependencies
cd ios
bundle exec pod install
cd ..
```

## Running the Application

### Start Metro Bundler

```sh
npm start
# OR
yarn start
```

### Run on Android

```sh
npm run android
# OR
yarn android
```

**Requirements:**

- Android emulator running, OR
- Android device connected via USB with USB debugging enabled

### Run on iOS

```sh
npm run ios
# OR
yarn ios
```

**Requirements:**

- macOS with Xcode installed
- iOS Simulator available, OR
- iOS device connected (requires Apple Developer account for physical devices)

## Project Structure

```
calendar/
├── android/          # Android native code
├── ios/              # iOS native code
├── src/
│   ├── components/   # Reusable React components
│   ├── config/       # Configuration files (Firebase, etc.)
│   ├── constants/    # App constants
│   ├── context/      # React Context providers
│   ├── navigation/   # Navigation configuration
│   ├── screens/      # Screen components
│   ├── styles/       # Style definitions
│   └── utils/        # Utility functions
├── App.tsx           # Main app component
└── package.json      # Dependencies and scripts
```

## Key Dependencies

### Core Libraries

- **@react-navigation/native**: ^7.1.21 - Navigation library
- **@react-navigation/stack**: ^7.6.7 - Stack navigator
- **@react-navigation/bottom-tabs**: ^7.8.6 - Bottom tabs navigator

### Firebase

- **@react-native-firebase/app**: ^23.5.0
- **@react-native-firebase/auth**: ^23.5.0
- **@react-native-firebase/firestore**: ^23.5.0

### UI & Utilities

- **react-native-vector-icons**: ^10.3.0
- **react-native-biometrics**: ^3.0.1
- **@react-native-async-storage/async-storage**: ^2.2.0
- **@react-native-community/blur**: ^4.4.1
- **moment**: ^2.30.1
- **yup**: ^1.7.1

## Development Scripts

- `npm start` - Start Metro bundler
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## Troubleshooting

### Common Issues

1. **Metro bundler cache issues**: Clear cache with `npm start -- --reset-cache`
2. **iOS build failures**: Run `cd ios && bundle exec pod install && cd ..`
3. **Android build failures**: Clean build with `cd android && ./gradlew clean && cd ..`
4. **Node version mismatch**: Ensure Node.js >= 20 is installed

### Platform-Specific Issues

#### Android

- Ensure Android SDK and build tools are properly installed
- Check that `ANDROID_HOME` environment variable is set
- Verify Java/JDK version compatibility

#### iOS

- Ensure Xcode Command Line Tools are installed: `xcode-select --install`
- Verify CocoaPods version: `pod --version`
- Clean build folder in Xcode if experiencing build issues

## Environment Setup

### Android Environment Variables

Add to your `~/.zshrc` or `~/.bash_profile`:

```sh
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### iOS Environment

No additional environment variables required, but ensure:

- Xcode is properly installed and configured
- iOS Simulator is available
- Apple Developer account (for device deployment)

## Version Compatibility

This project has been tested with the following versions:

| Component             | Version                              |
| --------------------- | ------------------------------------ |
| Node.js               | >= 20.0.0                            |
| React                 | 19.1.1                               |
| React Native          | 0.82.1                               |
| TypeScript            | ^5.8.3                               |
| Gradle                | 9.0.0                                |
| Kotlin                | 2.1.20                               |
| iOS Deployment Target | 15.1                                 |
| Swift                 | 5.0                                  |
| CocoaPods             | >= 1.13.0 (excluding 1.15.0, 1.15.1) |
| Ruby                  | >= 2.6.10                            |

## Additional Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Navigation Documentation](https://reactnavigation.org/)
- [Firebase React Native Documentation](https://rnfirebase.io/)
- [React Native Environment Setup](https://reactnative.dev/docs/environment-setup)

<img width="500" height="500" alt="Simulator Screenshot - iPhone 16 Pro - 2025-11-26 at 14 07 36" src="https://github.com/user-attachments/assets/31a9586b-dfd6-4454-a3d9-db671aed5b17" /><img width="500" height="500" alt="Simulator Screenshot - iPhone 16 Pro - 2025-11-26 at 14 07 39" src="https://github.com/user-attachments/assets/e755fa1d-a209-431f-acf0-6f47ec24dbb0" />
