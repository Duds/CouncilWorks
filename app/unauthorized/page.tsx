import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";

/**
 * Unauthorized access page
 * @component UnauthorizedPage
 * @example
 * ```tsx
 * <UnauthorizedPage />
 * ```
 * @accessibility
 * - ARIA roles: main, heading
 * - Keyboard navigation: Tab through navigation elements
 * - Screen reader: Announces unauthorized access message
 */
export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Access Denied
          </h1>
          <p className="text-muted-foreground">
            You don't have permission to access this resource. Please contact your administrator if you believe this is an error.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <Link href="/auth/sign-in">
              Sign In with Different Account
            </Link>
          </Button>
        </div>
        
        <div className="mt-8 text-sm text-muted-foreground">
          <p>
            If you need access to this resource, please contact your system administrator.
          </p>
        </div>
      </div>
    </main>
  );
}
