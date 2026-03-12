import OpenAI from "openai";
import { EmploymentType } from "@/types/job";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ParsedJobDetails {
  job_title: string;
  company?: string;
  location?: string;
  employment_type?: EmploymentType;
}

export async function parseJobDetails(
  jobDescription: string,
  providedDetails?: Partial<ParsedJobDetails>
): Promise<ParsedJobDetails> {
  try {
    const prompt = `Analyze the following job description and extract key details. Return a JSON object with these fields:
- job_title: The job position title
- company: The company name (if mentioned)
- location: The job location (if mentioned)
- employment_type: One of "Remote", "Full Time", "Part Time", "Contract", or "Hybrid" (if mentioned)

If a field is not mentioned or unclear, omit it from the response.

Job Description:
${jobDescription}

${providedDetails ? `\nUser has already provided these details (use them as-is and don't override):\n${JSON.stringify(providedDetails, null, 2)}` : ""}

Return ONLY a valid JSON object, no explanations.`;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a job description analyzer. Extract structured data and return only valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const parsed = JSON.parse(content);

    // Merge with provided details (provided takes precedence)
    return {
      job_title: providedDetails?.job_title || parsed.job_title || "Untitled Position",
      company: providedDetails?.company || parsed.company,
      location: providedDetails?.location || parsed.location,
      employment_type: providedDetails?.employment_type || parsed.employment_type,
    };
  } catch (error) {
    console.error("Job parsing error:", error);
    // Fallback to provided details or defaults
    return {
      job_title: providedDetails?.job_title || "Untitled Position",
      company: providedDetails?.company,
      location: providedDetails?.location,
      employment_type: providedDetails?.employment_type,
    };
  }
}
