"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  TrendingUp,
  Crown,
  Upload,
  Loader2,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function DashboardPage() {
  const router = useRouter();
  const { user, userProfile, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !userProfile) {
    return null;
  }

  const isPro = userProfile.subscription_tier === "pro";

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">Boost</span>
            <span className="text-2xl font-bold text-foreground">MyCV</span>
          </Link>

          <div className="flex items-center gap-4">
            <Badge variant={isPro ? "default" : "secondary"}>
              {isPro ? (
                <>
                  <Crown className="mr-1 h-3 w-3" />
                  Pro
                </>
              ) : (
                "Free"
              )}
            </Badge>
            <Link href="/profile">
              <Button variant="ghost" size="sm">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {userProfile.full_name}!
            </h1>
            <p className="text-muted-foreground">
              Manage your CVs and track your optimization progress
            </p>
          </div>

          {!isPro && (
            <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">
                        Upgrade to Professional
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Get unlimited CVs, unlimited scoring, and AI-powered
                      auto-boost for just $9/month
                    </p>
                  </div>
                  <Button>
                    <Crown className="mr-2 h-4 w-4" />
                    Upgrade Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Your CVs</h3>
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">0</div>
                <p className="text-sm text-muted-foreground">
                  {isPro ? "Unlimited" : "Maximum 2 CVs"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Scores This Month</h3>
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">0</div>
                <p className="text-sm text-muted-foreground">
                  {isPro ? "Unlimited scoring" : "5 scores remaining"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Account Status</h3>
                  <Settings className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  {isPro ? "Pro" : "Free"}
                </div>
                <p className="text-sm text-muted-foreground">
                  Member since{" "}
                  {new Date(userProfile.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Your CVs</h2>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No CVs uploaded yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Upload your first CV to get started with AI-powered
                  optimization
                </p>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Your First CV
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Recent Activity</h2>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p>No activity yet. Start by uploading a CV!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
