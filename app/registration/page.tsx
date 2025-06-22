"use client";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/supabaseClient";

export default function Registration() {
  const { isConnected, address } = useAccount();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address);
    }
  }, [isConnected, address]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !walletAddress) {
      alert("Please fill in all fields and connect your wallet");
      return;
    }

    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    setIsLoading(true);

    // Store basic registration data in localStorage
    const registrationData = {
      email,
      walletAddress,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem("registrationData", JSON.stringify(registrationData));

    // Insert user into Supabase
    const { error } = await supabase.from("users").insert([
      {
        wallet_address: walletAddress,
        user_email: email,
      },
    ]);
    if (error) {
      alert("Failed to register user in database: " + error.message);
      setIsLoading(false);
      return;
    }

    // Redirect to sensor registration page
    router.push("/registration/sensor-registration");
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
        <span className="mb-4 mt-20 text-lg md:text-5xl font-semibold text-white/80 tracking-wide drop-shadow">
          Register for SolarNet
        </span>
        
        <div className="bg-white rounded-lg shadow-xl border-2 border-black p-10 w-full max-w-md mx-auto flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-600 mb-6 drop-shadow">
            User Registration
          </h2>
          
          {!isConnected ? (
            <div className="text-xl text-emerald-700 font-semibold mb-4 text-center">
              Please connect your wallet to continue with registration.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
              <div className="w-full mb-6">
                <label htmlFor="email" className="block text-lg font-semibold text-emerald-700 mb-2 text-left">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 text-gray-900 font-medium"
                  placeholder="Enter your email address"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="w-full mb-6">
                <label htmlFor="wallet" className="block text-lg font-semibold text-emerald-700 mb-2 text-left">
                  Wallet Address
                </label>
                <input
                  type="text"
                  id="wallet"
                  value={walletAddress}
                  readOnly
                  className="w-full px-4 py-3 border border-emerald-300 rounded-lg bg-gray-50 text-gray-600 font-mono text-sm"
                  placeholder="Connect wallet to auto-fill"
                />
                <p className="text-sm text-emerald-600 mt-1">
                  Connected: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}
                </p>
              </div>
              
              <button
                type="submit"
                disabled={isLoading || !email || !walletAddress}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg border-2 border-black hover:shadow-xl disabled:cursor-not-allowed"
              >
                {isLoading ? "Registering..." : "Continue to Sensor Registration"}
              </button>
            </form>
          )}
          
          <div className="mt-6 text-sm text-gray-600 text-center">
            <p>By registering, you agree to our terms of service and privacy policy.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 