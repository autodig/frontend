"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";

export default function LandingDashboard() {
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

      // Handle successful upload
      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <h1 className="text-4xl font-bold">Upload Your Call Data</h1>

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

      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className={`px-6 py-3 rounded-md text-white transition-colors ${
          !file || isUploading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-autodigPrimary hover:bg-opacity-90"
        }`}
      >
        {isUploading ? "Uploading..." : "Process Call Data"}
      </button>
    </div>
  );
}
