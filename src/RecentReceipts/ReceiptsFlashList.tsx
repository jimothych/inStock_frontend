import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import theme from "../global/theme";
import { GlobalStyles } from "../global/global";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FlashList } from '@shopify/flash-list';
import type { Receipt } from "../redux/apiSlice";
import { useSelector, useDispatch } from "react-redux";
import { MainContext } from "../global/MainContext";
import { RootState } from "../redux/store";
import { deleteReceipt } from "../redux/userSlice";
import { useDeleteReceiptItemMutation } from "../redux/apiSlice";

export default function ReceiptsFlashList(){
  const context = useContext(MainContext);
  const userSlice = useSelector((state: RootState) => state.user);
  const [localRefreshing, setLocalRefreshing] = useState(false);
  
  const dataValid: boolean = !!userSlice.receiptsList && 
                            userSlice.receiptsList.length > 0;
  const data = dataValid ? userSlice.receiptsList : [{ dummy: true } as any];

  const handleRefresh = useCallback(() => {
    setLocalRefreshing(true);
    context?.onRefresh();
  }, [context]);

  useEffect(() => {
    if (!context?.isLoading) {
      setLocalRefreshing(false);
    }
  }, [context?.isLoading]);

  return (
    <>
      <FlashList<Receipt>
        data={data}
        keyExtractor={(item) => item.receipt_id}
        renderItem={({ item }) =>
          dataValid ? (
            <ReceiptRow receipt={item} />
          ) : (
            <Text style={[GlobalStyles.italic, styles.none]}>
              Start uploading receipts to see inventory analytics!
            </Text>
          )
        }
        style={{ flex: 1, width: "100%" }}
        onRefresh={handleRefresh}
        refreshing={localRefreshing}
      />
    </>
  );
}

function ReceiptRow({receipt}: {receipt: Receipt}) {
  const dispatch = useDispatch();
  const [deleteReceiptItem] = useDeleteReceiptItemMutation();

  const description = `${receipt.unit_description} | Price: $${receipt.price} | Quantity: ${receipt.quantity}`;

  function del() {
    console.log(`fire-and-forget deleting ${receipt.receipt_id}`)
    dispatch(deleteReceipt(receipt.receipt_id));
    deleteReceiptItem(receipt.receipt_id);
  }

  function alertUser() {
    Alert.alert(`Delete Receipt Item [${receipt.transaction_date_time}]`, description, [
      {
        text: 'Cancel',
        onPress: () => console.log('delete canceled'),
        style: 'cancel',
      },
      {
        text: 'OK', 
        onPress: del
      },
    ]);
  }

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
          {description}
        </Text>
      </View>

      <View style={styles.child3}>
        <TouchableOpacity onPress={alertUser}>
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
    marginTop: 150,
    alignSelf: "center",
  }
});