import OpenAI from "openai";
import { ParsedCVData } from "@/types/cv";
import { Score } from "@/types/score";
import { Change } from "@/types/boost";
import { randomUUID } from "crypto";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = process.env.OPENAI_MODEL || "gpt-4-turbo-preview";

interface BoostResult {
  changes: Change[];
  estimated_new_score: number;
}

export async function generateCVImprovements(
  cvData: ParsedCVData,
  jobDescription: string,
  currentScore: Score
): Promise<BoostResult> {
  const prompt = `You are an expert CV optimization AI. Analyze the CV against the job description and current score results to generate specific, actionable improvements.

CURRENT CV DATA:
${JSON.stringify(cvData, null, 2)}

JOB DESCRIPTION:
${jobDescription}

CURRENT SCORE: ${currentScore.overall_score}/100

WEAKNESSES:
${currentScore.weaknesses.map((w, i) => `${i + 1}. ${w}`).join("\n")}

RECOMMENDATIONS:
${currentScore.recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n")}

CATEGORY SCORES:
- Skills Match: ${currentScore.category_scores.skills_match}/100
- Experience Match: ${currentScore.category_scores.experience_match}/100
- Education Match: ${currentScore.category_scores.education_match}/100
- Keywords Match: ${currentScore.category_scores.keywords_match}/100

Generate specific changes to improve the CV. For each change, provide:
1. section: Which CV section to modify (personal_info, professional_summary, work_experience, education, skills, projects, certifications)
2. type: Type of change (modify, add, remove, reorder)
3. path: JSONPath-like reference to the field (e.g., "work_experience[0].responsibilities[1]", "skills[2]", "professional_summary")
4. before: Current value (null for add operations)
5. after: Improved value (null for remove operations)
6. reasoning: Why this change improves the CV for this job
7. field_label: Human-readable label for the field being changed

Focus on:
- Adding relevant keywords from the job description
- Quantifying achievements with metrics
- Highlighting relevant experience
- Improving professional summary to match job requirements
- Adding missing skills mentioned in the job posting
- Reordering responsibilities to put most relevant first
- Removing or de-emphasizing irrelevant information

Generate 5-15 high-impact changes. Prioritize changes that address the weaknesses and follow the recommendations.

Return ONLY a JSON object with this structure:
{
  "changes": [
    {
      "section": "professional_summary",
      "type": "modify",
      "path": "professional_summary",
      "before": "Current summary text",
      "after": "Improved summary text with keywords",
      "reasoning": "Added key terms from job description to increase ATS compatibility",
      "field_label": "Professional Summary"
    },
    {
      "section": "work_experience",
      "type": "modify",
      "path": "work_experience[0].responsibilities[0]",
      "before": "Developed software",
      "after": "Developed enterprise-scale web applications using React and Node.js, serving 100K+ users",
      "reasoning": "Added specific technologies and quantified impact",
      "field_label": "Senior Developer - First Responsibility"
    },
    {
      "section": "skills",
      "type": "add",
      "path": "skills[-1]",
      "before": null,
      "after": "AWS Lambda",
      "reasoning": "Job requires cloud computing experience; AWS Lambda mentioned in description",
      "field_label": "Skills"
    }
  ],
  "estimated_new_score": 85
}

The estimated_new_score should be realistic (typically 5-15 points higher than current score if changes are applied).`;

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert CV optimization assistant. You generate specific, actionable improvements to CVs. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const result = JSON.parse(content);

    // Validate and sanitize the response
    if (!result.changes || !Array.isArray(result.changes)) {
      throw new Error("Invalid response structure");
    }

    // Add change_id and accepted flag to each change
    const changes: Change[] = result.changes.map((change: any) => ({
      change_id: randomUUID(),
      section: change.section,
      type: change.type,
      path: change.path,
      before: change.before,
      after: change.after,
      reasoning: change.reasoning,
      field_label: change.field_label,
      accepted: false, // Default to not accepted
    }));

    // Ensure estimated_new_score is reasonable
    let estimatedScore = result.estimated_new_score || currentScore.overall_score + 10;
    if (estimatedScore <= currentScore.overall_score) {
      estimatedScore = currentScore.overall_score + 5;
    }
    if (estimatedScore > 100) {
      estimatedScore = 100;
    }

    return {
      changes,
      estimated_new_score: Math.round(estimatedScore),
    };
  } catch (error) {
    console.error("Error generating CV improvements:", error);
    throw new Error(
      `Failed to generate CV improvements: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
