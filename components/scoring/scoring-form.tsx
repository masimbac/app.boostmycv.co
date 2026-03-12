"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, FileText, CheckCircle } from "lucide-react";
import { CVListItem } from "@/types/cv";
import { Score } from "@/types/score";
import { ScoreResultCard } from "./score-result-card";

interface ScoringFormProps {
  isPro: boolean;
  scoresUsedThisMonth: number;
}

export function ScoringForm({ isPro, scoresUsedThisMonth }: ScoringFormProps) {
  const [cvs, setCvs] = useState<CVListItem[]>([]);
  const [selectedCvId, setSelectedCvId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [saveJob, setSaveJob] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCvs, setLoadingCvs] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Score | null>(null);

  useEffect(() => {
    loadCVs();
  }, []);

  const loadCVs = async () => {
    try {
      setLoadingCvs(true);
      const response = await fetch("/api/v1/cvs");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load CVs");
      }

      setCvs(data.cvs);
      if (data.cvs.length > 0) {
        setSelectedCvId(data.cvs[0].cv_id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load CVs");
    } finally {
      setLoadingCvs(false);
    }
  };

  const handleScore = async () => {
    if (!selectedCvId) {
      setError("Please select a CV");
      return;
    }

    if (!jobDescription.trim() || jobDescription.length < 50) {
      setError("Please enter a job description (at least 50 characters)");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/v1/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cv_id: selectedCvId,
          job_description: jobDescription,
          save_job: saveJob,
          job_details: {
            job_title: jobTitle || null,
            company: company || null,
            location: location || null,
            employment_type: employmentType || null,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to score CV");
      }

      setResult(data.score);
      // Reset form
      setJobDescription("");
      setJobTitle("");
      setCompany("");
      setLocation("");
      setEmploymentType("");
      setSaveJob(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to score CV");
    } finally {
      setLoading(false);
    }
  };

  const canScore = isPro || scoresUsedThisMonth < 5;

  if (loadingCvs) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (cvs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No CVs Available</h3>
          <p className="text-muted-foreground mb-6">
            Please upload a CV before scoring
          </p>
        </CardContent>
      </Card>
    );
  }

  if (result) {
    return (
      <ScoreResultCard
        score={result}
        onScoreAnother={() => setResult(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {!canScore && (
        <Alert>
          <AlertDescription>
            You've used all 5 free scores this month. Upgrade to Pro for
            unlimited scoring.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Job Description</h2>
          <p className="text-sm text-muted-foreground">
            Paste the job description or enter job details manually
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="jobDescription">
              Job Description *{" "}
              <span className="text-xs text-muted-foreground">
                ({jobDescription.length}/10000)
              </span>
            </Label>
            <Textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
              maxLength={10000}
              placeholder="Paste the full job description here..."
              className="mt-1"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="jobTitle">Job Title (Optional)</Label>
              <Input
                id="jobTitle"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., Senior Software Engineer"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="company">Company (Optional)</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., Acme Corp"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., San Francisco, CA"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="employmentType">Employment Type (Optional)</Label>
              <select
                id="employmentType"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="mt-1 w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select type...</option>
                <option value="Remote">Remote</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="saveJob"
              checked={saveJob}
              onChange={(e) => setSaveJob(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="saveJob" className="cursor-pointer">
              Save this job for future use
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Select CV</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {cvs.map((cv) => (
              <div
                key={cv.cv_id}
                onClick={() => setSelectedCvId(cv.cv_id)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedCvId === cv.cv_id
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{cv.cv_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Updated {new Date(cv.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  {selectedCvId === cv.cv_id && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleScore}
          disabled={loading || !canScore}
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scoring...
            </>
          ) : (
            "Score CV"
          )}
        </Button>
      </div>
    </div>
  );
}
