"use client";
import Link from "next/link";
import { ethers } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { connectWithMetamask } from "../utils";
import { useState, useEffect } from "react";

const BrandNavbar: React.FC = () => {
  
  return (
    <div className="">
      <nav className=" border-black bg-white m-2  rounded-lg backdrop-blur-md">
        <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <Link legacyBehavior href="/landing">
            <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                
                <span className="self-center text-3xl font-semibold whitespace-nowrap ">SolarNet</span>
            </a>
            </Link>

          <div className="flex md:order-2 space-x-3 ">
            <ConnectButton/>
          </div>


          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-cta"
          >
            <ul className="flex font-sans font-semibold text-2xl md:p-1 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-slate-500  ">
              <Link legacyBehavior href="/brand/setup">
                <li>
                  <a
                    href=""
                    className="block py-2 px-3 md:p-0 mx-5 text-black rounded tracking-tight "
                  >
                    Setup
                  </a>
                </li>
              </Link>

              <Link legacyBehavior href="/brand/sponsor">
                <li>
                  <a
                    href="#"
                    className="block py-2 px-3 md:p-0 mx-5text-black tracking-tight "
                  >
                    Sponsor
                  </a>
                </li>
              </Link>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default BrandNavbar;