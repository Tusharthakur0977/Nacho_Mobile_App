import AsyncStorage from '@react-native-async-storage/async-storage';
import iso from 'iso-3166-1';
import {PermissionsAndroid, Platform} from 'react-native';
import {FileSystem} from 'react-native-file-access';
import RNFS from 'react-native-fs';

export function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffleArray(array: any[], arrLength: number = 10) {
  return array
    .map((item: any) => ({item, sortKey: Math.random()})) // Assign random sort keys
    .sort((a: {sortKey: number}, b: {sortKey: number}) => a.sortKey - b.sortKey) // Sort by random sort keys
    .map(({item}) => item)
    .slice(0, arrLength); // Extract the shuffled items
}

// Function to store data
export const storeData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    console.log(`Data stored successfully for key: ${key}`);
  } catch (e) {
    console.error(`Error storing data for key: ${key}`, e);
  }
};

// Function to retrieve data
export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(`Error retrieving data for key: ${key}`, e);
    return null;
  }
};

// Function to remove data
export const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`Data removed successfully for key: ${key}`);
  } catch (e) {
    console.error(`Error removing data for key: ${key}`, e);
  }
};

// Function to clear all data
export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    console.log('All data cleared successfully');
  } catch (e) {
    console.error('Error clearing all data', e);
  }
};

export const getCountryCode = (countryName: string) => {
  // Normalize input for better matching
  const normalizedCountryName = countryName
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

  // Handle specific cases where names differ
  const aliasMapping: Record<string, string> = {
    'united states': 'United States of America',
    us: 'United States of America', // Add any other variations you expect
  };

  const nameToMatch = aliasMapping[normalizedCountryName] || countryName;
  const entry = iso.whereCountry(nameToMatch);
  return entry ? entry.alpha2 : null; // Return 2-letter country code or null
};

export const cleanPayload = (payload: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(payload).filter(
      ([_, value]) => value !== undefined && value !== null && value !== '',
    ),
  );
};

export const downloadFile = async (
  fileUrl: string,
  fileName: string,
  onProgress?: (percentage: string) => void,
): Promise<{path: string; statusCode: number} | null> => {
  // Encode the URL to handle spaces and special characters
  const encodedUrl = encodeURI(fileUrl);
  const {} = RNFS;

  try {
    // Define temporary and final paths
    const tempPath = `${RNFS.TemporaryDirectoryPath}/${fileName}`;
    let finalPath = '';

    // Handle Android permissions and final path
    if (Platform.OS === 'android') {
      if (Platform.Version < 29) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to download files',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          throw new Error('Storage permission denied');
        }
      }
      finalPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
    } else {
      // iOS: Use DocumentDirectory for audio files
      // This makes files accessible to the app and can be shared
      finalPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    }

    // Remove existing files at temp and final paths to avoid conflicts
    if (await RNFS.exists(tempPath)) {
      console.log('Removing existing temp file...');
      await RNFS.unlink(tempPath);
    }
    if (await RNFS.exists(finalPath)) {
      console.log('Removing existing final file...');
      await RNFS.unlink(finalPath);
    }

    // Download file to temporary directory
    const downloadOptions = {
      fromUrl: encodedUrl,
      toFile: tempPath,
      background: true,
      progressDivider: 1,
      progress: (res: {bytesWritten: number; contentLength: number}) => {
        const percentage = (
          (res.bytesWritten / res.contentLength) *
          100
        ).toFixed(2);
        console.log(`Download Progress: ${percentage}%`);
        onProgress?.(percentage);
      },
      headers: {
        'Cache-Control': 'no-cache',
      },
    };

    const result = await RNFS.downloadFile(downloadOptions).promise;

    if (result.statusCode !== 200) {
      throw new Error(`Download failed with status code: ${result.statusCode}`);
    }

    // Verify temp file exists and has content
    const tempFileExists = await RNFS.exists(tempPath);
    if (!tempFileExists) {
      throw new Error('Temporary file not found after download');
    }
    const tempFileStats = await RNFS.stat(tempPath);
    if (tempFileStats.size === 0) {
      await RNFS.unlink(tempPath);
      throw new Error('Downloaded temporary file is empty');
    }

    // Copy file from temporary directory to final destination
    if (Platform.OS === 'android') {
      // Use FileSystem.cpExternal for Android Downloads folder
      await FileSystem.cpExternal(tempPath, fileName, 'downloads');
    } else {
      // On iOS, move directly to Documents directory
      await RNFS.moveFile(tempPath, finalPath);

      // For iOS, log the file URL that can be used to access the file
      const fileUrl = `file://${finalPath}`;
      console.log('iOS file URL:', fileUrl);
    }

    // Verify final file exists
    const finalFileExists = await RNFS.exists(finalPath);
    if (!finalFileExists) {
      throw new Error('File not found in final destination after copy');
    }

    console.log('File successfully downloaded and copied to:', finalPath);
    return {
      path: finalPath,
      statusCode: result.statusCode,
    };
  } catch (error) {
    console.error('Download error:', error);

    return null;
  } finally {
    // Clean up temporary file if it still exists
    const tempPath = `${RNFS.TemporaryDirectoryPath}/${fileName}`;
    if (await RNFS.exists(tempPath)) {
      await RNFS.unlink(tempPath).catch(err =>
        console.warn('Failed to clean up temp file:', err),
      );
    }
  }
};

// Function to calculate region based on itenaryMapPins
export const calculateRegion = (
  pins: any,
  fallback = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  },
) => {
  if (!pins || pins.length === 0) {
    return fallback;
  }

  if (pins.length === 1) {
    return {
      latitude: pins[0].lat,
      longitude: pins[0].lon,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    };
  }

  const latitudes = pins.map((pin: any) => pin.lat);
  const longitudes = pins.map((pin: any) => pin.lon);

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLon = Math.min(...longitudes);
  const maxLon = Math.max(...longitudes);

  const latitude = (minLat + maxLat) / 2;
  const longitude = (minLon + maxLon) / 2;
  const latitudeDelta = (maxLat - minLat) * 1.2; // 20% padding
  const longitudeDelta = (maxLon - minLon) * 1.2; // 20% padding

  return {
    latitude,
    longitude,
    latitudeDelta: latitudeDelta || 0.015, // Fallback for single point
    longitudeDelta: longitudeDelta || 0.0121, // Fallback for single point
  };
};

export function extractPhoneNumber(input: string) {
  const match = input.match(/\+\d{1,4}(\d{6,15})/);
  return match ? match[1] : null;
}

export const getEmbedUrl = (youtubeWatchUrl: string) => {
  try {
    const url = new URL(youtubeWatchUrl);
    const videoId = url.searchParams.get('v');
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch (e) {
    console.error('Invalid YouTube URL:', youtubeWatchUrl, e);
  }
  return null; // Return null for invalid or non-YouTube links
};

export function extractYouTubeVideoID(url: string) {
  const match = url.match(/embed\/([^?]+)/);
  return match ? match[1] : null;
}

// Validation helpers
export const isValidEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidPhone = (phone: string) => {
  const regex = /^[0-9]{7,15}$/; // allow 7–15 digits
  return regex.test(phone);
};

export const isValidPassword = (password: string) => {
  return password.length >= 8; // only check for min length
};

// Helper function to convert metafield values to arrays
export const metaToArray = (val?: string | null): string[] => {
  if (!val) return [];
  try {
    const parsed = JSON.parse(val);
    if (Array.isArray(parsed)) return parsed.map(String);
    if (parsed == null) return [];
    return [String(parsed)];
  } catch {
    // not JSON, return as single value
    return [String(val)];
  }
};

// Helper function to normalize duration values
export const normalizeDuration = (val?: string | null): string | null => {
  if (!val) return null;
  // if it already contains day/night text, don't append "Days"
  if (/\bday|night/i.test(val)) return val;
  return `${val} Days`;
};

export const formatPrice = (value: string) => {
  if (!value.includes('$')) return value;

  const number = parseFloat(value.replace('$', '').trim());

  return `$ ${new Intl.NumberFormat('en-US').format(number)}`;
};
