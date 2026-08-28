"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Menu, X, MessageCircle } from "lucide-react";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import { CONTACT_INFO } from "@/lib/constants";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // When scrolled, text is black. When transparent, text is white (inverted by blend mode)
  const navTextClass = scrolled ? "text-black" : "text-white";
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-999 transition-all duration-500 ${
          scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <nav
          className={`container mx-auto px-6 lg:px-5 md:py-2 py-3 flex items-center justify-between transition-all duration-300 ${
            scrolled ? "" : "mix-blend-difference" // Magic property for auto color inversion
          }`}
        >
          {/* Logo Image */}
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Desktop Logo */}

            <div className="relative w-70 h-25 hidden md:block">
              <Image
                src="/images/logo1111.gif"
                alt="Christopher Ryan Properties"
                fill
                className={`object-contain transition-all duration-300 drop-shadow-[0_4px_8px_#37526E] ${
                  isScrolled ? "invert" : ""
                }`}
                sizes="288px"
                priority
              />
            </div>
            {/* Mobile Logo */}
            <div className="relative w-35 h-12 md:hidden">
              <Image
                src="/images/logo1111.gif"
                alt="Christopher Ryan Properties"
                fill
                className="object-contain"
                sizes="160px"
                priority
              />
            </div>
          </Link>

          {/* Right Side: Phone + Let's Talk + Menu */}
          <div className={`flex items-center gap-3 md:gap-5 ${navTextClass}`}>
            {/* Phone Number */}
            <a
              href={`tel:${CONTACT_INFO.phone}`}
              className="hidden md:flex items-center gap-2 transition-colors hover:opacity-70"
            >
              <Phone size={16} className="text-inherit" />
              <span className="text-sm font-medium tracking-wide">
                {CONTACT_INFO.phone}
              </span>
            </a>

            {/* Divider */}
            <div
              className={`hidden md:block w-px h-6 ${scrolled ? "bg-black/20" : "bg-white/30"}`}
            />

            {/* Let's Talk Button */}
            <Link
              href="/contact"
              className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border backdrop-blur-sm transition-all duration-300 ${
                scrolled
                  ? "border-black/10 bg-black/5 hover:bg-black hover:text-white"
                  : "border-white/20 bg-white/10 hover:bg-white hover:text-black"
              }`}
            >
              <MessageCircle size={18} className="text-inherit" />
              <span className="text-sm font-medium">Let&apos;s Talk</span>
            </Link>

            {/* Divider */}
            <div
              className={`hidden sm:block w-px h-6 ${scrolled ? "bg-black/20" : "bg-white/30"}`}
            />

            {/* Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
                isMenuOpen
                  ? "bg-white text-black border-white"
                  : scrolled
                    ? "bg-black/5 border-black/10 hover:bg-black hover:text-white"
                    : "bg-white/10 border-white/20 hover:bg-white hover:text-black"
              }`}
              aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
            >
              {isMenuOpen ? (
                <>
                  <X size={18} className="text-inherit" />
                  <span className="hidden sm:inline text-sm font-medium">
                    Close
                  </span>
                </>
              ) : (
                <>
                  <Menu size={18} className="text-inherit" />
                  <span className="hidden sm:inline text-sm font-medium">
                    Menu
                  </span>
                </>
              )}
            </button>
          </div>
        </nav>
      </header>

      <FullscreenMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}
