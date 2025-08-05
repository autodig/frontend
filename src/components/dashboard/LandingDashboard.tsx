"use client";

import { useState } from "react";
import { Contact } from "@/src/interfaces/contactInterface";
import FileUpload from "./FileUpload";
import PersonalInfo from "./PersonalInfo";

interface LandingDashboardProps {
  onUploadSuccess: (contacts: Contact[]) => void;
}

type Step = "personal" | "upload";

export default function LandingDashboard({ onUploadSuccess }: LandingDashboardProps) {
  const [currentStep, setCurrentStep] = useState<Step>("personal"); // Start with personal info
  const [contacts, setContacts] = useState<Contact[]>([]); // This state is still here for internal use if needed

  const handleFileUploadSuccess = (uploadedContacts: Contact[]) => {
    setContacts(uploadedContacts); // Update internal state if necessary
    onUploadSuccess(uploadedContacts); // Pass contacts up to DashboardLayout
  };

  const handleNextStep = () => {
    setCurrentStep("upload");
  };

  const handleBackStep = () => {
    setCurrentStep("personal");
    setContacts([]); // Clear contacts if going back to personal info
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full">
        <div className="flex items-center justify-center mb-10">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300
                ${currentStep === "personal"
                  ? "bg-autodigPrimary text-white shadow-md"
                  : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                }`}
            >
              1
            </div>
            <span className={`mt-2 text-sm font-medium ${currentStep === "personal" ? "text-autodigPrimary" : "text-muted-foreground"}`}>
              Personal Info
            </span>
          </div>

          <div
            className={`flex-grow h-1 mx-4 rounded-full transition-all duration-300 ${currentStep === "upload" ? "bg-autodigPrimary" : "bg-gray-200 dark:bg-gray-700"
              }`}
          />

          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300
                ${currentStep === "upload"
                  ? "bg-autodigPrimary text-white shadow-md"
                  : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                }`}
            >
              2
            </div>
            <span className={`mt-2 text-sm font-medium ${currentStep === "upload" ? "text-autodigPrimary" : "text-muted-foreground"}`}>
              Upload Data
            </span>
          </div>
        </div>

        {currentStep === "personal" ? (
          <PersonalInfo onNext={handleNextStep} />
        ) : (
          <FileUpload
            onUploadSuccess={handleFileUploadSuccess}
            onBack={handleBackStep}
          />
        )}
      </div>
    </div>
  );
}