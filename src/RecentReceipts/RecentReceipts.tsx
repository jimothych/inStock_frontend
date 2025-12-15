import React from "react";
import theme from "../global/theme";
import { SafeArea, Header } from "../global/global";
import AddImageButton from "./AddImageButton";
import ReceiptsFlashList from "./ReceiptsFlashList";

export default function RecentReceipts() {
  return (
    <>
      <SafeArea backgroundColor={theme.purple2}>
        <Header text="Recent Receipts" />
        <ReceiptsFlashList />
      </SafeArea>
      <AddImageButton />
    </>
  );
}