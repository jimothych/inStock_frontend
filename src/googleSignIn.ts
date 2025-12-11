import { GoogleSignin, statusCodes, isErrorWithCode, isSuccessResponse, User } from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';
import { showDefaultToast } from './global_components/global';
import { UserState } from './global_components/global';

export async function GSignIn(): Promise<User> {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();

    if (isSuccessResponse(response)) {
      return response.data;
    } else { 
      throw new Error(`Google Sign In Failed | ${response.type}`);
    }
  } catch (error: unknown) {
    console.error(`GOOGLE SIGN IN ERROR: ${error}`);
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          Toast.show({
            type: 'info',
            text1: "Exited Google Sign In",
            visibilityTime: 2000,
          });
          break;
        case statusCodes.IN_PROGRESS:
          Toast.show({
            type: 'error',
            text1: "Error: Already in Progress",
            text2: "Please Try Again",
            visibilityTime: 4000,
          });
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          Toast.show({
            type: 'error',
            text1: "Error: Play Services Unavailable",
            text2: "Please Try Again",
            visibilityTime: 4000,
          });
          break;
        default:
        showDefaultToast();
      }
    } else { 
      showDefaultToast(); 
    }
    throw error;
  }
}

export function mapPayload(payload: User): UserState {
  return {
    id: payload.user.id,
    name: payload.user.name,
    email: payload.user.email,
    photo: payload.user.photo ?? null,
  };
}