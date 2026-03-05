export const InputField = ({
  name,
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  sensitive = false,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {sensitive && (
        <span className="ml-1 text-xs text-amber-500">⚠ sensible</span>
      )}
    </label>

    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition
        ${
          sensitive
            ? "border-amber-200 bg-amber-50 focus:ring-amber-400"
            : "border-gray-300 focus:ring-black"
        }
        ${error ? "border-red-400" : ""}`}
    />

    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);