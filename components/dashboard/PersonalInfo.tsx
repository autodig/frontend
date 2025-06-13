import { useState } from "react";

interface PersonalInfoProps {
  onNext: () => void;
}

export default function PersonalInfo({ onNext }: PersonalInfoProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you can add validation and API calls if needed
    onNext();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="w-full p-6 bg-card rounded-xl shadow-lg border border-border mx-auto max-w-2xl"> {/* Combined classes, used max-w-2xl for better form width */}
      <h2 className="text-3xl font-extrabold text-foreground mb-8 text-center">
        Your Details
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-muted-foreground mb-1"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground
                       shadow-sm focus:border-autodigPrimary focus:ring-1 focus:ring-autodigPrimary outline-none transition-all duration-200"
            required
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-muted-foreground mb-1"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground
                       shadow-sm focus:border-autodigPrimary focus:ring-1 focus:ring-autodigPrimary outline-none transition-all duration-200"
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-muted-foreground mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground
                       shadow-sm focus:border-autodigPrimary focus:ring-1 focus:ring-autodigPrimary outline-none transition-all duration-200"
            required
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-muted-foreground mb-1"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground
                       shadow-sm focus:border-autodigPrimary focus:ring-1 focus:ring-autodigPrimary outline-none transition-all duration-200"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-autodigPrimary text-autodigPrimary-foreground px-5 py-2.5 rounded-md
                     hover:bg-autodigPrimary/90 transition-colors duration-200 ease-in-out
                     focus:outline-none focus:ring-2 focus:ring-autodigPrimary focus:ring-offset-2 font-semibold"
        >
          Next Step
        </button>
      </form>
    </div>
  );
}