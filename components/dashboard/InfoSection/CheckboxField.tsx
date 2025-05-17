interface CheckboxProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CheckboxField = ({
  label,
  name,
  checked,
  onChange,
}: CheckboxProps) => (
  <label className="flex items-center space-x-2">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="rounded text-autodigPrimary focus:ring-autodigPrimary"
    />
    <span className="text-sm">{label}</span>
  </label>
);
