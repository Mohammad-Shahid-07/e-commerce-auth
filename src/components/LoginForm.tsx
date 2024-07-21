"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { login } from "@/auth";
import { useRouter } from "next/navigation";

const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof LoginSchema>) {
    setLoginError(null);

    const response = await login(data);

    if (!response.success) {
      setLoginError(response.message ?? "An error occurred during login");
    } else {
      router.refresh();
    }
  }

  return (
    <Card className="mx-auto mt-5 w-full max-w-lg space-y-8 rounded-3xl border border-[#C1C1C1] p-6">
      <CardHeader className="px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <CardTitle className="mt-6 text-center text-3xl font-bold text-gray-900">
          Login
        </CardTitle>
        <CardDescription className="mt-2 text-center text-xl text-gray-600">
          Welcome back to ECOMMERCE
        </CardDescription>
        <CardDescription className="mt-2 text-center text-sm text-gray-500">
          The next gen business marketplace
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative mt-1">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {loginError && (
              <p className="text-center text-red-500">{loginError}</p>
            )}

            <div>
              <Button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              >
                LOGIN
              </Button>
            </div>
          </form>
        </Form>

        <div className="mt-6">
          <p className="mt-2 text-center text-sm text-gray-600">
            Don&rsquo;t have an Account?{" "}
            <Link
              href="/signup"
              className="font-medium text-black hover:text-gray-800"
              prefetch={false}
            >
              SIGN UP
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
