"use client";
import React from "react";

export function BackgroundBeamsDemo() {
  return (
    <div className="h-[40rem] w-full rounded-md bg-gradient-to-br from-emerald-200 via-blue-200 to-purple-200 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-50 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 to-neutral-400 text-center font-sans font-bold">
          Join the waitlist
        </h1>
        <p className="text-neutral-700 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
          Welcome to MailJet, the best transactional email service on the web.
          We provide reliable, scalable, and customizable email solutions for
          your business. Whether you&apos;re sending order confirmations,
          password reset emails, or promotional campaigns, MailJet has got you
          covered.
        </p>
        <input
          type="text"
          placeholder="hi@manuarora.in"
          className="rounded-lg border border-neutral-800 focus:ring-2 focus:ring-teal-500 w-full relative z-10 mt-4 bg-white placeholder:text-gray-700"
        />
      </div>
      {/* Decorative SVG background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 700 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="350" cy="150" r="120" fill="#a5b4fc" fillOpacity="0.2" />
        <circle cx="200" cy="80" r="60" fill="#6ee7b7" fillOpacity="0.2" />
        <circle cx="500" cy="220" r="80" fill="#f472b6" fillOpacity="0.2" />
      </svg>
    </div>
  );
}