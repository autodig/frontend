interface PersonalInfoProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export const InputField = ({
  label,
  id,
  value,
  onChange,
  required = false,
}: PersonalInfoProps) => (
  <div>
    <label className="block text-sm font-medium mb-1" htmlFor={id}>
      {label}
      {required && "*"}
    </label>
    <input
      type="text"
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-autodigPrimary"
      required={required}
    />
  </div>
);
