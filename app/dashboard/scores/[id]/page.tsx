"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft } from "lucide-react";
import { Score } from "@/types/score";
import { ScoreResultCard } from "@/components/scoring/score-result-card";

export default function ScoreDetailPage() {
  const router = useRouter();
  const params = useParams();
  const scoreId = params.id as string;

  const [score, setScore] = useState<Score | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadScore();
  }, [scoreId]);

  const loadScore = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/scores/${scoreId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load score");
      }

      setScore(data.score);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load score");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !score) {
    return (
      <div className="min-h-screen bg-muted/30 p-4">
        <div className="container mx-auto max-w-4xl">
          <Alert variant="destructive">
            <AlertDescription>{error || "Score not found"}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Link href="/dashboard/scores">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Scores
              </Button>
            </Link>
            <div className="text-sm text-muted-foreground">
              Scored on {new Date(score.created_at).toLocaleDateString()}
            </div>
          </div>

          <ScoreResultCard
            score={score}
            onScoreAnother={() => router.push("/dashboard/scoring")}
          />
        </div>
      </div>
    </div>
  );
}
