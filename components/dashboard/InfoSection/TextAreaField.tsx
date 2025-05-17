interface TextAreaProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TextAreaField = ({
  label,
  id,
  value,
  onChange,
}: TextAreaProps) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1" htmlFor={id}>
      {label}
    </label>
    <textarea
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      rows={4}
      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-autodigPrimary"
    />
  </div>
);
