import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import theme from "../global/theme";
import { ReceiptItem, ReceiptsListT } from "./Uploads";
import { List } from 'react-native-paper'
import { GlobalStyles } from "../global/global";

type ListProps = {
  receipts: ReceiptsListT;
};
export default function ReceiptsList({receipts}: ListProps) {
  return (
  <ScrollView>
  <List.AccordionGroup>
    {receipts.map((receipt: ReceiptItem, index: number) => (
      <List.Accordion
        key={index}
        id={index.toString()}
        title={receipt.date}
        titleStyle={[GlobalStyles.r, { color: theme.white2 }]}
        left={props => <List.Icon 
          {...props} 
          icon="file-image-outline"
          color={theme.magenta}
        />}
        style={styles.title}
      >
        {receipt.items.map((item, idx) => (
          <List.Item
            key={idx}
            title={`${item.item_name} ${item.price}`}
            titleStyle={[GlobalStyles.light_italic, { color: theme.white1 }]}
            style={styles.item}
          />
        ))}
      </List.Accordion>
    ))}
  </List.AccordionGroup>
  </ScrollView>
  );
}

const styles = StyleSheet.create({
  parent:{
    width: "100%",
    height: "auto",
  },
  title: {
    width: 410,
    borderBottomWidth: 1,
    borderBottomColor: theme.grey2,
    height: 80,
    backgroundColor: theme.purple2,
    justifyContent: "center",
  },
  item: {
    width: 410,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: theme.purple1,
    backgroundColor: theme.purple2,
    justifyContent: "center",
  }
});