"use client";

import { ParsedCVData, WorkExperience, Education } from "@/types/cv";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CVSectionRendererProps {
  cvData: ParsedCVData;
  editable?: boolean;
  onChange?: (data: ParsedCVData) => void;
  highlightSections?: Set<string>;
}

export function CVSectionRenderer({
  cvData,
  editable = false,
  onChange,
  highlightSections,
}: CVSectionRendererProps) {
  const update = (partial: Partial<ParsedCVData>) => {
    if (onChange) onChange({ ...cvData, ...partial });
  };

  const sectionClass = (section: string) =>
    highlightSections?.has(section)
      ? "ring-2 ring-blue-300 rounded-lg p-3 -m-3 transition-all"
      : "";

  return (
    <div className="space-y-6 text-sm">
      {/* Personal Info */}
      <section className={sectionClass("personal_info")}>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Personal Information
        </h3>
        {editable ? (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Full Name</Label>
              <Input
                value={cvData.personal_info.full_name || ""}
                onChange={(e) =>
                  update({
                    personal_info: {
                      ...cvData.personal_info,
                      full_name: e.target.value,
                    },
                  })
                }
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Email</Label>
              <Input
                value={cvData.personal_info.email || ""}
                onChange={(e) =>
                  update({
                    personal_info: {
                      ...cvData.personal_info,
                      email: e.target.value,
                    },
                  })
                }
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Phone</Label>
              <Input
                value={cvData.personal_info.phone || ""}
                onChange={(e) =>
                  update({
                    personal_info: {
                      ...cvData.personal_info,
                      phone: e.target.value,
                    },
                  })
                }
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Location</Label>
              <Input
                value={cvData.personal_info.location || ""}
                onChange={(e) =>
                  update({
                    personal_info: {
                      ...cvData.personal_info,
                      location: e.target.value,
                    },
                  })
                }
                className="h-8 text-sm"
              />
            </div>
          </div>
        ) : (
          <div>
            <p className="font-semibold text-base">
              {cvData.personal_info.full_name}
            </p>
            <p className="text-muted-foreground">
              {[
                cvData.personal_info.email,
                cvData.personal_info.phone,
                cvData.personal_info.location,
              ]
                .filter(Boolean)
                .join(" | ")}
            </p>
          </div>
        )}
      </section>

      {/* Professional Summary */}
      {(cvData.professional_summary || editable) && (
        <section className={sectionClass("professional_summary")}>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Professional Summary
          </h3>
          {editable ? (
            <Textarea
              value={cvData.professional_summary || ""}
              onChange={(e) =>
                update({ professional_summary: e.target.value })
              }
              rows={3}
              className="text-sm"
            />
          ) : (
            <p className="text-muted-foreground leading-relaxed">
              {cvData.professional_summary}
            </p>
          )}
        </section>
      )}

      {/* Work Experience */}
      {cvData.work_experience.length > 0 && (
        <section className={sectionClass("work_experience")}>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Work Experience
          </h3>
          <div className="space-y-4">
            {cvData.work_experience.map((exp, idx) => (
              <WorkExperienceItem
                key={idx}
                exp={exp}
                index={idx}
                editable={editable}
                onChange={(updated) => {
                  const list = [...cvData.work_experience];
                  list[idx] = updated;
                  update({ work_experience: list });
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {cvData.education.length > 0 && (
        <section className={sectionClass("education")}>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Education
          </h3>
          <div className="space-y-3">
            {cvData.education.map((edu, idx) => (
              <EducationItem
                key={idx}
                edu={edu}
                index={idx}
                editable={editable}
                onChange={(updated) => {
                  const list = [...cvData.education];
                  list[idx] = updated;
                  update({ education: list });
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      <section className={sectionClass("skills")}>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Skills
        </h3>
        {editable ? (
          <div className="space-y-2">
            {(["technical", "soft", "languages"] as const).map((cat) => (
              <div key={cat}>
                <Label className="text-xs capitalize">{cat} Skills</Label>
                <Textarea
                  value={(cvData.skills[cat] || []).join(", ")}
                  onChange={(e) => {
                    const skills = e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean);
                    update({
                      skills: { ...cvData.skills, [cat]: skills },
                    });
                  }}
                  rows={2}
                  className="text-sm"
                  placeholder={`Comma-separated ${cat} skills`}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {(["technical", "soft", "languages"] as const).map(
              (cat) =>
                (cvData.skills[cat] || []).length > 0 && (
                  <div key={cat}>
                    <span className="text-xs font-medium capitalize text-muted-foreground">
                      {cat}:{" "}
                    </span>
                    <div className="inline-flex flex-wrap gap-1 mt-1">
                      {cvData.skills[cat].map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )
            )}
          </div>
        )}
      </section>

      {/* Projects */}
      {cvData.projects.length > 0 && (
        <section className={sectionClass("projects")}>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Projects
          </h3>
          <div className="space-y-2">
            {cvData.projects.map((proj, idx) => (
              <div key={idx}>
                <p className="font-medium">{proj.name}</p>
                <p className="text-muted-foreground text-xs">
                  {proj.description}
                </p>
                {proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {proj.technologies.map((t, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 bg-muted text-xs rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {cvData.certifications.length > 0 && (
        <section className={sectionClass("certifications")}>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Certifications
          </h3>
          <div className="space-y-1">
            {cvData.certifications.map((cert, idx) => (
              <div key={idx}>
                <p className="font-medium">{cert.name}</p>
                <p className="text-muted-foreground text-xs">
                  {cert.issuer}
                  {cert.date ? ` - ${cert.date}` : ""}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function WorkExperienceItem({
  exp,
  index,
  editable,
  onChange,
}: {
  exp: WorkExperience;
  index: number;
  editable: boolean;
  onChange: (updated: WorkExperience) => void;
}) {
  if (editable) {
    return (
      <div className="space-y-2 border-l-2 border-primary pl-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Position</Label>
            <Input
              value={exp.position || ""}
              onChange={(e) => onChange({ ...exp, position: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Company</Label>
            <Input
              value={exp.company || ""}
              onChange={(e) => onChange({ ...exp, company: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
        </div>
        <div>
          <Label className="text-xs">Responsibilities (one per line)</Label>
          <Textarea
            value={(exp.responsibilities || []).join("\n")}
            onChange={(e) =>
              onChange({
                ...exp,
                responsibilities: e.target.value
                  .split("\n")
                  .filter((r) => r.trim()),
              })
            }
            rows={3}
            className="text-sm"
          />
        </div>
        <div>
          <Label className="text-xs">Achievements (one per line)</Label>
          <Textarea
            value={(exp.achievements || []).join("\n")}
            onChange={(e) =>
              onChange({
                ...exp,
                achievements: e.target.value
                  .split("\n")
                  .filter((a) => a.trim()),
              })
            }
            rows={2}
            className="text-sm"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="border-l-2 border-muted-foreground/20 pl-3">
      <p className="font-medium">{exp.position}</p>
      <p className="text-muted-foreground text-xs">
        {exp.company}
        {exp.location ? ` - ${exp.location}` : ""}
      </p>
      <p className="text-muted-foreground text-xs">
        {exp.start_date} - {exp.current ? "Present" : exp.end_date}
      </p>
      {exp.responsibilities.length > 0 && (
        <ul className="list-disc list-inside mt-1 space-y-0.5 text-muted-foreground">
          {exp.responsibilities.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      )}
      {exp.achievements && exp.achievements.length > 0 && (
        <ul className="list-disc list-inside mt-1 space-y-0.5 text-green-700">
          {exp.achievements.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EducationItem({
  edu,
  index,
  editable,
  onChange,
}: {
  edu: Education;
  index: number;
  editable: boolean;
  onChange: (updated: Education) => void;
}) {
  if (editable) {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Degree</Label>
            <Input
              value={edu.degree || ""}
              onChange={(e) => onChange({ ...edu, degree: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Field of Study</Label>
            <Input
              value={edu.field_of_study || ""}
              onChange={(e) =>
                onChange({ ...edu, field_of_study: e.target.value })
              }
              className="h-8 text-sm"
            />
          </div>
        </div>
        <div>
          <Label className="text-xs">Institution</Label>
          <Input
            value={edu.institution || ""}
            onChange={(e) => onChange({ ...edu, institution: e.target.value })}
            className="h-8 text-sm"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="font-medium">
        {edu.degree}
        {edu.field_of_study ? ` in ${edu.field_of_study}` : ""}
      </p>
      <p className="text-muted-foreground text-xs">{edu.institution}</p>
      {edu.gpa && (
        <p className="text-muted-foreground text-xs">GPA: {edu.gpa}</p>
      )}
    </div>
  );
}
