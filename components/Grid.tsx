"use client";
import React from "react";
import { useEffect, useState } from "react";
import {
  getOrdersArray,
  addGenStation,
  getMarketPrice,
  getSLRTokenBalance,
} from "../utils";
import Card from "./Card";
import Link from "next/link";
export const GridBackground = () => {
  const [SLRBalance, setSLRBalance] = useState("Fetching ...");
  const [marketPrice, setMarketPrice] = useState("Fetching");
  const [ordersArray, setOrdersArray] = useState<any[]>([]);

  async function handleSLRBalanceUpdate() {
    //console.log("Fetching GW token balance...");
    try {
      const updatedBalance = await getSLRTokenBalance();
      console.log("Fetched balance:", updatedBalance);
      setSLRBalance(updatedBalance);
    } catch (error) {
      console.error("Failed to fetch SLR token balance:", error);
    }
  }

  async function updateArray() {
    const arr = await getOrdersArray();
    //console.log(arr);
    setOrdersArray(arr);
  }

  async function updateMarketPrice() {
    try {
      const updatedPrice = await getMarketPrice();
      console.log("Fetched Market Price:", updatedPrice);
      setMarketPrice(updatedPrice);
    } catch (error) {
      console.error("Failed to fetch SLR token balance:", error);
    }
  }

  useEffect(() => {
    handleSLRBalanceUpdate();
    updateArray();
    updateMarketPrice();
  }, [ordersArray]);
  return (
    <div className="flex flex-col items-center w-full min-h-screen px-2 text-center bg-emerald-500">
      <h1 className="mt-20 font-pixel text-4xl md:text-5xl font-semibold text-white drop-shadow mb-6">
        Buy Some
        <mark className="bg-yellow-400 mx-2 rounded-lg px-3 mr-2">Energy Tokens</mark>
        from SolarNet.
      </h1>
      <div className="bg-white rounded-2xl shadow-[8px_8px_0px_#000] border-4 border-black p-4 md:p-8 w-full max-w-2xl mx-auto flex flex-col gap-4 items-center mt-4">
        <div className="text-2xl md:text-3xl font-extrabold tracking-wide text-center border-2 border-black rounded-xl bg-sky-400 text-black p-3 mb-2 shadow-[4px_4px_0px_#000]">
          You have generated
          <mark className="px-3 rounded-lg bg-white text-emerald-600 mx-2">{SLRBalance}</mark>
          SNT Points
        </div>
        <div className="text-xl md:text-2xl font-extrabold tracking-wide text-center border-2 border-black rounded-xl bg-yellow-400 text-black p-3 mb-2 shadow-[4px_4px_0px_#000]">
          Current Market Price
          <mark className="px-3 rounded-lg bg-white text-green-600 mx-2">{marketPrice}</mark>
          per Token
        </div>
      </div>
      <div className="mt-8 w-full flex flex-wrap justify-center gap-4">
        {ordersArray.map((data) => {
          if (!data[9]) {
            return <Card key={data[0]} array={data} />;
          }
        })}
      </div>
    </div>
  );
};
 