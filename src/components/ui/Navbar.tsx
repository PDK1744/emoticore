"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <Link href="/" className="flex items-center" onClick={closeMenu}>
              <span className="text-xl font-bold text-gray-900">EmotiCore</span>
            </Link>
          </div>
          <div className="hidden md:flex md:space-x-8 md:items-center">
            <Link href="/about" className="text-gray-700 hover:text-gray-900">
              About
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-gray-900">
              Pricing
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900">
              Contact
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/sign-in">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Sign up</Button>
            </Link>
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 focus:outline-none"
              aria-expanded={menuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {menuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
            <Link href="/about">
              <a
                onClick={closeMenu}
                className="block text-base font-medium text-gray-700 hover:text-gray-900"
              >
                About
              </a>
            </Link>
            <Link href="/pricing">
              <a
                onClick={closeMenu}
                className="block text-base font-medium text-gray-700 hover:text-gray-900"
              >
                Pricing
              </a>
            </Link>
            <Link href="/contact">
              <a
                onClick={closeMenu}
                className="block text-base font-medium text-gray-700 hover:text-gray-900"
              >
                Contact
              </a>
            </Link>
          </div>
          <div className="border-t border-gray-200 pt-4 pb-3">
            <div className="space-y-1 px-2">
              <Link href="/sign-in">
                <a
                  onClick={closeMenu}
                  className="block text-base font-medium text-gray-700 hover:text-gray-900"
                >
                  Log in
                </a>
              </Link>
              <Link href="/signup">
                <a
                  onClick={closeMenu}
                  className="block text-base font-medium text-gray-700 hover:text-gray-900"
                >
                  Sign up
                </a>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

