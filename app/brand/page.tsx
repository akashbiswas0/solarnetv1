"use client";
import { checkIsBrand, registerAsBrand } from "@/utils";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";

export default function Brand() {
  const [hasJoined, setHasJoined] = useState(false);
  useEffect(() => {
    const checkBrandValidity = async () => {
      const result = await checkIsBrand();
      if (result) {
        setHasJoined(true);
      }
      console.log("is brand ?", result);
    };
    checkBrandValidity();
  }, [hasJoined]);

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
        <span className="mb-4 mt-20 text-lg md:text-5xl font-semibold text-white/80 tracking-wide drop-shadow">Join the Revolution With Us</span>
        <div className="bg-white rounded-lg shadow-xl border-2 border-black p-10 w-full max-w-2xl mx-auto flex flex-col items-center mt-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-600 mb-6 drop-shadow">SolarNet for Brands</h1>
          <p className="text-neutral-700 max-w-lg mx-auto my-2 text-lg text-center relative z-10 mb-6">
            SolarNet introduces an innovative ecosystem to accelerate the adoption and generation of renewable energy. With the GenSensor technology, individuals can attach smart sensors to their green energy sources, like solar panels, to track and convert energy production into digital tokens. This mechanism not only encourages renewable energy generation but also allows for the creation and trade of green energy certificates in our marketplace, promoting transparency and economic activity within the green energy sector.
          </p>
          <button
            className="border-2 px-8 text-2xl font-bold bg-yellow-400 hover:bg-yellow-300 hover:text-black text-black border-black py-2 mt-5 mb-2 rounded-full transition-all duration-200 shadow"
            onClick={async () => {
              const res = await registerAsBrand();
              console.log(res);
            }}
          >
            {hasJoined ? "Successfully joined" : "Join SolarNet"}
          </button>
        </div>
      </div>
    </div>
  );
}