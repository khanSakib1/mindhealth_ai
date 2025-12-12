import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Welcome</h2>
        <p className="text-sm text-muted-foreground">
          Sign in to begin your journey
        </p>
      </div>
      <LoginForm />
    </>
  );
}
