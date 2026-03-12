"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Lightbulb, RotateCcw } from "lucide-react";
import { Score } from "@/types/score";
import Link from "next/link";

interface ScoreResultCardProps {
  score: Score;
  onScoreAnother: () => void;
}

export function ScoreResultCard({ score, onScoreAnother }: ScoreResultCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent Match";
    if (score >= 75) return "Strong Match";
    if (score >= 60) return "Good Match";
    if (score >= 40) return "Fair Match";
    return "Needs Improvement";
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Your CV Score</h2>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className={`text-7xl font-bold ${getScoreColor(score.overall_score)}`}>
              {score.overall_score}
            </div>
            <p className={`text-xl font-semibold ${getScoreColor(score.overall_score)}`}>
              {getScoreLabel(score.overall_score)}
            </p>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className={`h-full ${
                  score.overall_score >= 75
                    ? "bg-green-600"
                    : score.overall_score >= 60
                    ? "bg-yellow-600"
                    : "bg-red-600"
                }`}
                style={{ width: `${score.overall_score}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {score.cv_name} for {score.job_title}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Category Breakdown</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(score.category_scores).map(([key, value]) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium capitalize">
                    {key.replace(/_/g, " ")}
                  </span>
                  <span className={`text-sm font-bold ${getScoreColor(value)}`}>
                    {value}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${
                      value >= 75
                        ? "bg-green-600"
                        : value >= 60
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strengths */}
      {score.strengths.length > 0 && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <h3 className="text-xl font-semibold text-green-900">Strengths</h3>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {score.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2 text-green-900">
                  <span className="text-green-600 mt-1">•</span>
                  <span className="text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Weaknesses */}
      {score.weaknesses.length > 0 && (
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <h3 className="text-xl font-semibold text-red-900">
                Areas for Improvement
              </h3>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {score.weaknesses.map((weakness, idx) => (
                <li key={idx} className="flex items-start gap-2 text-red-900">
                  <span className="text-red-600 mt-1">•</span>
                  <span className="text-sm">{weakness}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {score.recommendations.length > 0 && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-600" />
              <h3 className="text-xl font-semibold text-blue-900">
                Recommendations
              </h3>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {score.recommendations.map((recommendation, idx) => (
                <li key={idx} className="flex items-start gap-2 text-blue-900">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-sm">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Link href={`/dashboard/scores/${score.score_id}`}>
          <Button variant="outline">View Full Details</Button>
        </Link>
        <Button onClick={onScoreAnother}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Score Another CV
        </Button>
      </div>
    </div>
  );
}
