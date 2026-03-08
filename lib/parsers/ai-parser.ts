import OpenAI from "openai";
import { ParsedCVData } from "@/types/cv";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PARSING_PROMPT = `You are a CV/resume parser. Extract structured information from the provided CV text.

Return a JSON object with the following structure:
{
  "personal_info": {
    "full_name": "string",
    "email": "string or null",
    "phone": "string or null",
    "location": "string or null",
    "linkedin": "string or null",
    "portfolio": "string or null"
  },
  "professional_summary": "string or null",
  "work_experience": [
    {
      "company": "string",
      "position": "string",
      "location": "string or null",
      "start_date": "YYYY-MM or YYYY",
      "end_date": "YYYY-MM or YYYY or null",
      "current": boolean,
      "responsibilities": ["string"],
      "achievements": ["string"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field_of_study": "string",
      "start_date": "YYYY-MM or YYYY or null",
      "end_date": "YYYY-MM or YYYY or null",
      "gpa": "string or null",
      "honors": ["string"]
    }
  ],
  "skills": {
    "technical": ["string"],
    "soft": ["string"],
    "languages": ["string"],
    "certifications": ["string"]
  },
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["string"],
      "url": "string or null"
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "date": "YYYY-MM or YYYY or null",
      "credential_id": "string or null"
    }
  ],
  "awards": ["string"],
  "publications": ["string"],
  "volunteer_experience": ["string"]
}

Extract all available information. Use null for missing optional fields and empty arrays for missing array fields.`;

export async function parseCV(text: string): Promise<ParsedCVData> {
  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: PARSING_PROMPT },
        { role: "user", content: text },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const parsed = JSON.parse(content) as ParsedCVData;
    return parsed;
  } catch (error) {
    console.error("AI parsing error:", error);
    throw new Error("Failed to parse CV with AI");
  }
}
