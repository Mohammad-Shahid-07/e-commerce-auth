"use client";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { signup } from "@/auth";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import VerifyEmail from "./VerifyEmail";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

const SignupForm: React.FC = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    try {
      const res = await signup(data);
      setLoading(false);
      if (res.success) {
        setEmail(data.email);
        setEmailSent(true);
      }
      return toast.success(res.message);
      router.refresh();
    } catch (error) {
      setLoading(false);
      console.error("An error occurred:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  if (emailSent) {
    return <VerifyEmail email={email} />;
  }

  return (
    <Card className="mx-auto mt-5 w-full max-w-lg space-y-8 rounded-3xl border border-[#C1C1C1] p-6">
      <CardHeader className="mb-8 space-y-8">
        <CardTitle className="text-center text-3xl font-bold tracking-tight text-foreground">
          Create a new account
        </CardTitle>
        <CardDescription className="text-center">
          Enter your details below to sign up
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            className="space-y-6 border-none"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="you@example.com" />
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
                    <Input type="password" {...field} placeholder="********" />
                  </FormControl>
                  <FormDescription>
                    Password must be at least 8 characters long.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              size={"lg"}
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign up"}
            </Button>

            <p className="pb-12 pt-6 text-center text-sm">
              Have an Account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:text-primary/90"
                prefetch={false}
              >
                Login
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
