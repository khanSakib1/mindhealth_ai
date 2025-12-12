import { AppLogo } from "@/components/icons";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <Link href="/" className="flex items-center gap-2 mb-2">
            <AppLogo className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">MindfulJourney</h1>
          </Link>
          <p className="text-sm text-muted-foreground">Your AI-Powered Mental Health Companion</p>
        </div>
        {children}
      </div>
    </div>
  );
}
