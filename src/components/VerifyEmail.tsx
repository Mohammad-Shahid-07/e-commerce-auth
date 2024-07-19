import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { Button } from "./ui/button";

const VerifyEmail = () => {
  return (
    <Card className="mx-auto max-w-lg p-10">
      <CardHeader className="mb-8 space-y-8">
        <CardTitle className="text-center font-semibold">
          Verify your email
        </CardTitle>
        <CardDescription className="text-center">
          Enter the 8 digit code you have received on swa***@gmail.com
        </CardDescription>
      </CardHeader>
      <CardContent>
        <InputOTP maxLength={8}>
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
      </CardContent>
      <CardFooter className="">
        <Button type="submit" className="w-full">
          Verify
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VerifyEmail;
