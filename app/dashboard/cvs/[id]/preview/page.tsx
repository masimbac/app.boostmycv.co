"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  ArrowLeft,
  FileCode2,
  Download,
  Sparkles,
} from "lucide-react";
import type { TemplateMeta } from "@/lib/templates/registry";
import { CV } from "@/types/cv";
import { toast } from "sonner";

type LatexResponse = {
  template_id: string;
  template: TemplateMeta | null;
  output_path: string;
  cls_output_path?: string;
  output_directory: string;
  cls_download_url?: string;
  available_templates: string[];
  latex: string;
};

export default function CvLatexPreviewPage() {
  const params = useParams();
  const cvId = params.id as string;

  const [cv, setCv] = useState<CV | null>(null);
  const [loadingCv, setLoadingCv] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<LatexResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadingCv(true);
        const res = await fetch(`/api/v1/cvs/${cvId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load CV");
        if (!cancelled) setCv(data.cv);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load CV");
      } finally {
        if (!cancelled) setLoadingCv(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [cvId]);

  const generate = async () => {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch(`/api/v1/cvs/${cvId}/export/latex`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template_id: "awesome-cv-two-column-tech" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data as LatexResponse);
      toast.success("LaTeX generated — check server logs for full dump");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Generation failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setGenerating(false);
    }
  };

  const downloadTex = () => {
    const url = `/api/v1/cvs/${cvId}/export/latex?download=1&template=awesome-cv-two-column-tech`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const downloadCls = () => {
    window.open("/api/v1/templates/awesome-cv/cls", "_blank", "noopener,noreferrer");
  };

  if (loadingCv) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!cv) {
    return (
      <div className="min-h-screen bg-muted/30 p-4">
        <div className="container mx-auto max-w-4xl">
          <Alert variant="destructive">
            <AlertDescription>{error || "CV not found"}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href={`/dashboard/cvs/${cvId}`}>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to CV
            </Button>
          </Link>
          <div className="flex flex-wrap gap-2">
            <Button onClick={generate} disabled={generating}>
              {generating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate LaTeX
            </Button>
            <Button
              variant="secondary"
              onClick={downloadTex}
              disabled={generating}
            >
              <Download className="mr-2 h-4 w-4" />
              Download resume.tex
            </Button>
            <Button variant="outline" onClick={downloadCls}>
              <Download className="mr-2 h-4 w-4" />
              Download awesome-cv.cls
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileCode2 className="h-5 w-5 text-primary" />
              <div>
                <h1 className="text-xl font-semibold">LaTeX preview</h1>
                <p className="text-sm text-muted-foreground">
                  {cv.cv_name} — Awesome-CV (XeLaTeX). Upload{" "}
                  <code className="text-xs">resume.tex</code> and{" "}
                  <code className="text-xs">awesome-cv.cls</code> together in
                  Overleaf (same folder), then set the compiler to XeLaTeX.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {result?.template && (
              <div className="rounded-lg border bg-background p-4 text-sm space-y-1">
                <p className="font-medium">{result.template.display_name}</p>
                {result.template.short_description && (
                  <p className="text-muted-foreground">
                    {result.template.short_description}
                  </p>
                )}
                {result.template.upstream?.compile_note && (
                  <p className="text-muted-foreground text-xs pt-2 border-t mt-2">
                    {result.template.upstream.compile_note}
                  </p>
                )}
                <p className="text-xs font-mono pt-2 text-muted-foreground break-all">
                  Server temp: {result.output_path}
                  {result.cls_output_path && (
                    <>
                      <br />
                      {result.cls_output_path}
                    </>
                  )}
                </p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">
                Generated source
              </label>
              <textarea
                readOnly
                className="w-full min-h-[480px] font-mono text-xs rounded-md border bg-muted/30 p-3 resize-y"
                value={result?.latex || ""}
                placeholder='Click "Generate LaTeX" to build Awesome-CV source from this CV…'
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
