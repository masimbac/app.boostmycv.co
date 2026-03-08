"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, Loader2, Eye, Trash2 } from "lucide-react";
import { UploadCVDialog } from "./upload-cv-dialog";
import { CVListItem } from "@/types/cv";
import Link from "next/link";

interface CVListProps {
  isPro: boolean;
}

export function CVList({ isPro }: CVListProps) {
  const [cvs, setCvs] = useState<CVListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadCVs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/v1/cvs");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load CVs");
      }

      setCvs(data.cvs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load CVs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCVs();
  }, []);

  const handleDelete = async (cvId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this CV? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeletingId(cvId);
    try {
      const response = await fetch(`/api/v1/cvs/${cvId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete CV");
      }

      await loadCVs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete CV");
    } finally {
      setDeletingId(null);
    }
  };

  const canUploadMore = isPro || cvs.length < 2;

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
            <h2 className="text-xl font-semibold">Your CVs</h2>
            <Button
              onClick={() => setShowUpload(true)}
              disabled={!canUploadMore}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload CV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!canUploadMore && (
            <Alert className="mb-4">
              <AlertDescription>
                You've reached the limit of 2 CVs on the free plan. Upgrade to
                Pro for unlimited CVs.
              </AlertDescription>
            </Alert>
          )}

          {cvs.length === 0 ? (
            <div className="text-center py-12">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No CVs uploaded yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Upload your first CV to get started with AI-powered
                optimization
              </p>
              <Button onClick={() => setShowUpload(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Your First CV
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {cvs.map((cv) => (
                <div
                  key={cv.cv_id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <h3 className="font-medium">{cv.cv_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Updated{" "}
                        {new Date(cv.updated_at).toLocaleDateString()} •
                        Version {cv.version}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/cvs/${cv.cv_id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(cv.cv_id)}
                      disabled={deletingId === cv.cv_id}
                    >
                      {deletingId === cv.cv_id ? (
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

      {showUpload && (
        <UploadCVDialog
          onSuccess={loadCVs}
          onClose={() => setShowUpload(false)}
        />
      )}
    </>
  );
}
