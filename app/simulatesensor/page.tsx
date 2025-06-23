"use client";
import {
  getNearbyWeatherXMDevices,
  getSolarIrradiance,
  findClosestDeviceIndex,
  simulateSensorSendingData,
} from "@/utils";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
let intervalId: NodeJS.Timeout | null = null;

export default function SimulateSensor() {
  const [longitude, setLongitude] = useState(77.2090);
  const [latitude, setLatitude] = useState(28.6139);
  const [solarIrradiance, setSolarIrradiance] = useState<number | null>(null);
  const [voltage, setVoltage] = useState(12);
  const [current, setCurrent] = useState(2);
  const [time, setTime] = useState(0.5);
  const [capturing, setCapturing] = useState(false);
  const [totalEnergyUsed, setTotalEnergyUsed] = useState(0);
  const [totalExpectedOutput, setTotalExpectedOutput] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasStopped, setHasStopped] = useState(false);
  const [transactionComplete, setTransactionComplete] = useState(false);

  const fetchSolarIrradiance = async () => {
    try {
      const closestDeviceIndex = await findClosestDeviceIndex(
        latitude,
        longitude
      );
      console.log("Closest device index:", closestDeviceIndex);

      const res2 = await getSolarIrradiance(closestDeviceIndex);
      if (res2) {
        const irradiance = res2[0].current_weather.solar_irradiance;
        console.log("Solar irradiance for current location is", irradiance);
        setSolarIrradiance(irradiance);
      }
    } catch (error) {
      console.error(
        "Error finding closest device index or getting solar irradiance:",
        error
      );
    }
  };

  useEffect(() => {
    if (capturing) {
      fetchSolarIrradiance();
    }
  }, [latitude, longitude, capturing]);

  useEffect(() => {
    const calculateAndAccumulate = () => {
      const energyUsed = 0.5 * voltage * current; // Time is always 0.5 hours per interval
      setTotalEnergyUsed((prevTotal) => prevTotal + energyUsed);

      if (solarIrradiance !== null) {
        const panelArea = 18 * 0.092903; // 18 square feet to square meters
        const efficiency = 0.2;
        const expectedOutput = solarIrradiance * panelArea * efficiency * 0.5; // Time is always 0.5 hours per interval
        setTotalExpectedOutput((prevTotal) => prevTotal + expectedOutput);
      }
    };

    if (capturing && solarIrradiance !== null) {
      calculateAndAccumulate();
    }
  }, [time, solarIrradiance, voltage, current, capturing]);

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLongitude(parseFloat(e.target.value));
  };

  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLatitude(parseFloat(e.target.value));
  };

  const handleVoltageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoltage(parseFloat(e.target.value));
  };

  const handleCurrentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrent(parseFloat(e.target.value));
  };

  const updateCaptureData = () => {
    setTime((prevTime) => prevTime + 0.5);
  };

  const startCapture = () => {
    setCapturing(true);
    setHasStarted(true);
    setHasStopped(false);
    intervalId = setInterval(async () => {
      await fetchSolarIrradiance();
      updateCaptureData();
    }, 2000); // Capture every 2 seconds
  };

  const stopCapture = () => {
    setCapturing(false);
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    setHasStopped(true); // Set hasStopped after clearing the interval
  };

  const slrTokens = totalEnergyUsed / 200;

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
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full px-4 text-center relative z-10">
        <span className="mb-4 font-pixel mt-20 text-lg md:text-5xl font-semibold text-white/80 tracking-wide drop-shadow">
          Simulate Your Sensor Data
        </span>
        <div className="bg-white rounded-2xl shadow-[8px_8px_0px_#000] border-4 border-black p-8 md:p-16 w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-start mt-6">
          {/* Form Section */}
          <div className="w-full md:w-1/2 flex flex-col items-start">
            <h2 className="text-2xl font-extrabold text-emerald-600 mb-6 drop-shadow">Sensor Input</h2>
            <form className="w-full flex flex-col gap-4">
              <div>
                <label className="block mb-1 text-lg font-semibold text-emerald-700">Longitude</label>
                <input
                  type="number"
                  value={longitude}
                  onChange={e => setLongitude(parseFloat(e.target.value))}
                  step="0.000001"
                  className="w-full px-4 py-2 border-2 border-black rounded-lg bg-gray-50 text-gray-900 font-medium shadow-[4px_4px_0px_#000] focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500"
                  placeholder="Longitude"
                />
              </div>
              <div>
                <label className="block mb-1 text-lg font-semibold text-emerald-700">Latitude</label>
                <input
                  type="number"
                  value={latitude}
                  onChange={e => setLatitude(parseFloat(e.target.value))}
                  step="0.000001"
                  className="w-full px-4 py-2 border-2 border-black rounded-lg bg-gray-50 text-gray-900 font-medium shadow-[4px_4px_0px_#000] focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500"
                  placeholder="Latitude"
                />
              </div>
              <div>
                <label className="block mb-1 text-lg font-semibold text-yellow-500">Voltage (V)</label>
                <input
                  type="number"
                  value={voltage}
                  onChange={e => setVoltage(parseFloat(e.target.value))}
                  step="0.1"
                  className="w-full px-4 py-2 border-2 border-black rounded-lg bg-gray-50 text-gray-900 font-medium shadow-[4px_4px_0px_#000] focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
                  placeholder="Voltage"
                />
              </div>
              <div>
                <label className="block mb-1 text-lg font-semibold text-yellow-500">Current (A)</label>
                <input
                  type="number"
                  value={current}
                  onChange={e => setCurrent(parseFloat(e.target.value))}
                  step="0.1"
                  className="w-full px-4 py-2 border-2 border-black rounded-lg bg-gray-50 text-gray-900 font-medium shadow-[4px_4px_0px_#000] focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
                  placeholder="Current"
                />
              </div>
            </form>
            <div className="flex gap-4 mt-6">
              {!capturing ? (
                <button
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_#000] transition-all duration-200 text-lg"
                  type="button"
                  onClick={startCapture}
                >
                  Start Capture
                </button>
              ) : (
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_#000] transition-all duration-200 text-lg"
                  type="button"
                  onClick={stopCapture}
                >
                  Stop Capture
                </button>
              )}
            </div>
            {hasStarted && !hasStopped && (
              <div className="mt-4 text-yellow-500 font-semibold">Capturing data... (updates every 2 seconds)</div>
            )}
          </div>
          {/* Results Section */}
          <div className="w-full md:w-1/2 flex flex-col items-start">
            <h2 className="text-2xl font-extrabold text-yellow-500 mb-6 drop-shadow">Sensor Output</h2>
            <div className="bg-gray-50 border-2 border-black rounded-lg shadow-[4px_4px_0px_#000] p-6 w-full flex flex-col gap-4">
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-emerald-700">Solar Irradiance:</span>
                <span className="text-black">{solarIrradiance !== null ? `${solarIrradiance} W/m²` : "-"}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-emerald-700">Total Energy Used:</span>
                <span className="text-black">{totalEnergyUsed.toFixed(2)} Wh</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-emerald-700">Expected Output:</span>
                <span className="text-black">{totalExpectedOutput.toFixed(2)} Wh</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-yellow-500">SNT Tokens:</span>
                <span className="text-black">{slrTokens.toFixed(4)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-gray-700">Time Elapsed:</span>
                <span className="text-black">{time.toFixed(1)} hours</span>
              </div>
            </div>
            {hasStopped &&
              (totalEnergyUsed > totalExpectedOutput ? (
                <button
                  onClick={() => {
                    simulateSensorSendingData(Number(slrTokens.toFixed()));
                  }}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2 px-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_#000] transition-all duration-200 text-lg mt-6"
                  type="button"
                >
                  ⚠️ Anomaly Detected: Can&apos;t Send Data to Smart Contract
                </button>
              ) : (
                <>
                  <button
                    onClick={async () => {
                      await simulateSensorSendingData(Number(slrTokens.toFixed()));
                      setTransactionComplete(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_#000] transition-all duration-200 text-lg mt-6"
                    type="button"
                  >
                    🚀 Send to Smart Contract
                  </button>
                  {transactionComplete && (
                    <Link href="/sale">
                    <button
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_#000] transition-all duration-200 text-lg mt-4"
                      type="button"
                    >
                      💸 Sell your credits/tokens
                    </button>
                    </Link>
                  )}
                </>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}