"use client"
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
 
      <div className="w-full max-w-lg space-y-8 rounded-3xl border p-6">
        <div className="px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Login
          </h2>
          <p className="mt-2 text-center text-xl text-gray-600">
            Welcome back to ECOMMERCE
          </p>
          <p className="mt-2 text-center text-sm text-gray-500">
            The next gen business marketplace
          </p>
          <form className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              >
                LOGIN
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <p className="mt-2 text-center text-sm text-gray-600">
              Don&rsquo;t have an Account?{" "}
              <Link
                href="/signup"
                className="font-medium text-black hover:text-gray-800"
              >
                SIGN UP
              </Link>
            </p>
          </div>
        </div>
      </div>

  );
};

export default LoginForm;
