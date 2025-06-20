"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { createSellOrder, addGenStation, getSLRTokenBalance } from "../../utils";
import { ToastContainer, toast , Slide , Bounce} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";
export default function Main() {
  const [SLRBalance, setSLRBalance] = useState("Fetching ...");
  const [noOfTokens, setNoOfTokens] = useState(0);
  const [price, setPrice] = useState(0);
  const [isOption, setIsOption] = useState(false);
  const [optionPrice, setOptionPrice] = useState(0);
  const [optionDuration, setOptionDuration] = useState(0);
  const [toggle, setToggle] = useState(false);


  async function handleSLRBalanceUpdate() {
    console.log("Fetching SNT token balance...");
    try {
      const updatedBalance = await getSLRTokenBalance();
      console.log("Fetched balance:", updatedBalance);
      setSLRBalance(updatedBalance);
    } catch (error) {
      console.error("Failed to fetch SNT token balance:", error);
    }
  }

  async function handleSubmit() {
    createSellOrder(noOfTokens, price, optionPrice, optionDuration);
    setPrice(0);
    setNoOfTokens(0);
    setOptionPrice(0);
    setOptionDuration(0);
  }

  function handleNoOfTokenUpdate(noOfTokens) {
    console.log("incoming token", noOfTokens);
    setNoOfTokens(noOfTokens);
  }

  function handlepriceUpdate(price) {
    console.log("incoming token", price);
    setPrice(price);
  }

  function handleOptionPriceUpdate(price) {
    console.log("incoming token", price);
    setOptionPrice(price);
  }

  function handleOptionDurationUpdate(duration) {
    console.log("incoming token", duration);
    setOptionDuration(duration);
  }

  useEffect(() => {
    handleSLRBalanceUpdate();
  }, []);

  const handleToggle = () => {
    setToggle(!toggle);
  };
  

  return (
    <div className="min-h-screen bg-emerald-500 relative overflow-hidden">
      {/* SVG Pattern Background */}
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
        <circle cx="200" cy="200" r="200" fill="#facc15" />
      </svg>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full px-2 text-center relative z-10">
        <span className="mb-4 font-pixel mt-24 text-lg md:text-5xl font-semibold text-white/80 tracking-wide drop-shadow">
          Sell Your SNT Points
        </span>
        <div className="bg-white rounded-2xl shadow-[8px_8px_0px_#000] border-4 border-black p-4 md:p-8 w-full max-w-2xl mx-auto flex flex-col gap-6 items-center mt-4">
          <div className="text-2xl md:text-3xl font-extrabold tracking-wide text-center border-2 border-black rounded-xl bg-yellow-400 text-black p-3 mb-4 shadow-[4px_4px_0px_#000]">
            You have generated <mark className="px-3 rounded-lg bg-white text-emerald-600">{SLRBalance}</mark> SNT Points
         
          </div>
          <div className="w-full flex flex-col items-center">
            <div className="w-full bg-gray-50 border-2 border-black rounded-xl shadow-[4px_4px_0px_#000] p-4">
              <label className="block mb-4 font-pixel font-semibold tracking-tight text-emerald-700 text-center text-2xl">
                List Sales
              </label>
              <div className="flex flex-col gap-3">
                <label htmlFor="noOfTokensField" className="text-base font-semibold text-emerald-700">
                  No of Tokens
                </label>
                <input
                  type="number"
                  id="noOfTokensField"
                  placeholder="No of tokens"
                  value={noOfTokens}
                  onChange={(e) => handleNoOfTokenUpdate(e.target.value)}
                  className="mt-1 bg-white border-2 border-black text-gray-900 text-md font-semibold rounded-lg focus:ring-emerald-400 focus:border-emerald-500 block w-full p-2 shadow-[2px_2px_0px_#000]"
                />
                <label htmlFor="priceField" className="text-base font-semibold text-emerald-700 mt-2">
                  Total Price
                </label>
                <input
                  type="number"
                  id="priceField"
                  placeholder="Total price"
                  value={price}
                  onChange={(e) => handlepriceUpdate(e.target.value)}
                  className="mt-1 bg-white border-2 border-black text-gray-900 text-md font-semibold rounded-lg focus:ring-yellow-400 focus:border-yellow-500 block w-full p-2 shadow-[2px_2px_0px_#000]"
                />
                <label htmlFor="toggle" className="inline-flex items-center cursor-pointer mb-4 mt-2">
                  <input
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    id="toggle"
                    checked={toggle}
                    onChange={handleToggle}
                  />
                  <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:bg-emerald-500"></div>
                  <span className="ml-3 text-base font-semibold text-emerald-700">
                    Offer as Option
                  </span>
                </label>
                <div className={`w-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${toggle ? 'max-h-screen' : 'max-h-0'}`}>
                  <label htmlFor="optionPriceField" className="text-base font-semibold text-yellow-500">
                    Price for Option
                  </label>
                  <input
                    type="number"
                    id="optionPriceField"
                    value={optionPrice}
                    onChange={(e) => handleOptionPriceUpdate(e.target.value)}
                    className="mt-1 bg-white border-2 border-black text-gray-900 text-md rounded-lg focus:ring-yellow-400 focus:border-yellow-500 block w-full p-2 shadow-[2px_2px_0px_#000]"
                  />
                  <label htmlFor="optionDurationField" className="text-base font-semibold text-yellow-500 mt-1">
                    Duration for Option (In seconds)
                  </label>
                  <input
                    type="number"
                    id="optionDurationField"
                    value={optionDuration}
                    onChange={(e) => handleOptionDurationUpdate(e.target.value)}
                    className="mt-1 bg-white border-2 border-black text-gray-900 text-md rounded-lg focus:ring-yellow-400 focus:border-yellow-500 block w-full p-2 shadow-[2px_2px_0px_#000]"
                  />
                </div>
                <button
                  onClick={() => {
                    handleSubmit();
                    toast.success('Sale successfully!', {
                      position: "bottom-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "dark",
                      transition: Bounce,
                    });
                  }}
                  className="self-center w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_#000] transition-all duration-200 text-xl mt-4"
                >
                  💸 Sale
                </button>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}