"use client";

import { useEffect, useState } from "react";
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
  Target,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { CVList } from "@/components/cv/cv-list";
import { ScoreListItem } from "@/types/score";

export default function DashboardPage() {
  const router = useRouter();
  const { user, userProfile, loading, signOut } = useAuth();
  const [cvCount, setCvCount] = useState(0);
  const [scoresThisMonth, setScoresThisMonth] = useState(0);
  const [recentScores, setRecentScores] = useState<ScoreListItem[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      setLoadingStats(true);

      // Load CVs
      const cvsResponse = await fetch("/api/v1/cvs");
      const cvsData = await cvsResponse.json();
      if (cvsResponse.ok) {
        setCvCount(cvsData.cvs.length);
      }

      // Load scores
      const scoresResponse = await fetch("/api/v1/scores");
      const scoresData = await scoresResponse.json();
      if (scoresResponse.ok) {
        // Count scores from this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const thisMonthScores = scoresData.scores.filter((score: ScoreListItem) => {
          return new Date(score.created_at) >= startOfMonth;
        });

        setScoresThisMonth(thisMonthScores.length);
        setRecentScores(scoresData.scores.slice(0, 3));
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

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
  const scoresRemaining = isPro ? "Unlimited" : `${5 - scoresThisMonth} remaining`;

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {userProfile.full_name}!
              </h1>
              <p className="text-muted-foreground">
                Manage your CVs and track your optimization progress
              </p>
            </div>
            <Link href="/dashboard/scoring">
              <Button size="lg">
                <Target className="mr-2 h-5 w-5" />
                Score CV
              </Button>
            </Link>
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
                <div className="text-3xl font-bold mb-2">
                  {loadingStats ? <Loader2 className="h-8 w-8 animate-spin" /> : cvCount}
                </div>
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
                <div className="text-3xl font-bold mb-2">
                  {loadingStats ? <Loader2 className="h-8 w-8 animate-spin" /> : scoresThisMonth}
                </div>
                <p className="text-sm text-muted-foreground">
                  {scoresRemaining}
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

          <CVList isPro={isPro} />

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Recent Scores</h2>
                  <Link href="/dashboard/scores">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {loadingStats ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </div>
                ) : recentScores.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No scores yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentScores.map((score) => (
                      <Link
                        key={score.score_id}
                        href={`/dashboard/scores/${score.score_id}`}
                      >
                        <div className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{score.cv_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {score.job_title}
                              </p>
                            </div>
                            <div
                              className={`text-lg font-bold ${
                                score.overall_score >= 75
                                  ? "text-green-600"
                                  : score.overall_score >= 60
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }`}
                            >
                              {score.overall_score}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Quick Links</h2>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/dashboard/scoring">
                    <Button variant="outline" className="w-full justify-start">
                      <Target className="mr-2 h-4 w-4" />
                      Score a CV
                    </Button>
                  </Link>
                  <Link href="/dashboard/jobs">
                    <Button variant="outline" className="w-full justify-start">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Saved Jobs
                    </Button>
                  </Link>
                  <Link href="/dashboard/scores">
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      All Scores
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
