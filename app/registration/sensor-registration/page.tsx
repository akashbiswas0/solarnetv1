"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import Navbar from "@/components/Navbar";
import { supabase } from "@/supabaseClient";

export default function SensorRegistration() {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [serialNo, setSerialNo] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [ownerIdLoading, setOwnerIdLoading] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState("active");
  const [preferredChain, setPreferredChain] = useState("ethereum");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user has completed initial registration
    const storedData = localStorage.getItem("registrationData");
    if (!storedData) {
      router.push("/registration");
      return;
    }

    const data = JSON.parse(storedData);
    setRegistrationData(data);

    // Verify wallet is still connected and matches
    if (!isConnected || address !== data.walletAddress) {
      alert("Please connect the same wallet used for registration");
      router.push("/registration");
      return;
    }

    // Fetch owner_id from Supabase users table with a 4 second loading state
    const fetchOwnerId = async () => {
      setOwnerIdLoading(true);
      const { data: user, error } = await supabase
        .from("users")
        .select("id")
        .eq("wallet_address", data.walletAddress)
        .single();
      if (error || !user) {
        alert("Could not fetch owner ID from database. Please try again.");
        setOwnerIdLoading(false);
        return;
      }
      // Simulate 4 second loading
      setTimeout(() => {
        setOwnerId(user.id);
        setOwnerIdLoading(false);
      }, 4000);
    };
    fetchOwnerId();
  }, [isConnected, address, router]);

  const handleSensorRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!serialNo.trim() || !ownerId.trim() || !apiKey.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    // Insert sensor details into Supabase sensors table
    const { error } = await supabase.from("sensors").insert([
      {
        serial_number: serialNo,
        owner_id: ownerId,
        api_key: apiKey,
        status,
        preferred_chain: preferredChain,
      },
    ]);
    if (error) {
      alert("Failed to register sensor in database: " + error.message);
      setIsLoading(false);
      return;
    }

    // Update registration data with sensor details
    const updatedData = {
      ...registrationData,
      sensorDetails: {
        serialNo,
        ownerId,
        apiKey,
        status,
        preferredChain,
        registeredAt: new Date().toISOString()
      }
    };
    localStorage.setItem("registrationData", JSON.stringify(updatedData));

    alert("Registration completed successfully!");
    router.push("/landing");
  };

  if (!registrationData) {
    return (
      <div className="min-h-screen bg-emerald-500 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-500 relative overflow-hidden">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full px-4 text-center relative z-10">
        <span className="mb-4 mt-20 text-lg md:text-5xl font-semibold text-white/80 tracking-wide drop-shadow">
          {/* Title intentionally left blank as per last user edit */}
        </span>
        <div className="bg-white rounded-lg shadow-xl border-2 border-black p-10 w-full max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-600 mb-6 drop-shadow">
            Sensor Registration
          </h2>
          {/* Registration Summary */}
          
          <form onSubmit={handleSensorRegistration} className="w-full flex flex-col items-center">
            <div className="w-full mb-6">
              <label htmlFor="serialNo" className="block text-lg font-semibold text-emerald-700 mb-2 text-left">
                Serial Number *
              </label>
              <input
                type="text"
                id="serialNo"
                value={serialNo}
                onChange={(e) => setSerialNo(e.target.value)}
                className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 text-gray-900 font-medium"
                placeholder="Enter sensor serial number"
                required
                disabled={isLoading}
              />
            </div>
            <div className="w-full mb-6">
              <label htmlFor="ownerId" className="block text-lg font-semibold text-emerald-700 mb-2 text-left">
                Owner ID *
              </label>
              <input
                type="text"
                id="ownerId"
                value={ownerIdLoading ? "Fetching Owner ID..." : ownerId}
                readOnly
                className={`w-full px-4 py-3 border border-emerald-300 rounded-lg bg-gray-50 text-gray-600 font-mono text-sm ${ownerIdLoading ? "animate-pulse" : ""}`}
                placeholder="Owner ID will be auto-filled"
                required
              />
            </div>
            <div className="w-full mb-6">
              <label htmlFor="apiKey" className="block text-lg font-semibold text-emerald-700 mb-2 text-left">
                API Key *
              </label>
              <input
                type="text"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 text-gray-900 font-medium"
                placeholder="Enter your API key"
                required
                disabled={isLoading}
              />
            </div>
            <div className="w-full mb-6">
              <label htmlFor="status" className="block text-lg font-semibold text-emerald-700 mb-2 text-left">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 text-gray-900 font-medium"
                disabled={isLoading}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
                <option value="testing">Testing</option>
              </select>
            </div>
            <div className="w-full mb-6">
              <label htmlFor="preferredChain" className="block text-lg font-semibold text-emerald-700 mb-2 text-left">
                Preferred Chain
              </label>
              <select
                id="preferredChain"
                value={preferredChain}
                onChange={(e) => setPreferredChain(e.target.value)}
                className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 text-gray-900 font-medium"
                disabled={isLoading}
              >
                <option value="ethereum">Ethereum</option>
                <option value="polygon">Polygon</option>
                <option value="bsc">Binance Smart Chain</option>
                <option value="arbitrum">Arbitrum</option>
                <option value="optimism">Optimism</option>
                <option value="avalanche">Avalanche</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isLoading || ownerIdLoading || !serialNo.trim() || !ownerId.trim() || !apiKey.trim()}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg border-2 border-black hover:shadow-xl disabled:cursor-not-allowed"
            >
              {isLoading ? "Registering..." : "Complete Registration"}
            </button>
          </form>
          <div className="mt-6 text-sm text-gray-600 text-center">
            <p>This will complete your SolarNet account setup with sensor details.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 