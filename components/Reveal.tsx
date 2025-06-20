"use client";
import React from "react";

const content = [
  {
    title: "Innovative Sensor Technology",
    description:
      "Tracks and Converts Renewable Energy Production into Digital Tokens: The cutting-edge sensor technology precisely monitors renewable energy generation, whether from solar, wind, or other sources. ",
  },
  {
    title: "Green Energy Token Marketplace",
    description:
      "Enables Buying and Selling of Tokens Representing Renewable Energy Generation: The marketplace allows users to trade tokens that symbolize generated renewable energy, promoting transparency and liquidity in the green energy market. ",
  },
  {
    title: "Tackles Carbon Footprint",
    description:
      "Directly Addresses Climate Change by Motivating Carbon Emission Reduction: The system incentivizes the shift towards renewable energy by rewarding users for their green energy contributions. This proactive approach helps lower the global carbon footprint, as more individuals and businesses are motivated to adopt sustainable energy solutions.",
  },
  {
    title: "Economic Incentives for Green Energy",
    description:
      "Offers Financial Rewards for Clean Energy Production and Consumption: The token system provides tangible economic benefits to those who invest in and utilize renewable energy. This financial model lowers the barrier to entry for renewable energy projects, making them more appealing and viable.",
  },
];

export function StickyScrollRevealDemo() {
  return (
    <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
      {content.map((item, idx) => (
        <div key={item.title + idx} className="bg-white rounded-xl shadow-lg p-8 border-2 border-black">
          <h2 className="text-2xl font-bold mb-2 text-emerald-600">{item.title}</h2>
          <p className="text-gray-700 text-lg">{item.description}</p>
        </div>
      ))}
    </div>
  );
}