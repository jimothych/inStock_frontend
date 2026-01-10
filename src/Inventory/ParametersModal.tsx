import React, { useEffect, useState, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Text, StyleSheet, Modal, View, TouchableOpacity } from 'react-native';
import type { Parameters } from "./calculations";
import theme from "../global/theme";
import { GlobalStyles } from "../global/global";
import Slider from '@react-native-community/slider';

type ParameterModalProps = {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  parameters: Parameters;
  setParameters: Dispatch<SetStateAction<Parameters>>;
}
export default function ParametersModal({ modalVisible, setModalVisible, parameters, setParameters }: ParameterModalProps) {
  //const [leadTime, setLeadTime] = useState<number>(parameters.lead_time);
  const [targetFillRate, setTargetFillRate] = useState<number>(parameters.target_fill_rate * 100);
  const [holdingCostPerUnit, setHoldingCostPerUnit] = useState<number>(parameters.holding_cost_per_unit);
  const [backorderCostPerUnit, setBackorderCostPerUnit] = useState<number>(parameters.backorder_cost_per_unit);

  function handleSave() {
    setParameters({
      ...parameters, 
      //lead_time: leadTime, 
      target_fill_rate: targetFillRate / 100,
      holding_cost_per_unit: holdingCostPerUnit,
      backorder_cost_per_unit: backorderCostPerUnit,
    });
    setModalVisible(false);
  }

  function restoreDefaults() {
    //setLeadTime(1);
    setTargetFillRate(95);
    setHoldingCostPerUnit(1);
    setBackorderCostPerUnit(2);
  }

  return (
    <Modal 
      animationType="none" 
      transparent={true} 
      visible={modalVisible}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContent}>

          {/* <View style={styles.sliderWrapper}>
            <Text style={[GlobalStyles.bold, {color: theme.purple2}]}>
              Lead Time (Per Period)
            </Text>
            <Text style={[GlobalStyles.r, {color: theme.purple2}]}>
              {leadTime}
            </Text>
            <Slider
              style={styles.slider}
              step={1}
              value={leadTime}
              minimumValue={0}
              maximumValue={10}
              minimumTrackTintColor={theme.maroon3}
              thumbTintColor={theme.maroon3}
              maximumTrackTintColor={theme.grey2}
              onValueChange={(value) => setLeadTime(value)}
            />
          </View> */}

          <View style={styles.sliderWrapper}>
            <Text style={[GlobalStyles.bold, {color: theme.purple2}]}>
              Target Fill Rate
            </Text>
            <Text style={[GlobalStyles.r, {color: theme.purple2}]}>
              {targetFillRate}%
            </Text>
            <Slider
              style={styles.slider}
              step={1}
              value={targetFillRate}
              minimumValue={0}
              maximumValue={100}
              minimumTrackTintColor={theme.maroon3}
              thumbTintColor={theme.maroon3}
              maximumTrackTintColor={theme.grey2}
              onValueChange={(value) => setTargetFillRate(value)}
            />
          </View>

          <View style={styles.sliderWrapper}>
            <Text style={[GlobalStyles.bold, {color: theme.purple2}]}>
              Holding Cost Per Unit (USD)
            </Text>
            <Text style={[GlobalStyles.r, {color: theme.purple2}]}>
              ${holdingCostPerUnit}
            </Text>
            <Slider
              style={styles.slider}
              step={1}
              value={holdingCostPerUnit}
              minimumValue={0}
              maximumValue={1000}
              minimumTrackTintColor={theme.maroon3}
              thumbTintColor={theme.maroon3}
              maximumTrackTintColor={theme.grey2}
              onValueChange={(value) => setHoldingCostPerUnit(value)}
            />
          </View>

          <View style={styles.sliderWrapper}>
            <Text style={[GlobalStyles.bold, {color: theme.purple2}]}>
              Backorder Cost Per Unit (USD)
            </Text>
            <Text style={[GlobalStyles.r, {color: theme.purple2}]}>
              ${backorderCostPerUnit}
            </Text>
            <Slider
              style={styles.slider}
              step={1}
              value={backorderCostPerUnit}
              minimumValue={0}
              maximumValue={1000}
              minimumTrackTintColor={theme.maroon3}
              thumbTintColor={theme.maroon3}
              maximumTrackTintColor={theme.grey2}
              onValueChange={(value) => setBackorderCostPerUnit(value)}
            />
          </View>

          <View style={styles.buttonsWrapper}>
            <TouchableOpacity 
              style={[styles.button, {backgroundColor: theme.grey1, marginBottom: 10}]} 
              onPress={restoreDefaults}
            >
              <Text style={[GlobalStyles.bold, {color: theme.white3}]}>
                RESTORE DEFAULTS
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, {backgroundColor: theme.maroon3}]} 
              onPress={handleSave}
            >
              <Text style={[GlobalStyles.bold, {color: theme.white3}]}>
                SAVE
              </Text>
            </TouchableOpacity>
          </View>

        </View>
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
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 10,
    padding: 20,
  },
  button: {
    height: "8%", 
    width: "80%", 
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  buttonsWrapper: {
    width: "100%",
    height: "100%",
    position: "absolute",
    bottom: 20,
    // borderColor: "black",
    // borderWidth: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  sliderWrapper: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    // borderColor: "black",
    // borderWidth: 1,
    marginTop: 5,
  },
  slider: {
    width: "90%",
    height: "5%",
    marginTop: 10,
  }
})