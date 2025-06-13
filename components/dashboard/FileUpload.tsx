import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { ApiResponse } from "@/interfaces";
import { Contact } from "@/interfaces/contactInterface";

interface FileUploadProps {
  onUploadSuccess: (contacts: Contact[]) => void;
  onBack: () => void;
}

export default function FileUpload({
  onUploadSuccess,
  onBack,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null); // Clear any previous errors
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

      if (!backendUrl) {
        throw new Error("Backend URL is not defined. Please check environment variables.");
      }

      const response = await fetch(`${backendUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed. Please try again.");
      }

      const result: ApiResponse = await response.json();
      if (result.success) {
        onUploadSuccess(result.data as unknown as Contact[]); // Cast to Contact[]
      } else {
        throw new Error((result as any).message || "Upload process failed on server side.");
      }

      setFile(null); // Clear selected file after successful upload
    } catch (err: any) {
      console.error("Error uploading file:", err);
      setError(err.message || "An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full p-6 bg-card rounded-xl shadow-lg border border-border">
      <h2 className="text-3xl font-extrabold text-foreground text-center mb-8">Upload Your Call Data</h2>

      {/* New wrapper for upload box with max-width and mx-auto */}
      <div className="max-w-md mx-auto flex flex-col items-center gap-6"> {/* Constrain upload box width and center it */}
        <div className="w-full p-8 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-6 text-center
                      hover:border-autodigPrimary hover:bg-muted/20 transition-all duration-200 cursor-pointer">
          <UploadCloud className="w-16 h-16 text-muted-foreground" />
          <label htmlFor="file-upload" className="cursor-pointer bg-autodigPrimary text-autodigPrimary-foreground px-6 py-3 rounded-md font-semibold
                                            hover:bg-autodigPrimary/90 transition-colors duration-200 ease-in-out shadow-md">
            Select CSV File
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
          {file ? (
            <p className="text-sm text-foreground font-medium mt-2">Selected: <span className="text-autodigPrimary">{file.name}</span></p>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">Only CSV files are supported.</p>
          )}
          {error && (
            <p className="text-sm text-destructive mt-2">{error}</p>
          )}
        </div>

        <div className="flex gap-4 justify-center w-full"> {/* Centered buttons within the constrained width */}
          <button
            onClick={onBack}
            className="px-6 py-2 rounded-md text-foreground border border-input bg-background
                       hover:bg-muted dark:hover:bg-gray-700 transition-colors duration-200" // Reduced py-3 to py-2
            disabled={isUploading}
          >
            Back
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className={`px-6 py-2 rounded-md text-white font-semibold transition-colors duration-200 ease-in-out
              ${!file || isUploading
                ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
                : "bg-autodigPrimary hover:bg-autodigPrimary/90 shadow-md"
              }`} // Reduced py-3 to py-2
          >
            {isUploading ? "Processing..." : "Process Call Data"}
          </button>
        </div>
      </div>
    </div>
  );
}