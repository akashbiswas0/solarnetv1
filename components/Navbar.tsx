import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

interface NavItem {
  href: string;
  label: string;
}

export default function Navbar() {
    const navItems: NavItem[] = [
        { href: "/sensor", label: "Add Sensor" },
        { href: "/simulatesensor", label: "Simulate" },
    ];

    const mobileNavItems: NavItem[] = [
        { href: "/sensor", label: "Add Sensor" },
        
    ];

    return (
        <nav className="fixed top-0 left-0 w-full z-30 bg-white/30 backdrop-blur-md border-b border-emerald-200 shadow-lg">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
                {/* Logo */}
                <Link href="/landing" legacyBehavior>
                    <a className="flex items-center space-x-3 group">
                        
                        <span className="text-2xl md:text-3xl font-extrabold text-emerald-700 group-hover:text-emerald-900 transition-colors">SolarNet</span>
                    </a>
                </Link>
                {/* Nav Links */}
                <div className="hidden md:flex items-center space-x-2">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href} legacyBehavior>
                            <a className="px-4 py-2 rounded-lg font-semibold text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900 transition-colors duration-150 focus:bg-emerald-200 focus:outline-none">
                                {item.label}
                            </a>
                        </Link>
                    ))}
                </div>
                {/* Connect Button */}
                <div className="flex items-center space-x-2">
                    <ConnectButton chainStatus="name" showBalance={false} accountStatus={{ smallScreen: "avatar", largeScreen: "full" }} />
                </div>
            </div>
            {/* Mobile Nav */}
            <div className="md:hidden flex items-center justify-between px-4 pb-2">
                <div className="flex-1 flex items-center justify-center space-x-2">
                    {mobileNavItems.map((item) => (
                        <Link key={item.href} href={item.href} legacyBehavior>
                            <a className="px-3 py-1 rounded-lg font-semibold text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900 transition-colors duration-150 focus:bg-emerald-200 focus:outline-none text-sm">
                                {item.label}
                            </a>
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}