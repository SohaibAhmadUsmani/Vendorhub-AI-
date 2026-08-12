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
        className="mt-1 text-sm font-semibold text-slate-900"
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
          border-[#CBD5E1]
          bg-white
          px-4
          text-base
          font-medium
          text-slate-900
          outline-none
          transition
          placeholder:text-slate-500
          focus:border-[var(--primary-purple)]
          focus:ring-2
          focus:ring-[var(--primary-purple)]/20
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