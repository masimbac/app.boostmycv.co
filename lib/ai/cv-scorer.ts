import OpenAI from "openai";
import { ParsedCVData } from "@/types/cv";
import { CategoryScores } from "@/types/score";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ScoringResult {
  overall_score: number;
  category_scores: CategoryScores;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export async function scoreCV(
  cvData: ParsedCVData,
  jobDescription: string
): Promise<ScoringResult> {
  try {
    const prompt = `You are an expert recruiter and HR professional. Analyze how well this CV matches the job description and provide a detailed scoring breakdown.

**Job Description:**
${jobDescription}

**Candidate CV:**
${JSON.stringify(cvData, null, 2)}

Provide a comprehensive analysis in the following JSON format:
{
  "overall_score": <number between 0-100>,
  "category_scores": {
    "skills_match": <number 0-100 - How well the candidate's technical and soft skills match the job requirements>,
    "experience_match": <number 0-100 - How relevant and sufficient their work experience is>,
    "education_match": <number 0-100 - How well their education aligns with job requirements>,
    "keywords_match": <number 0-100 - How many important keywords from the job description appear in the CV>
  },
  "strengths": [
    "<3-5 specific strengths that make this candidate stand out for this role>",
    "<be specific and reference actual skills/experience from the CV>"
  ],
  "weaknesses": [
    "<3-5 specific gaps or areas where the candidate falls short>",
    "<be constructive and specific>"
  ],
  "recommendations": [
    "<3-5 actionable recommendations to improve the CV for this specific job>",
    "<be specific about what to add, remove, or emphasize>"
  ]
}

**Scoring Guidelines:**
- 90-100: Excellent match, candidate exceeds requirements
- 75-89: Strong match, candidate meets most requirements
- 60-74: Good match, candidate meets basic requirements with some gaps
- 40-59: Fair match, significant gaps but potential
- 0-39: Poor match, major misalignment

Be honest but constructive. Focus on how to improve the match.

Return ONLY valid JSON, no explanations outside the JSON structure.`;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "You are an expert HR professional and recruiter. Analyze CVs objectively and provide actionable feedback. Return only valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const result = JSON.parse(content);

    // Validate and sanitize the response
    return {
      overall_score: Math.min(100, Math.max(0, result.overall_score || 0)),
      category_scores: {
        skills_match: Math.min(100, Math.max(0, result.category_scores?.skills_match || 0)),
        experience_match: Math.min(100, Math.max(0, result.category_scores?.experience_match || 0)),
        education_match: Math.min(100, Math.max(0, result.category_scores?.education_match || 0)),
        keywords_match: Math.min(100, Math.max(0, result.category_scores?.keywords_match || 0)),
      },
      strengths: Array.isArray(result.strengths) ? result.strengths.slice(0, 5) : [],
      weaknesses: Array.isArray(result.weaknesses) ? result.weaknesses.slice(0, 5) : [],
      recommendations: Array.isArray(result.recommendations) ? result.recommendations.slice(0, 5) : [],
    };
  } catch (error) {
    console.error("CV scoring error:", error);
    throw new Error("Failed to score CV. Please try again.");
  }
}
