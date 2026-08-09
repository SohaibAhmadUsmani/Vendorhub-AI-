function AuthInput({
  label,
  type,
  name,
  value,
  placeholder,
  onChange,
  error,
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="mt-1 text-sm font-medium text-[var(--text-h)]"
      >
        {label}
      </label>

      <input
        id={name}
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="
          h-11
          w-full
          rounded-xl
          border
          border-gray-200
          bg-white
          px-4
          text-base
          text-[var(--text-primary)]
          outline-none
          transition
          placeholder:text-gray-400
          focus:border-[var(--primary-purple)]
          focus:ring-2
          focus:ring-[var(--primary-purple)]/10
        "
      />

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default AuthInput;