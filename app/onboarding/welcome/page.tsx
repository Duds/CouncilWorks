"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, Users, Database, Upload, CheckCircle, ArrowRight } from "lucide-react";

interface OnboardingData {
  organisationName: string;
  domain: string;
  trialType: 'blank' | 'sample' | 'import';
}

export default function OnboardingWelcomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<OnboardingData>({
    organisationName: "",
    domain: "",
    trialType: 'blank'
  });

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/auth/sign-in");
      return;
    }

    // Auto-detect domain from email
    if (session.user?.email && !data.domain) {
      const emailDomain = session.user.email.split('@')[1];
      setData(prev => ({ ...prev, domain: emailDomain }));
    }
  }, [session, status, router, data.domain]);

  const handleOrganisationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/onboarding/organisation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.organisationName,
          domain: data.domain,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create organisation');
      }

      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create organisation');
    } finally {
      setLoading(false);
    }
  };

  const handleTrialSelection = async (trialType: 'blank' | 'sample' | 'import') => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/onboarding/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trialType }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to setup trial');
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to setup trial');
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {step > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
              </div>
              <span className="ml-2 text-sm font-medium">Organisation</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {step > 2 ? <CheckCircle className="w-4 h-4" /> : '2'}
              </div>
              <span className="ml-2 text-sm font-medium">Trial Setup</span>
            </div>
          </div>
        </div>

        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to Aegrid, {session.user?.name}!
          </h1>
          <p className="text-muted-foreground">
            Let's set up your organisation and get you started with asset management.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Organisation Setup */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Create Your Organisation
              </CardTitle>
              <CardDescription>
                Set up your organisation to start managing assets and inviting team members.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOrganisationSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="organisationName">Organisation Name</Label>
                  <Input
                    id="organisationName"
                    value={data.organisationName}
                    onChange={(e) => setData(prev => ({ ...prev, organisationName: e.target.value }))}
                    placeholder="e.g., City of Melbourne, ABC Council"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain</Label>
                  <Input
                    id="domain"
                    value={data.domain}
                    onChange={(e) => setData(prev => ({ ...prev, domain: e.target.value }))}
                    placeholder="e.g., melbourne.vic.gov.au"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    This will be used for team member invitations and organisation identification.
                  </p>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Creating..." : "Create Organisation"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Trial Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Choose Your Trial Setup
                </CardTitle>
                <CardDescription>
                  Select how you'd like to start with Aegrid. You can always change this later.
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Blank Account */}
              <Card 
                className={`cursor-pointer transition-all ${data.trialType === 'blank' ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
                onClick={() => setData(prev => ({ ...prev, trialType: 'blank' }))}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Blank Account
                  </CardTitle>
                  <CardDescription>
                    Start fresh with an empty asset register
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Clean slate to build your asset register</li>
                    <li>• Perfect for new organisations</li>
                    <li>• Full control over data structure</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Sample Data */}
              <Card 
                className={`cursor-pointer transition-all ${data.trialType === 'sample' ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
                onClick={() => setData(prev => ({ ...prev, trialType: 'sample' }))}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Sample Data
                  </CardTitle>
                  <CardDescription>
                    Explore with pre-populated sample assets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Pre-loaded with sample council assets</li>
                    <li>• See features in action immediately</li>
                    <li>• Great for evaluation and demos</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Import Data */}
              <Card 
                className={`cursor-pointer transition-all ${data.trialType === 'import' ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
                onClick={() => setData(prev => ({ ...prev, trialType: 'import' }))}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Import Data
                  </CardTitle>
                  <CardDescription>
                    Upload your existing asset data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Import from Excel, CSV, or other formats</li>
                    <li>• Migrate from existing systems</li>
                    <li>• Preserve your current data structure</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Button 
              onClick={() => handleTrialSelection(data.trialType)}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Setting up..." : "Complete Setup"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
