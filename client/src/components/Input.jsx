const Input = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  className = '',
  readOnly = false,
}) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    {label && (
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
    )}
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 read-only:bg-gray-50"
    />
  </div>
);

export default Input;
