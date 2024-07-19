import React from "react";
import Link from "next/link";
import { Input } from "./ui/input";
const Navbar = () => {
  return (
    <header className="border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            ECOMMERCE
          </Link>
          <nav className="hidden md:block">
            <ul className="flex space-x-4">
              <li>
                <Link href="/categories" className="text-sm">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/sale" className="text-sm">
                  Sale
                </Link>
              </li>
              <li>
                <Link href="/clearance" className="text-sm">
                  Clearance
                </Link>
              </li>
              <li>
                <Link href="/new-stock" className="text-sm">
                  New stock
                </Link>
              </li>
              <li>
                <Link href="/trending" className="text-sm">
                  Trending
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            <Input
              type="search"
              placeholder="Search"
              className="hidden md:block"
            />
            <button aria-label="Search" className="md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <button aria-label="Cart">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 py-2 text-center text-xs">
        <p>Get 10% off on business sign up</p>
      </div>
    </header>
  );
};

export default Navbar;
