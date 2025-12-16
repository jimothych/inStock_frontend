import React, { useState } from "react";
import { Text, StyleSheet, Pressable } from 'react-native';
import type { Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";
import { useUploadFilesMutation } from "../redux/apiSlice";
import { RootState } from "../redux/store";
import * as ImagePicker from 'expo-image-picker';
import theme from "../global/theme";
import { GlobalStyles, ensureError } from "../global/global";
import Toast from "react-native-toast-message";
import { ActivityIndicator } from 'react-native-paper';
import * as ImageManipulator from 'expo-image-manipulator';

type ImageModalProps = {
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  imagePickerAssets: ImagePicker.ImagePickerAsset[];
}
//need to compress images w/ expo-image-manipulator
//convert to jpg, set up FormData
//also will handle Toasts after error or success
//render a spinner w/ hang tight text while loading
export default function UploadFilesComponent({ setModalVisible, imagePickerAssets }: ImageModalProps) {
  const userSlice = useSelector((state: RootState) => state.user);
  const [uploadFiles] = useUploadFilesMutation();
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileUploads() {
    try {
      setIsUploading(true);

      const formData = await manipulateImages(imagePickerAssets);
      const payload = { userID: userSlice.id!, formData: formData };
      await uploadFiles(payload).unwrap(); //unwrap to throw 404 as error

      handleModalExit();
    } catch(e) {
      const error = ensureError(e);
      handleModalExit(error);
    }
  }

  async function manipulateImages(imagePickerAssets: ImagePicker.ImagePickerAsset[]): Promise<FormData> {
    const formData = new FormData();
    
    for (let i=0; i<imagePickerAssets.length; i++) {
      const context = ImageManipulator.ImageManipulator.manipulate(imagePickerAssets[i].uri);
      
      const renderedImage = await context.renderAsync();
      const saved = await renderedImage.saveAsync({
        compress: 0.3,
        format: ImageManipulator.SaveFormat.JPEG,
      });
      
      //under the hood second arg is FormDataValue
      //https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Network/FormData.js
      //React Native's native networking layer supposedly reads the file from the local uri and sends it as binary
      formData.append('files', {
        uri: saved.uri,
        type: 'image/jpeg',
        name: `image_${i}.jpg`,
      } as any);
    }

    return formData;
  }

  function handleModalExit(error?: Error) {
    if(error) { console.error(`image modal exited w/ e | ${error.message}`); }
    setIsUploading(false); //maybe not necessary
    setModalVisible(false);

    if(error) {
      Toast.show({
        type: 'error',
        text1: "Error",
        text2: `Upload failed, please try again | ${error.message}`,
        visibilityTime: 4000,
      });
    } else {
      Toast.show({
        type: "success",
        text1: "Success!",
        text2: `Successfully uploaded ${imagePickerAssets.length} files`,
        visibilityTime: 4000,
      });
    }
  }

  let content = null;
  if(isUploading) {
    content = (
      <>
        <Text style={[GlobalStyles.bold, {color: theme.white3}]}>
          Hang tight! Uploading files...
        </Text>
        <ActivityIndicator 
          animating={true} 
          color={theme.cyan} 
          size="small"
        />
      </>
    )
  } else {
    content = (
      <>
      <Pressable 
      style={styles.uploadButton}
      onPress={async() => await handleFileUploads()}
      >
        <Text style={[GlobalStyles.bold, {color: theme.white3}]}>
          UPLOAD IMAGES
        </Text>
      </Pressable>

      <Pressable 
        style={styles.cancelButton}
        onPress={() => setModalVisible(false)}
      >
        <Text style={[GlobalStyles.bold, {color: theme.white3}]}>
          CANCEL
        </Text>
      </Pressable>
      </>
    )
  }

  return content;
}

const styles = StyleSheet.create({
  uploadButton: {
    height: 70, 
    width: "55%", 
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.magenta,
    borderRadius: 16,
    bottom: 35,
  },
  cancelButton: {
    height: 70, 
    width: "55%", 
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.magenta,
    borderRadius: 16,
    bottom: 35,
  },
});