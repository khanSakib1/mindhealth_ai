import { SignupForm } from "@/components/auth/signup-form";
import Link from "next/link";

export default function SignupPage() {
  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Create an Account</h2>
        <p className="text-sm text-muted-foreground">
          Start your journey to mental wellness
        </p>
      </div>
      <SignupForm />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </>
  );
}
