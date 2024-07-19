import Link from "next/link";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import VerifyEmail from "./VerifyEmail";

const SignupForm = () => {
  return (
    <div className="mx-auto mt-5 w-full max-w-lg space-y-8 rounded-3xl border border-[#C1C1C1] p-6">
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
        Create a new account
      </h2>

      <form className="space-y-6 border-none" action="#" method="POST">
        <div>
          <Label htmlFor="name" className="block text-sm font-medium">
            Name
          </Label>
          <div className="mt-1">
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className=""
              placeholder="John Doe"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="email" className="block text-sm font-medium">
            Email address
          </Label>
          <div className="mt-1">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className=""
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div>
          <Label
            htmlFor="password"
            className="block text-sm font-medium text-muted-foreground"
          >
            Password
          </Label>
          <div className="mt-1">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className=""
              placeholder="********"
            />
          </div>
        </div>

        <Button type="submit" className="w-full" size={"lg"}>
          Sign up
        </Button>

        <p className="pb-12 pt-6 text-center text-sm">
          Have an Account?{" "}
          <Link
            href="#"
            className="font-medium text-primary hover:text-primary/90"
            prefetch={false}
          >
            Login
          </Link>
        </p>
      </form>
      <VerifyEmail />
    </div>
  );
};
export default SignupForm;
