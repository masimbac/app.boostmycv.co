"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save, ArrowLeft, CheckCircle2, FileCode2 } from "lucide-react";
import { CV } from "@/types/cv";
import Link from "next/link";

export default function CVDetailPage() {
  const router = useRouter();
  const params = useParams();
  const cvId = params.id as string;

  const [cv, setCV] = useState<CV | null>(null);
  const [editedCV, setEditedCV] = useState<CV | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadCV();
  }, [cvId]);

  const loadCV = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/cvs/${cvId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load CV");
      }

      setCV(data.cv);
      setEditedCV(data.cv);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load CV");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editedCV) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/v1/cvs/${cvId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cv_name: editedCV.cv_name,
          parsed_data: editedCV.parsed_data,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save CV");
      }

      setCV(editedCV);
      setSuccess("CV saved successfully!");
      setEditing(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save CV");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setEditedCV(cv);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!cv || !editedCV) {
    return (
      <div className="min-h-screen bg-muted/30 p-4">
        <div className="container mx-auto max-w-4xl">
          <Alert variant="destructive">
            <AlertDescription>CV not found</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const displayCV = editing ? editedCV : cv;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex gap-2 flex-wrap">
              <Link href={`/dashboard/cvs/${cvId}/preview`}>
                <Button variant="secondary">
                  <FileCode2 className="mr-2 h-4 w-4" />
                  LaTeX / PDF prep
                </Button>
              </Link>
              {editing ? (
                <>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditing(true)}>Edit CV</Button>
              )}
            </div>
          </div>

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                {success}
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
              <div className="space-y-2">
                {editing ? (
                  <Input
                    value={editedCV.cv_name}
                    onChange={(e) =>
                      setEditedCV({ ...editedCV, cv_name: e.target.value })
                    }
                    className="text-2xl font-bold"
                  />
                ) : (
                  <h1 className="text-2xl font-bold">{displayCV.cv_name}</h1>
                )}
                <p className="text-sm text-muted-foreground">
                  Created {new Date(displayCV.created_at).toLocaleDateString()}{" "}
                  • Version {displayCV.version}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Info */}
              <div>
                <h2 className="text-xl font-semibold mb-3">
                  Personal Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    {editing ? (
                      <Input
                        value={editedCV.parsed_data.personal_info.full_name || ""}
                        onChange={(e) =>
                          setEditedCV({
                            ...editedCV,
                            parsed_data: {
                              ...editedCV.parsed_data,
                              personal_info: {
                                ...editedCV.parsed_data.personal_info,
                                full_name: e.target.value,
                              },
                            },
                          })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm mt-1">
                        {displayCV.parsed_data.personal_info.full_name || "N/A"}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Email</Label>
                    {editing ? (
                      <Input
                        value={editedCV.parsed_data.personal_info.email || ""}
                        onChange={(e) =>
                          setEditedCV({
                            ...editedCV,
                            parsed_data: {
                              ...editedCV.parsed_data,
                              personal_info: {
                                ...editedCV.parsed_data.personal_info,
                                email: e.target.value,
                              },
                            },
                          })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm mt-1">
                        {displayCV.parsed_data.personal_info.email || "N/A"}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Phone</Label>
                    {editing ? (
                      <Input
                        value={editedCV.parsed_data.personal_info.phone || ""}
                        onChange={(e) =>
                          setEditedCV({
                            ...editedCV,
                            parsed_data: {
                              ...editedCV.parsed_data,
                              personal_info: {
                                ...editedCV.parsed_data.personal_info,
                                phone: e.target.value,
                              },
                            },
                          })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm mt-1">
                        {displayCV.parsed_data.personal_info.phone || "N/A"}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Location</Label>
                    {editing ? (
                      <Input
                        value={editedCV.parsed_data.personal_info.location || ""}
                        onChange={(e) =>
                          setEditedCV({
                            ...editedCV,
                            parsed_data: {
                              ...editedCV.parsed_data,
                              personal_info: {
                                ...editedCV.parsed_data.personal_info,
                                location: e.target.value,
                              },
                            },
                          })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm mt-1">
                        {displayCV.parsed_data.personal_info.location || "N/A"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Summary */}
              {(displayCV.parsed_data.professional_summary || editing) && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">
                    Professional Summary
                  </h2>
                  {editing ? (
                    <Textarea
                      value={editedCV.parsed_data.professional_summary || ""}
                      onChange={(e) =>
                        setEditedCV({
                          ...editedCV,
                          parsed_data: {
                            ...editedCV.parsed_data,
                            professional_summary: e.target.value,
                          },
                        })
                      }
                      rows={4}
                      className="text-sm"
                    />
                  ) : (
                    <p className="text-sm">
                      {displayCV.parsed_data.professional_summary}
                    </p>
                  )}
                </div>
              )}

              {/* Work Experience */}
              {displayCV.parsed_data.work_experience.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">
                    Work Experience
                  </h2>
                  <div className="space-y-4">
                    {displayCV.parsed_data.work_experience.map((exp, idx) => (
                      <div key={idx} className="border-l-2 border-primary pl-4">
                        {editing ? (
                          <div className="space-y-2">
                            <div>
                              <Label>Position</Label>
                              <Input
                                value={
                                  editedCV.parsed_data.work_experience[idx]
                                    .position || ""
                                }
                                onChange={(e) => {
                                  const updated = [...editedCV.parsed_data.work_experience];
                                  updated[idx].position = e.target.value;
                                  setEditedCV({
                                    ...editedCV,
                                    parsed_data: {
                                      ...editedCV.parsed_data,
                                      work_experience: updated,
                                    },
                                  });
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label>Company</Label>
                              <Input
                                value={
                                  editedCV.parsed_data.work_experience[idx]
                                    .company || ""
                                }
                                onChange={(e) => {
                                  const updated = [...editedCV.parsed_data.work_experience];
                                  updated[idx].company = e.target.value;
                                  setEditedCV({
                                    ...editedCV,
                                    parsed_data: {
                                      ...editedCV.parsed_data,
                                      work_experience: updated,
                                    },
                                  });
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label>Start Date</Label>
                                <Input
                                  value={
                                    editedCV.parsed_data.work_experience[idx]
                                      .start_date || ""
                                  }
                                  onChange={(e) => {
                                    const updated = [...editedCV.parsed_data.work_experience];
                                    updated[idx].start_date = e.target.value;
                                    setEditedCV({
                                      ...editedCV,
                                      parsed_data: {
                                        ...editedCV.parsed_data,
                                        work_experience: updated,
                                      },
                                    });
                                  }}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label>End Date</Label>
                                <Input
                                  value={
                                    editedCV.parsed_data.work_experience[idx]
                                      .current
                                      ? "Present"
                                      : editedCV.parsed_data.work_experience[idx]
                                          .end_date || ""
                                  }
                                  onChange={(e) => {
                                    const updated = [...editedCV.parsed_data.work_experience];
                                    updated[idx].end_date = e.target.value;
                                    updated[idx].current = e.target.value === "Present";
                                    setEditedCV({
                                      ...editedCV,
                                      parsed_data: {
                                        ...editedCV.parsed_data,
                                        work_experience: updated,
                                      },
                                    });
                                  }}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                            <div>
                              <Label>Responsibilities (one per line)</Label>
                              <Textarea
                                value={editedCV.parsed_data.work_experience[
                                  idx
                                ].responsibilities.join("\n")}
                                onChange={(e) => {
                                  const updated = [...editedCV.parsed_data.work_experience];
                                  updated[idx].responsibilities = e.target.value
                                    .split("\n")
                                    .filter((r) => r.trim());
                                  setEditedCV({
                                    ...editedCV,
                                    parsed_data: {
                                      ...editedCV.parsed_data,
                                      work_experience: updated,
                                    },
                                  });
                                }}
                                rows={4}
                                className="mt-1"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <h3 className="font-medium">{exp.position}</h3>
                            <p className="text-sm text-muted-foreground">
                              {exp.company}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {exp.start_date} -{" "}
                              {exp.current ? "Present" : exp.end_date}
                            </p>
                            {exp.responsibilities.length > 0 && (
                              <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                                {exp.responsibilities.map((resp, i) => (
                                  <li key={i}>{resp}</li>
                                ))}
                              </ul>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {displayCV.parsed_data.education.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Education</h2>
                  <div className="space-y-3">
                    {displayCV.parsed_data.education.map((edu, idx) => (
                      <div key={idx}>
                        {editing ? (
                          <div className="space-y-2">
                            <div>
                              <Label>Degree</Label>
                              <Input
                                value={
                                  editedCV.parsed_data.education[idx].degree || ""
                                }
                                onChange={(e) => {
                                  const updated = [...editedCV.parsed_data.education];
                                  updated[idx].degree = e.target.value;
                                  setEditedCV({
                                    ...editedCV,
                                    parsed_data: {
                                      ...editedCV.parsed_data,
                                      education: updated,
                                    },
                                  });
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label>Field of Study</Label>
                              <Input
                                value={
                                  editedCV.parsed_data.education[idx]
                                    .field_of_study || ""
                                }
                                onChange={(e) => {
                                  const updated = [...editedCV.parsed_data.education];
                                  updated[idx].field_of_study = e.target.value;
                                  setEditedCV({
                                    ...editedCV,
                                    parsed_data: {
                                      ...editedCV.parsed_data,
                                      education: updated,
                                    },
                                  });
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label>Institution</Label>
                              <Input
                                value={
                                  editedCV.parsed_data.education[idx].institution || ""
                                }
                                onChange={(e) => {
                                  const updated = [...editedCV.parsed_data.education];
                                  updated[idx].institution = e.target.value;
                                  setEditedCV({
                                    ...editedCV,
                                    parsed_data: {
                                      ...editedCV.parsed_data,
                                      education: updated,
                                    },
                                  });
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label>GPA (optional)</Label>
                              <Input
                                value={
                                  editedCV.parsed_data.education[idx].gpa || ""
                                }
                                onChange={(e) => {
                                  const updated = [...editedCV.parsed_data.education];
                                  updated[idx].gpa = e.target.value;
                                  setEditedCV({
                                    ...editedCV,
                                    parsed_data: {
                                      ...editedCV.parsed_data,
                                      education: updated,
                                    },
                                  });
                                }}
                                className="mt-1"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <h3 className="font-medium">
                              {edu.degree} in {edu.field_of_study}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {edu.institution}
                            </p>
                            {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              <div>
                <h2 className="text-xl font-semibold mb-3">Skills</h2>
                <div className="space-y-2">
                  {(displayCV.parsed_data.skills.technical.length > 0 ||
                    editing) && (
                    <div>
                      <Label>Technical Skills</Label>
                      {editing ? (
                        <div>
                          <Textarea
                            value={editedCV.parsed_data.skills.technical.join(
                              ", "
                            )}
                            onChange={(e) => {
                              const skills = e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter((s) => s);
                              setEditedCV({
                                ...editedCV,
                                parsed_data: {
                                  ...editedCV.parsed_data,
                                  skills: {
                                    ...editedCV.parsed_data.skills,
                                    technical: skills,
                                  },
                                },
                              });
                            }}
                            rows={3}
                            className="mt-1"
                            placeholder="Enter skills separated by commas"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Separate skills with commas
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {displayCV.parsed_data.skills.technical.map(
                            (skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                              >
                                {skill}
                              </span>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
