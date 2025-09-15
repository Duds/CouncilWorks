"use client";

import { useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MFAVerification } from "@/components/auth/mfa-verification";
import { Separator } from "@/components/ui/separator";
import type { Route } from "next";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaLoading, setMfaLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for OAuth errors in URL parameters
  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError) {
      switch (oauthError) {
        case "google":
          setError("Google sign-in failed. Please check your Google account settings or try again.");
          break;
        case "azure-ad":
          setError("Microsoft sign-in failed. Please check your Microsoft account settings or try again.");
          break;
        case "Configuration":
          setError("OAuth configuration error. Please contact support.");
          break;
        case "AccessDenied":
          setError("Access denied. You may have cancelled the sign-in process.");
          break;
        default:
          setError(`Sign-in failed: ${oauthError}`);
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else if (result?.ok) {
        // Check if MFA is required
        const session = await getSession();
        if (session?.user?.mfaRequired) {
          setMfaRequired(true);
        } else {
          // Force immediate redirect to dashboard
          console.log("Login successful, redirecting immediately...");
          window.location.replace("/dashboard");
        }
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMFAVerify = async (token: string) => {
    setMfaLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        mfaToken: token,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Invalid MFA token");
      } else if (result?.ok) {
        // Force immediate redirect to dashboard
        console.log("MFA verification successful, redirecting...");
        window.location.replace("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "MFA verification failed");
    } finally {
      setMfaLoading(false);
    }
  };

  const handleBackupCode = async (code: string) => {
    setMfaLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        mfaToken: code, // We'll modify the auth logic to handle backup codes
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Invalid backup code");
      } else if (result?.ok) {
        // Force immediate redirect to dashboard
        console.log("Backup code verification successful, redirecting...");
        window.location.replace("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Backup code verification failed");
    } finally {
      setMfaLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true);
    setError("");

    try {
      console.log(`Attempting OAuth sign-in with provider: ${provider}`);
      const result = await signIn(provider, { callbackUrl: "/dashboard" });
      console.log("OAuth sign-in result:", result);
    } catch (err) {
      console.error("OAuth sign-in error:", err);
      setError(`An error occurred with ${provider} sign-in. Please try again.`);
      setIsLoading(false);
    }
  };

  if (mfaRequired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <MFAVerification
          onVerify={handleMFAVerify}
          onBackupCode={handleBackupCode}
          loading={mfaLoading}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-foreground">
            Sign in to Aegrid
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Or{" "}
            <Link
              href="/auth/register"
              className="font-medium text-primary hover:text-primary/80"
            >
              create a new account
            </Link>
          </p>
        </div>

        {/* OAuth Providers */}
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn("google")}
            disabled={isLoading}
            className="w-full"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn("azure-ad")}
            disabled={isLoading}
            className="w-full"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"
              />
            </svg>
            Continue with Microsoft
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </div>

          <div className="text-center">
            <Link
              href={"/auth/forgot-password" as Route}
              className="text-sm text-primary hover:text-primary/80"
            >
              Forgot your password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
