import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { ApiResponse, CallRecord } from "@/interfaces";
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

      const response = await fetch(`${backendUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result: any = await response.json();
      if (result.success) {
        onUploadSuccess(result.data);
      }

      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <h2 className="text-2xl font-bold">Upload Your Call Data</h2>

      <div className="w-full max-w-md p-8 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center gap-4">
        <UploadCloud className="w-12 h-12 text-gray-400" />
        <label className="cursor-pointer bg-autodigPrimary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors">
          Select CSV File
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        {file && (
          <div className="text-sm text-gray-600">Selected: {file.name}</div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-md text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className={`px-6 py-3 rounded-md text-white transition-colors ${!file || isUploading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-autodigPrimary hover:bg-opacity-90"
            }`}
        >
          {isUploading ? "Uploading..." : "Process Call Data"}
        </button>
      </div>
    </div>
  );
}
