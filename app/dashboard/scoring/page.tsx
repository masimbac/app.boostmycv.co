"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { ScoringForm } from "@/components/scoring/scoring-form";

export default function ScoringPage() {
  const router = useRouter();
  const { user, userProfile, loading } = useAuth();
  const [scoresUsedThisMonth, setScoresUsedThisMonth] = useState(0);
  const [loadingScores, setLoadingScores] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadScoreCount();
    }
  }, [user]);

  const loadScoreCount = async () => {
    try {
      setLoadingScores(true);
      const response = await fetch("/api/v1/scores");
      const data = await response.json();

      if (response.ok) {
        // Count scores from this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const thisMonthScores = data.scores.filter((score: { created_at: string }) => {
          return new Date(score.created_at) >= startOfMonth;
        });

        setScoresUsedThisMonth(thisMonthScores.length);
      }
    } catch (error) {
      console.error("Failed to load score count:", error);
    } finally {
      setLoadingScores(false);
    }
  };

  if (loading || loadingScores) {
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Score Your CV</h1>
            <p className="text-muted-foreground">
              Analyze how well your CV matches a job description
            </p>
            {!isPro && (
              <p className="text-sm text-muted-foreground mt-2">
                {scoresUsedThisMonth}/5 scores used this month
              </p>
            )}
          </div>

          <ScoringForm isPro={isPro} scoresUsedThisMonth={scoresUsedThisMonth} />
        </div>
      </div>
    </div>
  );
}
