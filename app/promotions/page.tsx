"use client";
import { useEffect, useState } from "react";
import { getAllEligiblePromotions, generateDiscountCode } from "../../utils";
import Navbar from "@/components/Navbar";

export default function Promotions() {
  const [shopName, setShopName] = useState("");
  const [shopApi, setShopApi] = useState("");
  const [code, setCode] = useState("xxxxx");

  const handleCodeGeneration = async () => {
    const res = await generateDiscountCode(20, "ll", shopApi, shopName);
    setCode(res.code);
  };
  useEffect(() => {
    (async () => {
      const res = await getAllEligiblePromotions();
      const resArr = res[0].split(",");
      setShopName(resArr[0]);
      setShopApi(resArr[1]);
      console.log(resArr);
    })();
  }, []);

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
        <span className="mb-4 mt-20 text-lg md:text-5xl font-semibold text-white/80 tracking-wide drop-shadow font-pixel">Redeem Your Reward</span>
        <div className="bg-white rounded-lg shadow-xl border-2 border-black p-10 w-full max-w-xl mx-auto flex flex-col items-center mt-8">
          <span className="font-semibold text-2xl text-emerald-700 mb-2">Shop Name</span>
          <div className="border-2 rounded-lg mb-4 text-xl w-2/3 px-3 py-2 bg-gray-50 text-emerald-900">{shopName.split(".")[0]}</div>
          <span className="font-semibold text-2xl text-emerald-700 mb-2">Shop URL</span>
          <div className="border-2 rounded-lg mb-4 text-lg font-bold w-2/3 px-3 py-2 bg-gray-50 text-emerald-900">{shopName}</div>
          <span className="border-2 border-black mb-3 rounded-full mt-3 py-1 px-4 bg-white font-semibold text-emerald-700 text-lg">
            {code}
          </span>
          <button 
            onClick={handleCodeGeneration}
            className="border-2 border-black rounded-full mt-3 px-6 py-2 bg-yellow-400 hover:bg-yellow-300 hover:text-black font-semibold text-lg transition-all duration-200 shadow"
          >
            Generate code
          </button>
        </div>
      </div>
    </div>
  );
}