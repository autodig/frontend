import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { ApiResponse } from "@/src/interfaces";
import { Contact } from "@/src/interfaces/contactInterface";
import ContactConfirmation from "./ContactConfirmation";
import { getCurrentUser } from "@/src/utils/sessionManager";

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
  const [uploadedContacts, setUploadedContacts] = useState<Contact[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

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
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

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
        const contacts = result.data as unknown as Contact[];
        // Take first 100 contacts from the uploaded data
        const limitedContacts = contacts.slice(0, 100);
        setUploadedContacts(limitedContacts);
        setShowConfirmation(true);
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

  const handleConfirmContacts = async (selectedContacts: Contact[]) => {
    try {
      const user = getCurrentUser();
      console.log("Save - Current user:", user); // Debug log

      if (!user) {
        throw new Error("User not authenticated");
      }

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      console.log("Save - Backend URL:", backendUrl); // Debug log

      // Extract only essential contact information to reduce payload size
      const essentialContacts = selectedContacts.map(contact => ({
        first_name: contact.first_name || (contact as any).firstName || (contact as any)['First Name'] || '',
        last_name: contact.last_name || (contact as any).lastName || (contact as any)['Last Name'] || '',
        email: contact.emails__address__is_primary || (contact as any).email || (contact as any).Email || (contact as any)['Email Address'] || '',
        phone: contact.phones__number__is_primary || (contact as any).phone || (contact as any).Phone || (contact as any)['Phone Number'] || '',
        city: contact.addresses__city__is_primary || (contact as any).city || (contact as any).City || '',
        state: contact.addresses__state__is_primary || (contact as any).state || (contact as any).State || '',
        zip_code: contact.addresses__zip__is_primary || (contact as any).zip || (contact as any).zip_code || (contact as any).Zip || (contact as any)['Zip Code'] || '',
        employer: contact.employer || (contact as any).company || (contact as any).Company || (contact as any).Employer || '',
        occupation: contact.occupation || (contact as any).job || (contact as any).Job || (contact as any).Occupation || '',
        party: contact.party || (contact as any).Party || ''
      }));

      console.log("Save - Saving contacts:", essentialContacts.length, "for user:", user.id); // Debug log

      const response = await fetch(`${backendUrl}/contacts/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contacts: essentialContacts,
          userId: user.id,
        }),
      });

      console.log("Save - Response status:", response.status); // Debug log

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Save - Error response:", errorText);
        throw new Error(`Failed to save contacts: ${response.status}`);
      }

      const result = await response.json();
      console.log("Save - Result:", result); // Debug log

      if (result.success) {
        console.log("Save - Success! Calling onUploadSuccess");
        onUploadSuccess(selectedContacts);
      } else {
        throw new Error(result.message || "Failed to save contacts");
      }
    } catch (err: any) {
      console.error("Save - Error:", err);
      setError(err.message);
    }
  };

  const handleBackFromConfirmation = () => {
    setShowConfirmation(false);
    setUploadedContacts([]);
  };

  if (showConfirmation) {
    return (
      <ContactConfirmation
        contacts={uploadedContacts}
        onConfirm={handleConfirmContacts}
        onBack={handleBackFromConfirmation}
      />
    );
  }

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
            <p className="text-sm text-muted-foreground mt-2">Any CSV format is supported. We'll automatically map common field names like "First Name", "Email", "Phone", etc.</p>
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