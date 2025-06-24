"use client";
import BrandNabvar from "@/components/BrandNav";
import { addPromotionSecret, hashValues, unhashValues } from "@/utils";
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function Setup() {
  const [brandStore, setBrandStore] = useState<string>("");
  const [brandApiKey, setBrandApiKey] = useState<string>("");

  function cleanShopifyUrl(url: string) {
    // Remove the protocol (http:// or https://)
    url = url.replace(/^https?:\/\//, "");

    // Remove any path or query parameters after the domain
    url = url.replace(/\/.*$/, "");

    // Extract the subdomain and domain
    const parts = url.split(".");

    if (parts.length >= 3 && parts[parts.length - 2] === "myshopify") {
      // Return the last 3 parts (subdomain.myshopify.com)
      return parts.slice(-3).join(".");
    } else {
      // Return an empty string if the URL is not in the expected format
      return "";
    }
  }

  const handleAddPromotionSecret = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const shopifyStoreName = cleanShopifyUrl(brandStore);
    const inputSecret = shopifyStoreName + "," + brandApiKey;
    // console.log(brandApiKey);
    const hashedPromotionSecret = await hashValues(
      shopifyStoreName,
      brandApiKey
    );
    // const res = await unhashValues(hashedPromotionSecret);
    // console.log(res);

    // console.log(inputSecret);
    const res = await addPromotionSecret(inputSecret);
    console.log(res);
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrandApiKey(e.target.value);
  }

  const handleStoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrandStore(e.target.value);
  }

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
        <span className="mb-4 mt-20 text-lg md:text-5xl font-semibold text-white/80 tracking-wide drop-shadow font-pixel">Setup Your Shopify Store</span>
        <div className="bg-white rounded-lg shadow-xl border-2 border-black p-10 w-full max-w-2xl mx-auto flex flex-col items-center mt-8">
          <form
            onSubmit={handleAddPromotionSecret}
            className="w-full flex flex-col items-center"
          >
            <label className="text-xl font-bold text-emerald-700 self-start mb-2">Shopify Store Name</label>
            <input
              onChange={handleStoreChange}
              className="text-center border border-emerald-300 rounded-md py-2 font-semibold w-full mb-6 focus:ring-emerald-400 focus:border-emerald-500"
              type="text"
              placeholder="store name"
            />
            <label className="text-xl font-bold text-emerald-700 self-start mb-2">Shopify Store API</label>
            <input
              onChange={handleApiKeyChange}
              value={brandApiKey}
              className="text-center border border-emerald-300 rounded-md py-2 font-semibold w-full mb-6 focus:ring-emerald-400 focus:border-emerald-500"
              type="text"
              placeholder="store API"
            />
            <button className="mt-5 text-lg bg-yellow-400 hover:bg-yellow-300 rounded-full font-semibold border-2 border-black w-1/2 py-2 transition-all duration-200 shadow">
              Setup Brand
            </button>
          </form>
          <h1 className="font-extrabold tracking-tight text-emerald-700 text-3xl mt-8">
            Setup your brand seamlessly with SolarNet.
          </h1>
        </div>
      </div>
    </div>
  );
}