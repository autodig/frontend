"use client";

import { useState } from "react";
import { Contact } from "@/src/interfaces/contactInterface";
import FileUpload from "./FileUpload";

interface LandingDashboardProps {
  onUploadSuccess: (contacts: Contact[]) => void;
}

export default function LandingDashboard({ onUploadSuccess }: LandingDashboardProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);

  const handleFileUploadSuccess = (uploadedContacts: Contact[]) => {
    setContacts(uploadedContacts);
    onUploadSuccess(uploadedContacts);
  };

  const handleBack = () => {
    // In a single-step process, "back" might mean returning to the main dashboard view.
    // This can be handled by the parent component. For now, we'll just log it.
    console.log("Back action triggered");
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full">
        <FileUpload
          onUploadSuccess={handleFileUploadSuccess}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}