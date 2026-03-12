"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, Loader2, Eye, Trash2 } from "lucide-react";
import { ScoreListItem } from "@/types/score";
import Link from "next/link";

export function ScoreList() {
  const [scores, setScores] = useState<ScoreListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadScores = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/v1/scores");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load scores");
      }

      setScores(data.scores);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load scores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScores();
  }, []);

  const handleDelete = async (scoreId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this score? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeletingId(scoreId);
    try {
      const response = await fetch(`/api/v1/scores/${scoreId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete score");
      }

      await loadScores();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete score");
    } finally {
      setDeletingId(null);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your CV Scores</h2>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {scores.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No scores yet</h3>
              <p className="text-muted-foreground mb-6">
                Score a CV against a job description to see results here
              </p>
              <Link href="/dashboard/scoring">
                <Button>Score Your First CV</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {scores.map((score) => (
                <div
                  key={score.score_id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-1">
                      <h3 className="font-medium">{score.cv_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {score.job_title} •{" "}
                        {new Date(score.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(score.overall_score)}`}>
                      {score.overall_score}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link href={`/dashboard/scores/${score.score_id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(score.score_id)}
                      disabled={deletingId === score.score_id}
                    >
                      {deletingId === score.score_id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
