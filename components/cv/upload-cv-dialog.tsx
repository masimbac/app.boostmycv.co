"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Loader2, FileText, X } from "lucide-react";

interface UploadCVDialogProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function UploadCVDialog({ onSuccess, onClose }: UploadCVDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [cvName, setCvName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!cvName) {
        // Auto-populate CV name from filename
        const name = selectedFile.name.replace(/\.(pdf|docx?)$/i, "");
        setCvName(name);
      }
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file || !cvName.trim()) {
      setError("Please select a file and provide a name");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("cv_name", cvName.trim());

      const response = await fetch("/api/v1/cvs", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload CV");
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload CV");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-md w-full p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Upload CV</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cv_name">CV Name</Label>
            <Input
              id="cv_name"
              placeholder="e.g., Software Engineer Resume"
              value={cvName}
              onChange={(e) => setCvName(e.target.value)}
              disabled={uploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">File (PDF or Word)</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              {file ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-sm">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFile(null)}
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="file" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to select a file
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF or Word (Max 5MB)
                  </p>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
            <p className="font-medium mb-1">What happens next?</p>
            <ul className="space-y-1 text-xs">
              <li>1. Your CV will be uploaded securely</li>
              <li>2. AI will extract and parse the content</li>
              <li>3. You can view and edit the parsed data</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleUpload}
            disabled={!file || !cvName.trim() || uploading}
            className="flex-1"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading & Parsing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload CV
              </>
            )}
          </Button>
          <Button variant="outline" onClick={onClose} disabled={uploading}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
