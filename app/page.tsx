'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Playfair_Display, Inter } from 'next/font/google'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
  style: ['normal'],
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function Page() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <div className={`flex flex-col min-h-screen overflow-x-hidden bg-black text-foreground bg-dotted-grid ${inter.className}`}>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
          0% { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }

        .fade-in {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }

        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }
        .delay-3 { animation-delay: 0.6s; }
      `}</style>

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 flex flex-col sm:flex-row sm:items-center justify-between py-4 px-6 border-b border-neutral-800 bg-black/80 backdrop-blur-md">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/images/fc-logo.png" 
              alt="Farcaster Logo" 
              className="w-8 h-8"
              width={32}
              height={32}
            />
            <span className={`text-2xl md:text-3xl font-medium ${playfair.className}`}>
              GetGas
            </span>
          </Link>
          <button 
            className="sm:hidden p-2 hover:bg-[#8A63D2]/20 rounded-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
        <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:block border-t border-neutral-800/50 mt-4 sm:mt-0 sm:border-t-0`}>
          <nav className="flex flex-col sm:flex-row items-center">
            <Link 
              href="/transfer" 
              className="text-lg px-4 py-4 w-full text-center sm:w-auto transition-colors hover:bg-[#8A63D2]/20"
            >
              Transfer
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow pt-28">
        {/* Hero Section */}
        <section className="pt-16 md:pt-24 pb-32 md:pb-40 px-6 relative min-h-[90vh] flex">
          <div className="hero-glow" />
          <div className="max-w-[1200px] mx-auto relative z-10 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <h1 className={`text-4xl md:text-5xl lg:text-6xl font-medium mb-6 tracking-tight fade-in delay-1 ${playfair.className}`}>
                  Get ETH on the Superchain
                </h1>
                <Button 
                  size="lg" 
                  className="w-full md:w-auto !py-2 fade-in delay-3"
                  asChild
                >
                  <a href="https://warpcast.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    Get started
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 17l9.2-9.2M17 17V7H7"/>
                    </svg>
                  </a>
                </Button>
              </div>
              <div className="flex items-center justify-center fade-in delay-3">
                <Image 
                  src="/images/mobile.avif" 
                  alt="Mobile App" 
                  className="w-full max-w-[300px] rounded-lg shadow-lg"
                  width={300}
                  height={600}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 px-6 border-t border-neutral-800/50 scroll-animation">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="text-sm text-neutral-400">
            This website is unaffiliated with Merkle Manufactory and was created by a{" "}
            <a 
              href="https://warpcast.com/zain" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#8A63D2] hover:underline"
            >
              Farcaster user
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}