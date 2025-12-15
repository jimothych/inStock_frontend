import { GoogleSignin, statusCodes, isErrorWithCode, isSuccessResponse, User } from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';
import { showDefaultToast } from './global/global';
import { UserState } from './redux/userSlice';

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
            text1: "EXITED GOOGLE SIGN IN",
            visibilityTime: 2000,
          });
          break;
        case statusCodes.IN_PROGRESS:
          Toast.show({
            type: 'error',
            text1: "ERROR: ALREADY IN PROGRESS",
            text2: "Please Try Again",
            visibilityTime: 4000,
          });
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          Toast.show({
            type: 'error',
            text1: "ERROR: PLAY SERVICES UNAVAILABLE",
            text2: "Please Try Again",
            visibilityTime: 4000,
          });
          break;
        default:
        //showDefaultToast(); //do nothing
      }
    } else { 
      //showDefaultToast(); //do nothing
    }
    throw error;
  }
}

export function mapPayload(payload: User): UserState {
  let photoURL = payload.user.photo;
  if(photoURL) { //upping pixel quality
    photoURL = photoURL.replace(/=s\d+-c$/, '=s300-c');
  }

  return {
    id: payload.user.id,
    name: payload.user.name,
    email: payload.user.email,
    photo: photoURL ?? null,
    receiptsList: null,
    currentNumProcessingDocs: 0,
  };
}