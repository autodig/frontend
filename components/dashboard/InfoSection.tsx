"use client";

import { useState } from "react";
import { TextAreaField } from "./InfoSection/TextAreaField";
import { CheckboxField } from "./InfoSection/CheckboxField";
import { InputField } from "./InfoSection/InputField";

export default function InfoSection() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    location: "",
    isPolitical: false,
    isManufacturing: false,
    bio: "",
    phone: "",
    email: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-background border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <InputField
            label="First Name"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <InputField
            label="Last Name"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <InputField
            label="Location"
            id="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex gap-6 mb-4">
          <CheckboxField
            label="Political Person"
            name="isPolitical"
            checked={formData.isPolitical}
            onChange={handleChange}
          />

          <CheckboxField
            label="Manufacturing"
            name="isManufacturing"
            checked={formData.isManufacturing}
            onChange={handleChange}
          />
        </div>

        <TextAreaField
          label="Bio"
          id="bio"
          value={formData.bio}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <InputField
            label="Phone (Optional)"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <InputField
            label="Email (Optional)"
            id="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}
