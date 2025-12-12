import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from 'react-native';
import theme from "../global/theme";
import { SafeArea, Header } from "../global/global";
import AddImageButton from "./AddImageButton";
import ReceiptsAccordian from "./ReceiptsList";

export type ReceiptItem = {
  date: string;
  items: {
    item_name: string;
    price: string;
  }[];
};
export type ReceiptsListT = ReceiptItem[];

const DATA: ReceiptsListT = [
  {
    date: "11:59am 11/2/25",
    items: [
      {item_name: "blue bike", price: "$392"},
      {item_name: "red bike", price: "$222"},
    ]
  },
  {
    date: "2:02pm 12/5/15",
    items: [
      {item_name: "blue bike", price: "$392"},
      {item_name: "red bike", price: "$222"},
    ]
  },
  {
    date: "9:57pm 12/1/24",
    items: [
      {item_name: "blue bike", price: "$392"},
      {item_name: "red bike", price: "$222"},
    ]
  },
    {
    date: "11:59am 11/2/25",
    items: [
      {item_name: "blue bike", price: "$392"},
      {item_name: "red bike", price: "$222"},
    ]
  },
  {
    date: "2:02pm 12/5/15",
    items: [
      {item_name: "blue bike", price: "$392"},
      {item_name: "red bike", price: "$222"},
    ]
  },
  {
    date: "9:57pm 12/1/24",
    items: [
      {item_name: "blue bike", price: "$392"},
      {item_name: "red bike", price: "$222"},
    ]
  },
    {
    date: "11:59am 11/2/25",
    items: [
      {item_name: "blue bike", price: "$392"},
      {item_name: "red bike", price: "$222"},
    ]
  },
  {
    date: "2:02pm 12/5/15",
    items: [
      {item_name: "blue bike", price: "$392"},
      {item_name: "red bike", price: "$222"},
    ]
  },
  {
    date: "9:57pm 12/1/24",
    items: [
      {item_name: "blue bike", price: "$392"},
      {item_name: "red bike", price: "$222"},
    ]
  },
  
]

export default function Uploads() {
  return (
    <>
      <SafeArea backgroundColor={theme.purple2}>
        <Header text="Uploads" />
        <ReceiptsAccordian receipts={DATA}/>
      </SafeArea>
      <AddImageButton />
    </>
  );
}