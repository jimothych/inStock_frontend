import React, { useState  } from "react";
import { Text, TouchableOpacity, StyleSheet, Modal, Alert, View } from 'react-native';
import theme from "../global/theme";
import { Surface } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from 'expo-image-picker';
import ImageModal from "./ImageModal";

export default function AddImageButton() {
  const [modalVisible, setModalVisible] = useState(false);
  const [imagePickerAssets, setImagePickerAssets] = useState<ImagePicker.ImagePickerAsset[]>([]);

  async function handlePickImages() {
    console.log("\tpicking images from photo library...")
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.'); //Alert defaults w/ OK option
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      allowsMultipleSelection: true,
      quality: 1,
    });
    if(result.canceled) return;

    const files: ImagePicker.ImagePickerAsset[] = result.assets;
    setImagePickerAssets(files);
    setModalVisible(true);
  }

  return (
    <>
    <ImageModal 
      modalVisible={modalVisible} 
      setModalVisible={setModalVisible} 
      imagePickerAssets={imagePickerAssets}
    />
    <TouchableOpacity onPress={async () => handlePickImages()}>
      <Surface style={styles.button} elevation={4}>
        <Ionicons name="add-outline" color={theme.white2} size={70} />
      </Surface>
    </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: "center",
    top: -125,
    backgroundColor: theme.maroon2,
    alignItems: "center",
    justifyContent: "center",
  },
});