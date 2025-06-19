"use client"
import Navbar from "@/components/Navbar"
import { FlipWordsDemo } from "@/components/Flip"
import GradualSpacing from "@/components/magicui/gradual-spacing";
import { StickyScrollRevealDemo } from "@/components/Reveal";
import { AnimatedListDemo } from "@/components/AnimatedCards";
import Link from "next/link";
import { useAccount } from "wagmi";

export default function Landing(){
    const { isConnected } = useAccount();
    return(
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
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center min-h-[80vh] w-full px-4 text-center relative z-10">
                {/* Tagline */}
              
                {/* Eco Icon */}
            
                <h1 className="font-pixel text-6xl md:text-8xl -mt-20 font-extrabold text-white drop-shadow-[0_8px_32px_rgba(16,185,129,0.7)] tracking-tight mb-4">
                    Solar<span className="">Net</span>
                </h1>
                <p className="text-2xl md:text-5xl text-white/90 font-semibold mb-8 max-w-6xl mx-auto drop-shadow-lg">
                    Revolutionizing sustainability with blockchain-powered green energy solutions.
                </p>

                {isConnected && (
                    <>
                        <div className="flex flex-row gap-4 -mt-8">
                            <Link href="/sale">
                                <button className="mt-4 bg-yellow-400 hover:bg-yellow-300 text-black text-xl font-bold py-4 px-10 rounded-xl shadow-lg transition-all duration-200 border-2 border-black flex items-center gap-2 mb-10">
                                    be a seller
                                </button>
                            </Link>
                            <Link href="/buy">
                                <button className="mt-4 bg-yellow-400 hover:bg-yellow-300 text-black text-xl font-bold py-4 px-10 rounded-xl shadow-lg transition-all duration-200 border-2 border-black flex items-center gap-2 mb-10">
                                    buyer ?
                                </button>
                            </Link>
                        </div>
                        <Link href="/registration">
                            <button className="-mt-5 bg-yellow-400 hover:bg-yellow-300 text-black text-xl font-bold py-2 px-12 rounded-xl shadow-lg transition-all duration-200 border-2 border-black flex items-center gap-2 mb-10">register sensor</button>
                        </Link>
                    </>
                )}
                {/* Trusted By Row */}
               
            </section>
            {/* ...rest of the page... */}
            {/* Features, Stats, Animated Cards, Sticky Scroll, Footer */}
            <div className="px-4 pb-16 -mt-44">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="group">
                            <div className="neobrutalism-card p-4">
                                <img 
                                    className="w-full h-64 object-cover rounded-xl border-4 border-black" 
                                    src="https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=600" 
                                    alt="Sustainable Technology" 
                                />
                                <div className="mt-4 p-4 bg-yellow-300 rounded-xl border-2 border-black">
                                    <h3 className="text-xl font-bold text-black">Sustainable Technology</h3>
                                    <p className="text-gray-800 mt-2">Revolutionary green solutions for a better tomorrow</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="group">
                            <div className="neobrutalism-card p-4">
                                <img 
                                    className="w-full h-64 object-cover rounded-xl border-4 border-black" 
                                    src="https://images.pexels.com/photos/3619870/pexels-photo-3619870.jpeg?auto=compress&cs=tinysrgb&w=600" 
                                    alt="Environmental Impact" 
                                />
                                <div className="mt-4 p-4 bg-green-300 rounded-xl border-2 border-black">
                                    <h3 className="text-xl font-bold text-black">Environmental Impact</h3>
                                    <p className="text-gray-800 mt-2">Making a real difference in environmental conservation</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-4 pb-16">
                <div className="max-w-7xl mx-auto">
                    <div className="neobrutalism-card p-8">
                        <GradualSpacing
                            className="font-display text-center text-4xl font-bold tracking-[-0.1em] text-black md:text-6xl mb-12"
                            text="Features of SolarNet"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-yellow-300 p-6 rounded-xl border-4 border-black transform hover:rotate-2 transition-transform duration-300">
                                <div className="text-4xl mb-4">🌱</div>
                                <h3 className="text-xl font-bold text-black mb-2">Sustainable</h3>
                                <p className="text-gray-800">Eco-friendly solutions that protect our planet</p>
                            </div>
                            <div className="bg-green-300 p-6 rounded-xl border-4 border-black transform hover:-rotate-2 transition-transform duration-300">
                                <div className="text-4xl mb-4">⚡</div>
                                <h3 className="text-xl font-bold text-black mb-2">Innovative</h3>
                                <p className="text-gray-800">Cutting-edge technology for modern challenges</p>
                            </div>
                            <div className="bg-blue-300 p-6 rounded-xl border-4 border-black transform hover:rotate-2 transition-transform duration-300">
                                <div className="text-4xl mb-4">🔗</div>
                                <h3 className="text-xl font-bold text-black mb-2">Connected</h3>
                                <p className="text-gray-800">Seamless integration with blockchain technology</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-4 pb-16">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="neobrutalism-card p-6 text-center transform hover:scale-105 transition-transform duration-300">
                            <div className="text-4xl font-bold text-yellow-500">1000+</div>
                            <div className="text-black font-semibold">Sensors Deployed</div>
                        </div>
                        <div className="neobrutalism-card p-6 text-center transform hover:scale-105 transition-transform duration-300">
                            <div className="text-4xl font-bold text-green-500">500+</div>
                            <div className="text-black font-semibold">Active Users</div>
                        </div>
                        <div className="neobrutalism-card p-6 text-center transform hover:scale-105 transition-transform duration-300">
                            <div className="text-4xl font-bold text-blue-500">50+</div>
                            <div className="text-black font-semibold">Brands Partnered</div>
                        </div>
                        <div className="neobrutalism-card p-6 text-center transform hover:scale-105 transition-transform duration-300">
                            <div className="text-4xl font-bold text-red-500">99%</div>
                            <div className="text-black font-semibold">Accuracy Rate</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-4 pb-16">
                <div className="max-w-4xl mx-auto">
                    <div className="neobrutalism-card p-8">
                       
                    </div>
                </div>
            </div>
            <div className="px-4 pb-16">
                <div className="neobrutalism-card p-8">
                    <StickyScrollRevealDemo />
                </div>
            </div>
            <footer className="bg-black text-white p-8 rounded-t-2xl shadow-[8px_8px_0px_rgba(255,255,255,0.1)]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-4 text-yellow-400">SolarNet</h3>
                            <p className="text-gray-300 mb-4">Revolutionizing environmental sustainability through blockchain technology and innovative solutions.</p>
                            <div className="flex space-x-4">
                                <a href="https://github.com/akashbiswas0/SolarNet" className="neobrutalism-button">
                                    GitHub
                                </a>
                                <a href="https://github.com/akashbiswas0" className="bg-green-400 text-black px-4 py-2 rounded-lg font-bold neobrutalism-shadow border-4 border-black hover:bg-green-300 hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all duration-300">
                                    Contact
                                </a>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-bold text-yellow-400 mb-2">Quick Links</h4>
                                <ul className="space-y-2">
                                    <li><a href="/sensor" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300">Add Sensor</a></li>
                                    <li><a href="/sale" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300">Sale</a></li>
                                    <li><a href="/buy" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300">Buy</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-yellow-400 mb-2">Resources</h4>
                                <ul className="space-y-2">
                                    <li><a href="/promotions" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300">Rewards</a></li>
                                    <li><a href="/brand" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300">Brands</a></li>
                                    <li><a href="/simulatesensor" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300">Simulate</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                        <p className="text-gray-400">© 2024 SolarNet. All Rights Reserved. | Built with ❤️ for a greener future</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}