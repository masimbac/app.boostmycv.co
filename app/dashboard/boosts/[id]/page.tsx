"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Boost, Change, ChangeSection } from "@/types/boost";
import { CV, ParsedCVData } from "@/types/cv";
import { CVSectionRenderer } from "@/components/boost/cv-section-renderer";
import { SuggestionCard } from "@/components/boost/suggestion-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Sparkles,
  Check,
  Loader2,
  Lightbulb,
  Eye,
  Pencil,
  Save,
  ChevronDown,
  ChevronRight,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  applySingleChange,
  revertSingleChange,
  applyMultipleChanges,
} from "@/lib/cv-changes";

const SECTION_ORDER: ChangeSection[] = [
  "personal_info",
  "professional_summary",
  "work_experience",
  "education",
  "skills",
  "projects",
  "certifications",
];

const SECTION_LABELS: Record<string, string> = {
  personal_info: "Personal Info",
  professional_summary: "Summary",
  work_experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
};

export default function BoostEditorPage() {
  const router = useRouter();
  const params = useParams();
  const boostId = params.id as string;

  const [boost, setBoost] = useState<Boost | null>(null);
  const [originalCV, setOriginalCV] = useState<CV | null>(null);
  const [workingCopy, setWorkingCopy] = useState<ParsedCVData | null>(null);
  const [appliedChangeIds, setAppliedChangeIds] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cvName, setCvName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(SECTION_ORDER)
  );

  useEffect(() => {
    loadData();
  }, [boostId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const boostRes = await fetch(`/api/v1/boosts/${boostId}`);
      const boostData = await boostRes.json();
      if (!boostRes.ok) throw new Error(boostData.error || "Failed to load boost");

      const b: Boost = boostData.boost;
      setBoost(b);
      setCvName(`${b.cv_name} (Boosted for ${b.job_title})`);

      const cvRes = await fetch(`/api/v1/cvs/${b.cv_id}`);
      const cvData = await cvRes.json();
      if (!cvRes.ok) throw new Error(cvData.error || "Failed to load CV");

      setOriginalCV(cvData.cv);
      setWorkingCopy(JSON.parse(JSON.stringify(cvData.cv.parsed_data)));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load data"
      );
    } finally {
      setLoading(false);
    }
  };

  const changesBySection = useMemo(() => {
    if (!boost) return new Map<ChangeSection, Change[]>();
    const map = new Map<ChangeSection, Change[]>();
    for (const change of boost.changes) {
      const list = map.get(change.section) || [];
      list.push(change);
      map.set(change.section, list);
    }
    return map;
  }, [boost]);

  const sectionsWithSuggestions = useMemo(
    () => new Set(changesBySection.keys()),
    [changesBySection]
  );

  const handleApplyChange = useCallback(
    (change: Change) => {
      if (!workingCopy) return;
      const updated = applySingleChange(workingCopy, change);
      setWorkingCopy(updated);
      setAppliedChangeIds((prev) => new Set([...prev, change.change_id]));
    },
    [workingCopy]
  );

  const handleRevertChange = useCallback(
    (change: Change) => {
      if (!workingCopy) return;
      const updated = revertSingleChange(workingCopy, change);
      setWorkingCopy(updated);
      setAppliedChangeIds((prev) => {
        const next = new Set(prev);
        next.delete(change.change_id);
        return next;
      });
    },
    [workingCopy]
  );

  const handleAcceptAll = useCallback(() => {
    if (!boost || !originalCV) return;
    const unapplied = boost.changes.filter(
      (c) => !appliedChangeIds.has(c.change_id)
    );
    if (unapplied.length === 0) return;

    const allToApply = boost.changes;
    const fullyApplied = applyMultipleChanges(
      originalCV.parsed_data,
      allToApply
    );
    setWorkingCopy(fullyApplied);
    setAppliedChangeIds(new Set(allToApply.map((c) => c.change_id)));
    toast.success(`Applied all ${allToApply.length} suggestions`);
  }, [boost, originalCV, appliedChangeIds]);

  const handleSaveAsNewCV = async () => {
    if (!boost || !workingCopy) return;
    if (!cvName.trim()) {
      toast.error("Please enter a name for the new CV");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/v1/boosts/${boostId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cv_name: cvName.trim(),
          parsed_data: workingCopy,
          changes_accepted: appliedChangeIds.size,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save CV");

      toast.success("New CV created successfully!");
      router.push(`/dashboard/cvs/${data.cv.cv_id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save CV"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAutoBoost = async () => {
    handleAcceptAll();
    await new Promise((resolve) => setTimeout(resolve, 100));
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-muted-foreground">Loading boost data...</p>
        </div>
      </div>
    );
  }

  if (!boost || !originalCV || !workingCopy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold">Boost Not Found</h2>
          <Button onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const totalChanges = boost.changes.length;
  const appliedCount = appliedChangeIds.size;
  const originalScore = boost.original_score ?? 0;
  const isAlreadyApplied = boost.status === "applied";

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-0">
                <h1 className="text-lg font-bold truncate flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600 shrink-0" />
                  Improve CV
                </h1>
                <p className="text-xs text-muted-foreground truncate">
                  {boost.cv_name} &rarr; {boost.job_title}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Score indicator */}
              <div className="hidden md:flex items-center gap-2 text-sm">
                <Badge variant="outline" className="font-mono">
                  {originalScore}
                </Badge>
                <ArrowLeft className="h-3 w-3 rotate-180 text-muted-foreground" />
                <Badge className="bg-green-600 font-mono">
                  {boost.estimated_new_score}
                </Badge>
              </div>

              {/* Applied count */}
              <Badge variant="secondary" className="text-xs">
                {appliedCount}/{totalChanges} applied
              </Badge>

              {!isAlreadyApplied && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAcceptAll}
                    disabled={appliedCount === totalChanges}
                  >
                    <Zap className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Accept All</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveAsNewCV}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Save as New CV</span>
                        <span className="sm:hidden">Save</span>
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Already-applied banner */}
      {isAlreadyApplied && (
        <div className="bg-green-50 border-b border-green-200 py-2 px-4 text-center text-sm text-green-800">
          <Check className="h-4 w-4 inline mr-1" />
          This boost has already been applied. Viewing in read-only mode.
        </div>
      )}

      {/* CV Name bar */}
      {!isAlreadyApplied && (
        <div className="bg-background border-b">
          <div className="container mx-auto px-4 py-2 flex items-center gap-3">
            <Label htmlFor="cvName" className="text-sm shrink-0">
              New CV name:
            </Label>
            <Input
              id="cvName"
              value={cvName}
              onChange={(e) => setCvName(e.target.value)}
              className="h-8 text-sm max-w-md"
              placeholder="Enter name for the new CV"
            />
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditMode(!editMode)}
                className={cn(editMode && "bg-muted")}
              >
                {editMode ? (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main content: two-column layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Original CV */}
          <div>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                  Original CV
                  <Badge variant="outline" className="text-[10px] ml-auto">
                    v{originalCV.version}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CVSectionRenderer
                  cvData={originalCV.parsed_data}
                  editable={false}
                  highlightSections={sectionsWithSuggestions}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right: Working Copy + Inline Suggestions */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                  Improved CV
                  {editMode && (
                    <Badge className="text-[10px] bg-blue-600 ml-1">
                      Editing
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CVSectionRenderer
                  cvData={workingCopy}
                  editable={editMode && !isAlreadyApplied}
                  onChange={setWorkingCopy}
                  highlightSections={sectionsWithSuggestions}
                />
              </CardContent>
            </Card>

            {/* Suggestions panel */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  AI Suggestions
                  <Badge variant="secondary" className="text-[10px] ml-auto">
                    {appliedCount}/{totalChanges}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {SECTION_ORDER.map((section) => {
                  const changes = changesBySection.get(section);
                  if (!changes || changes.length === 0) return null;
                  const isExpanded = expandedSections.has(section);
                  const sectionApplied = changes.filter((c) =>
                    appliedChangeIds.has(c.change_id)
                  ).length;

                  return (
                    <div key={section}>
                      <button
                        onClick={() => toggleSection(section)}
                        className="flex items-center gap-2 w-full text-left py-1.5 hover:bg-muted/50 rounded px-2 -mx-2"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                        <span className="text-xs font-semibold uppercase tracking-wider">
                          {SECTION_LABELS[section] || section}
                        </span>
                        <Badge
                          variant={
                            sectionApplied === changes.length
                              ? "default"
                              : "outline"
                          }
                          className={cn(
                            "text-[10px] h-4 ml-auto",
                            sectionApplied === changes.length &&
                              "bg-green-600"
                          )}
                        >
                          {sectionApplied}/{changes.length}
                        </Badge>
                      </button>
                      {isExpanded && (
                        <div className="space-y-2 mt-2 pl-5">
                          {changes.map((change) => (
                            <SuggestionCard
                              key={change.change_id}
                              change={change}
                              isApplied={appliedChangeIds.has(
                                change.change_id
                              )}
                              onApply={() => handleApplyChange(change)}
                              onRevert={() => handleRevertChange(change)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom action bar (mobile-friendly) */}
      {!isAlreadyApplied && (
        <div className="sticky bottom-0 bg-background border-t shadow-lg lg:hidden">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <div className="text-sm">
              <span className="font-medium">{appliedCount}</span>
              <span className="text-muted-foreground">
                /{totalChanges} applied
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAcceptAll}
                disabled={appliedCount === totalChanges}
              >
                <Zap className="h-4 w-4 mr-1" />
                All
              </Button>
              <Button
                size="sm"
                onClick={handleSaveAsNewCV}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
