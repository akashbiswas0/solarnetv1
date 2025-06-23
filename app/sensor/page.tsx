"use client";
import { useEffect, useState } from "react";
import { addGenStation } from "../../utils";
import Navbar from "@/components/Navbar";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddGenSensor() {
  const [code, setCode] = useState("");
  function handleAddSensor() {
    addGenStation(code);
  }
  const handleClick = () => {
    handleAddSensor();
    toast.success('GenSensor Added Successfully !', {
      position: "bottom-right",
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Slide,
    });
  };
  const combinedFunction = () => {
    handleClick();
  };

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
        {/* Eco Icon */}
       
        {/* Tagline */}
        <span className="mb-4 text-lg md:text-xl text-black font-semibold tracking-wide drop-shadow">Add a new Green Sensor to your account</span>
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-black p-10 w-full max-w-lg mx-auto flex flex-col items-center">
          <h2 className="text-3xl font-pixel md:text-4xl font-extrabold text-emerald-600 mb-6 drop-shadow">Enter your secret code</h2>
          <input
            className="text-black text-xl font-semibold h-12 w-full max-w-xs rounded-md border-2 border-emerald-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 px-4 mb-6 transition-all duration-200"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            type="text"
            placeholder="Sensor code..."
          />
          <button
            className="px-8 py-3 font-bold rounded-xl bg-emerald-500 text-white border-2 border-black shadow hover:bg-emerald-400 hover:text-black transition-all duration-200 text-lg"
            onClick={combinedFunction}
          >
            Add Sensor
          </button>
          <ToastContainer />
          <p className="text-lg mt-10 font-medium text-emerald-700">
            &ldquo;Add sensors to make sure their reportings are added to your account.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
export default AddGenSensor;