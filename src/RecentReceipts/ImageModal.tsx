import React, { useRef, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Text, StyleSheet, Modal, View, Image, Pressable } from 'react-native';
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import * as ImagePicker from 'expo-image-picker';
import theme from "../global/theme";
import { GlobalStyles } from "../global/global";
import UploadFilesComponent from "./UploadFilesComponent";

type ImageModalProps = {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  imagePickerAssets: ImagePicker.ImagePickerAsset[];
}
export default function ImageModal({ modalVisible, setModalVisible, imagePickerAssets }: ImageModalProps) {
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };
  const data = useMemo(() => 
    [...new Array(imagePickerAssets.length).keys()],
    [imagePickerAssets.length]
  );

  return (
    <Modal 
      animationType="none" 
      transparent={true} 
      visible={modalVisible}
    >
      <View style={styles.modalBackdrop}> 
        <View style={styles.modalContent}>
        <Carousel
          ref={ref}
          style={styles.carouselContainer}
          data={data}
          width={350}
          height={500}
          onProgressChange={progress}
          renderItem={({ index }) => (
            <View key={index} style={styles.imageContainer}>
              <Image 
                source={{ uri: imagePickerAssets[index].uri }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
                onError={(e) => console.log('Image error:', e.nativeEvent.error)}
                onLoad={() => console.log(`Image ${index} loaded: ${imagePickerAssets[index].uri}`)}
                fadeDuration={100}
              />
            </View>
          )}
        />

        <Pagination.Basic
          progress={progress}
          data={data}
          dotStyle={styles.dotStyle}
          activeDotStyle={styles.activeDotStyle}
          containerStyle={{ gap: 7, marginTop: 15 }}
          onPress={onPressPagination}
        />
      </View>

      <UploadFilesComponent 
        imagePickerAssets={imagePickerAssets} 
        setModalVisible={setModalVisible}
      />
    </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: theme.white2,
    width: "90%",
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 20,
  },
  carouselContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: theme.grey1,
    borderRadius: 5,
  },
  imageContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: theme.white3,
    alignItems: "center",
    justifyContent: "center",
  },
  dotStyle: {
    width: 25,
		height: 4,
    backgroundColor: theme.purple2
  },
  activeDotStyle: {
    backgroundColor: theme.maroon1, 
    overflow: "hidden"
  }
})