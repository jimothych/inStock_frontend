import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import theme from "../global/theme";
import { GlobalStyles } from "../global/global";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FlashList } from '@shopify/flash-list';
import { api } from "../redux/apiSlice";
import type { Receipt } from "../redux/apiSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";

export default function ReceiptsFlashList() {
  const dispatch = useDispatch();
  const receipts = useSelector((state: RootState) => state.user.receiptsList); //changes w/ redux store
  const isGlobalLoading = useSelector((state: RootState) => state.user.isGlobalLoading);

  //1. scroll up
  //2. call onRefresh, invalidates cache
  //3. rtk queries in Main are triggered to call again
  //4. the useEffects in Main catch the current isGlobalLoading state
  //5. receiptsList and currentNumProcessingDocuments update accordingly
  //6. isGlobalLoading state back to false because queries completed
  const onRefresh = useCallback(() => {
    dispatch(api.util.invalidateTags(["Receipts", "CurrentNumProcessingDocs"]));
  }, [dispatch]);

  if (!receipts || receipts.length === 0) {
    return (
      <Text style={[GlobalStyles.italic, styles.none]}>
        Start uploading receipts to see analytics!
      </Text>
    );
  }

  return (
    <FlashList<Receipt>
      data={receipts}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => <ReceiptRow receipt={item} />}
      style={{ flex: 1, width: "100%" }}
      onRefresh={onRefresh}
      refreshing={isGlobalLoading}
    />
  );
}

function ReceiptRow({receipt}: {receipt: Receipt}) {
  return (
    <View style={styles.parent}>
      <View style={styles.child1}>
        <Ionicons name="images" color={theme.white2} size={35} />
      </View>

      <View style={styles.child2}>
        <Text style={[GlobalStyles.r, { color: theme.white2 }]}>{receipt.transaction_date_time}</Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[GlobalStyles.light_italic, { color: theme.white1 }]}
        >
          {`${receipt.unit_description} ${receipt.price}`}
        </Text>
      </View>

      <View style={styles.child3}>
        <TouchableOpacity>
          <Ionicons name="trash" color={theme.grey1} size={22} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  parent:{
    width: "100%",
    height: 80,
    flexDirection: "row",
  },
  child1: {
    width: "10%",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 5,
  },
  child2: {
    width: "80%",
    flexDirection: "column",
    justifyContent: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.grey2,
  },
  child3: {
    width: "10%",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    paddingRight: 15,
    paddingTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.grey2,
  },
  none: {
    color: theme.white3,
    marginTop: 50,
  }
});