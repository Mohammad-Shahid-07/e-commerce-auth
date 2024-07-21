import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { verifyCode } from "@/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface VerifyEmailProps {
  email: string;
}

const FormSchema = z.object({
  code: z.string().min(8, {
    message: "Your one-time password must be 8 characters.",
  }),
  email: z.string().email(),
});

const VerifyEmail = ({ email }: VerifyEmailProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
      email: email,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    try {
      const res = await verifyCode(data);
      setLoading(false);

      if (res.success) {
        toast.success("Verification successful! You can Login now", {
          action: {
            label: "Login",
            onClick: () => router.push("/login"),
          },
        });
      } else {
        toast.error(res.message || "Verification failed. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      console.error("An error occurred:", error);
      toast.error("An error occurred. Please try again.");
    }
  }

  return (
    <Card className="mx-auto mt-10 max-w-lg p-10">
      <CardHeader className="mb-8 space-y-8">
        <CardTitle className="text-center font-semibold">
          Verify your email
        </CardTitle>
        <CardDescription className="text-center">
          Enter the 8 digit code you have received on {email}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={8} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                        <InputOTPSlot index={6} />
                        <InputOTPSlot index={7} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the one-time password sent to your email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Submit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default VerifyEmail;
