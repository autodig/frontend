"use client";

import { useState } from "react";
import { CallRecord } from "@/interfaces";
import FileUpload from "./FileUpload";
import ContactTable from "./ContactTable";
import PersonalInfo from "./PersonalInfo";
import InfoSection from "./InfoSection";
import { Contact } from "@/interfaces/contactInterface";

type Step = "personal" | "upload";

export default function LandingDashboard() {
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [contacts, setContacts] = useState<Contact[]>([]);

  const handleUploadSuccess = (contacts: Contact[]) => {
    setContacts(contacts);
  };

  const handleNextStep = () => {
    setCurrentStep("upload");
  };

  const handleBackStep = () => {
    setCurrentStep("personal");
  };

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "personal"
                ? "bg-autodigPrimary text-white"
                : "bg-gray-200 text-gray-600"
                }`}
            >
              1
            </div>
            <div
              className={`w-24 h-1 ${currentStep === "upload" ? "bg-autodigPrimary" : "bg-gray-200"
                }`}
            />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "upload"
                ? "bg-autodigPrimary text-white"
                : "bg-gray-200 text-gray-600"
                }`}
            >
              2
            </div>
          </div>
        </div>

        {currentStep === "personal" ? (
          <PersonalInfo onNext={handleNextStep} />
        ) : (
          <FileUpload
            onUploadSuccess={handleUploadSuccess}
            onBack={handleBackStep}
          />
        )}

        {contacts.length > 0 && <ContactTable contacts={contacts} />}
      </div>
      {/* <InfoSection /> */}
    </div>
  );
}
