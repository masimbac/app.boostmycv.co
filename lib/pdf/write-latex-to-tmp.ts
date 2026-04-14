import { copyFile, mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import {
  AWESOME_CV_CLS_FILENAME,
  getAwesomeCvClsSourcePath,
} from "@/lib/pdf/awesome-cv-paths";

const TMP_ROOT = "/tmp/boostmycv-latex";

export type LatexWriteResult = {
  absolute_path: string;
  cls_absolute_path: string;
  directory: string;
  filename: string;
};

/**
 * Writes LaTeX under /tmp/boostmycv-latex/<uuid>/resume.tex, copies vendored awesome-cv.cls
 * into the same folder (required for XeLaTeX / Overleaf), and logs the .tex for debugging.
 */
export async function writeLatexToTmp(
  latex: string,
  filename = "resume.tex"
): Promise<LatexWriteResult> {
  const id = randomUUID();
  const dir = path.join(TMP_ROOT, id);
  const absolute_path = path.join(dir, filename);
  const cls_absolute_path = path.join(dir, AWESOME_CV_CLS_FILENAME);

  await mkdir(dir, { recursive: true });
  await writeFile(absolute_path, latex, "utf8");
  await copyFile(getAwesomeCvClsSourcePath(), cls_absolute_path);

  console.info(`[boostmycv:latex] Wrote ${absolute_path} (${latex.length} chars)`);
  console.info(`[boostmycv:latex] Copied ${AWESOME_CV_CLS_FILENAME} to ${cls_absolute_path}`);
  console.info("[boostmycv:latex] ----- BEGIN LATEX -----");
  console.info(latex);
  console.info("[boostmycv:latex] ----- END LATEX -----");

  return {
    absolute_path,
    cls_absolute_path,
    directory: dir,
    filename,
  };
}
