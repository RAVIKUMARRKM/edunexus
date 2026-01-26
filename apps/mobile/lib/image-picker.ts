import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

export interface ImagePickerOptions {
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
  base64?: boolean;
}

export interface ImagePickerResult {
  uri: string;
  base64?: string;
  width?: number;
  height?: number;
}

/**
 * Request camera permissions
 */
async function requestCameraPermissions(): Promise<boolean> {
  if (Platform.OS !== 'web') {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera permission is required to take photos. Please enable it in your device settings.',
        [{ text: 'OK' }]
      );
      return false;
    }
  }
  return true;
}

/**
 * Request media library permissions
 */
async function requestMediaLibraryPermissions(): Promise<boolean> {
  if (Platform.OS !== 'web') {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Media library permission is required to select photos. Please enable it in your device settings.',
        [{ text: 'OK' }]
      );
      return false;
    }
  }
  return true;
}

/**
 * Pick an image from the device's gallery
 */
export async function pickImage(
  options: ImagePickerOptions = {}
): Promise<ImagePickerResult | null> {
  try {
    // Request permissions
    const hasPermission = await requestMediaLibraryPermissions();
    if (!hasPermission) {
      return null;
    }

    // Default options
    const defaultOptions: ImagePickerOptions = {
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: false,
    };

    const finalOptions = { ...defaultOptions, ...options };

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: finalOptions.allowsEditing,
      aspect: finalOptions.aspect,
      quality: finalOptions.quality,
      base64: finalOptions.base64,
    });

    if (result.canceled) {
      return null;
    }

    const asset = result.assets[0];
    return {
      uri: asset.uri,
      base64: asset.base64,
      width: asset.width,
      height: asset.height,
    };
  } catch (error) {
    console.error('Error picking image:', error);
    Alert.alert('Error', 'Failed to pick image. Please try again.');
    return null;
  }
}

/**
 * Take a photo using the device's camera
 */
export async function takePhoto(
  options: ImagePickerOptions = {}
): Promise<ImagePickerResult | null> {
  try {
    // Request permissions
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) {
      return null;
    }

    // Default options
    const defaultOptions: ImagePickerOptions = {
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: false,
    };

    const finalOptions = { ...defaultOptions, ...options };

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: finalOptions.allowsEditing,
      aspect: finalOptions.aspect,
      quality: finalOptions.quality,
      base64: finalOptions.base64,
    });

    if (result.canceled) {
      return null;
    }

    const asset = result.assets[0];
    return {
      uri: asset.uri,
      base64: asset.base64,
      width: asset.width,
      height: asset.height,
    };
  } catch (error) {
    console.error('Error taking photo:', error);
    Alert.alert('Error', 'Failed to take photo. Please try again.');
    return null;
  }
}

/**
 * Show action sheet to choose between camera and gallery
 */
export async function pickImageWithOptions(
  options: ImagePickerOptions = {}
): Promise<ImagePickerResult | null> {
  return new Promise((resolve) => {
    Alert.alert(
      'Select Photo',
      'Choose an option to add a photo',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const result = await takePhoto(options);
            resolve(result);
          },
        },
        {
          text: 'Choose from Gallery',
          onPress: async () => {
            const result = await pickImage(options);
            resolve(result);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => resolve(null),
        },
      ],
      { cancelable: true }
    );
  });
}

/**
 * Compress image to reduce file size
 */
export async function compressImage(
  uri: string,
  quality: number = 0.7
): Promise<ImagePickerResult | null> {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality,
      base64: false,
    });

    if (result.canceled) {
      return null;
    }

    const asset = result.assets[0];
    return {
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
    };
  } catch (error) {
    console.error('Error compressing image:', error);
    return null;
  }
}

/**
 * Get image dimensions
 */
export async function getImageDimensions(
  uri: string
): Promise<{ width: number; height: number } | null> {
  try {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        resolve(null);
      };
      img.src = uri;
    });
  } catch (error) {
    console.error('Error getting image dimensions:', error);
    return null;
  }
}
