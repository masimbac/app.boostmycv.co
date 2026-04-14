import path from "path";

export const AWESOME_CV_CLS_FILENAME = "awesome-cv.cls";

export function getAwesomeCvClsSourcePath(): string {
  return path.join(
    process.cwd(),
    "templates/awesome-cv",
    AWESOME_CV_CLS_FILENAME
  );
}
