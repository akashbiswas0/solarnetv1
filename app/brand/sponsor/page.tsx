"use client";
import BrandNabvar from "../../../components/BrandNav";
import React from "react";
import { useEffect, useState } from "react";
import { consumeToken } from "../../../utils";
import {
  getOrdersArray,
  addGenStation,
  getMarketPrice,
  getSLRTokenBalance,
} from "../../../utils";
import BrandCard from "../../../components/BrandCard";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Sponsor() {
  const [SLRBalance, setSLRBalance] = useState("Fetching ...");
  const [marketPrice, setMarketPrice] = useState("Fetching");
  const [ordersArray, setOrdersArray] = useState([]);

  async function handleSLRBalanceUpdate() {
    //console.log("Fetching GW token balance...");
    try {
      const updatedBalance = await getSLRTokenBalance();
      console.log("Fetched balance:", updatedBalance);
      setSLRBalance(updatedBalance);
    } catch (error) {
      console.error("Failed to fetch SNT token balance:", error);
    }
  }

  async function updateArray() {
    const arr = await getOrdersArray();
    //console.log(arr);
    setOrdersArray(arr);

    //console.log(ordersArray);
    // for (let i = 0; i < ordersArray.length; i++) {
    //     if(ordersArray[i][9]){
    //         const currArr = ordersArray[i];
    //         //console.log(currArr[i]);
    //         <Card array={currArr}></Card>
    //     }
    //   //console.log(ordersArray[i][0]);
    //   for (let j = 0; j < ordersArray[i].length; j++) {
    //     //console.log(ordersArray[i][j]);
    //   }
    // }
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
    <div className="min-h-screen bg-emerald-500 relative overflow-hidden">
      {/* Subtle SVG Pattern Background */}
      <svg className="absolute inset-0 w-full h-full opacity-10 -z-10" width="100%" height="100%" viewBox="0 0 1440 560" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="40" height="40" fill="none" stroke="#fff" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* Decorative SVG Blobs */}
      <svg className="absolute top-0 left-0 w-96 h-96 opacity-30 -z-10" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="200" cy="200" r="200" fill="#34d399" />
      </svg>
      <svg className="absolute bottom-0 right-0 w-96 h-96 opacity-20 -z-10" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="200" cy="200" r="200" fill="#60a5fa" />
      </svg>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full px-4 text-center relative z-10">
        <span className="mb-4 mt-20 text-lg md:text-5xl font-semibold text-white/80 tracking-wide drop-shadow">Sponsor Self Sufficient Users</span>
        <div className="bg-white rounded-lg shadow-xl border-2 border-black p-10 w-full max-w-2xl mx-auto flex flex-col items-center mt-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-600 mb-6 drop-shadow">Sponsor <mark className='bg-yellow-400 rounded-lg px-3'>Self Sufficient users</mark> from SolarNet</h1>
          <div className="border-2 border-emerald-200 py-5 mt-4 rounded-lg w-full">
            <div className="text-center text-emerald-700 text-2xl font-extrabold tracking-wider">
              You have Burned
              <mark className="px-5 py-2 rounded-2xl bg-sky-400 mx-2">
                <span className="text-black">{SLRBalance}</span>
              </mark>
              SNT Points
            </div>
          </div>
          <div className="flex flex-wrap content-center justify-center mt-8 w-full">
            {ordersArray.map((data) => {
              if (!data[9]) {
                return <BrandCard key={data[0]} array={data}></BrandCard>;
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}