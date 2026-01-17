import React, { useEffect, useState, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import theme from "../global/theme";
import type { Receipt } from "../redux/apiSlice";
import { GlobalStyles, validateDate } from "../global/global";
import { IntervalOption, Parameters } from "./calculations";
import Dropdown from 'react-native-input-select';
import Ionicons from "@expo/vector-icons/Ionicons";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import ParametersModal from "./ParametersModal";

//label picker 
//https://github.com/azeezat/react-native-select
//options icon w/ popup modal w/ param sliders https://github.com/callstack/react-native-slider
//SegmentedControl
//https://github.com/react-native-segmented-control/segmented-control

type ParametersPickersProps = {
  data: Receipt[];
  parameters: Parameters;
  setParameters: Dispatch<SetStateAction<Parameters>>;
}
export default function ParametersPickers({ data, parameters, setParameters }: ParametersPickersProps) {
  const unitDescriptions: DropdownUnit[] = getUnitDescriptions(data);
  const [selectedIndex, setSelectedIndex] = useState<IntervalOption>(parameters.interval);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setParameters({ ...parameters, interval: selectedIndex });
  }, [selectedIndex]);

  return (
    <View style={styles.box}>
      <View style={styles.row}>
        <Dropdown
          placeholder={parameters.label}
          selectedItemStyle={GlobalStyles.r}
          checkboxControls={{checkboxLabelStyle: GlobalStyles.r}}
          options={unitDescriptions}
          dropdownStyle={styles.dropdown}
          dropdownContainerStyle={styles.dropdownContainer}
          listFooterComponent={<View style={{ height: 30 }}/>}
          selectedValue={parameters.label}
          onValueChange={(value) => {
            if (!value || Array.isArray(value)) return;
            const label = value as string;
            const updatedParameters = { ...parameters, label: label }
            setParameters(updatedParameters)
          }}
          primaryColor={theme.maroon3}
          dropdownIconStyle={{ top: "45%" }}
        />

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="options-outline" color={theme.white2} size={50} />
        </TouchableOpacity>
        <ParametersModal 
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          parameters={parameters}
          setParameters={setParameters}
        />
      </View>

      <SegmentedControl
        values={["1 Week", "1 Month", "3 Months"]}
        selectedIndex={selectedIndex}
        onChange={(event) => {
          setSelectedIndex(event.nativeEvent.selectedSegmentIndex)
        }}
        style={styles.segmentedControl}
        fontStyle={{color: theme.white, fontSize: 15, fontWeight: "normal" }}
        activeFontStyle={{color: theme.white, fontSize: 16, fontWeight: "bold" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "center",
    padding: 6,
  },
  box: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: "100%",
    marginTop: 6,
    marginBottom: 6,
  },
  dropdown: {
    backgroundColor: theme.white3,
    borderRadius: 8,
  },
  dropdownContainer: {
    width: "75%",
    marginBottom: 0,
    marginRight: 15,
  },
  segmentedControl: {
    height: 50, 
    width: "96%",
    marginTop: 5,
    borderRadius: 8,
  }
});

type DropdownUnit = {
  label: string;
  value: string;
}
function getUnitDescriptions(receipts: Receipt[]): DropdownUnit[] {
  let seen = new Set<string>();
  let result: DropdownUnit[] = [];

  for (let i=0; i<receipts.length; i++) {
    let unit = receipts[i].unit_description;
    if (unit !== null && !seen.has(unit)) {
      seen.add(unit);
      result.push({ label: unit, value: unit });
    }
  }

  return result;
}