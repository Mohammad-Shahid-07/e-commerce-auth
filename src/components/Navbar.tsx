import React from "react";
import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
const Navbar = () => {
  return (
    <header className="container border-b border-gray-200 px-4 py-3">
      <ul className="flex justify-end gap-3 text-sm">
        <li>
          <Link href="#">Help</Link>
        </li>
        <li>
          <Link href="#">Orders & Returns</Link>
        </li>
        <li>Hi, John</li>
      </ul>
      <div className="">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-3xl font-bold">
            ECOMMERCE
          </Link>
          <nav className="hidden md:block">
            <ul className="flex space-x-4 font-semibold">
              <li>
                <Link href="/categories">Categories</Link>
              </li>
              <li>
                <Link href="/sale">Sale</Link>
              </li>
              <li>
                <Link href="/clearance">Clearance</Link>
              </li>
              <li>
                <Link href="/new-stock">New stock</Link>
              </li>
              <li>
                <Link href="/trending">Trending</Link>
              </li>
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            <Search strokeWidth={1} /> <ShoppingCart strokeWidth={1} />
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
