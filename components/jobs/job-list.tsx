"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Briefcase, Loader2, Trash2, FileCheck } from "lucide-react";
import { JobListItem } from "@/types/job";

export function JobList() {
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/v1/jobs");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load jobs");
      }

      setJobs(data.jobs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleDelete = async (jobId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this job? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeletingId(jobId);
    try {
      const response = await fetch(`/api/v1/jobs/${jobId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete job");
      }

      await loadJobs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete job");
    } finally {
      setDeletingId(null);
    }
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
            <h2 className="text-xl font-semibold">Saved Jobs</h2>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No saved jobs yet</h3>
              <p className="text-muted-foreground mb-6">
                Jobs you save during scoring will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job.job_id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <h3 className="font-medium">{job.job_title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {job.company ? `${job.company} • ` : ""}
                        Saved {new Date(job.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href={`/dashboard/scoring?job_id=${job.job_id}`}>
                      <Button variant="outline" size="sm">
                        <FileCheck className="mr-2 h-4 w-4" />
                        Score CV
                      </Button>
                    </a>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(job.job_id)}
                      disabled={deletingId === job.job_id}
                    >
                      {deletingId === job.job_id ? (
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
