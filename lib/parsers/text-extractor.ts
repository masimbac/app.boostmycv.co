import * as mammoth from "mammoth";
import { extractText as unpdfExtractText } from "unpdf";

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Convert Buffer to Uint8Array for unpdf
    const uint8Array = new Uint8Array(buffer);
    const result = await unpdfExtractText(uint8Array);

    // unpdf might return text as array or object, ensure we get a string
    let text = "";
    if (typeof result.text === "string") {
      text = result.text;
    } else if (Array.isArray(result.text)) {
      text = result.text.join("\n");
    } else if (result.text && typeof result.text === "object") {
      text = JSON.stringify(result.text);
    }

    return text;
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

export async function extractTextFromWord(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error("Word parsing error:", error);
    throw new Error("Failed to extract text from Word document");
  }
}

export async function extractText(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  if (mimeType === "application/pdf") {
    return extractTextFromPDF(buffer);
  } else if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/msword"
  ) {
    return extractTextFromWord(buffer);
  } else {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }
}
