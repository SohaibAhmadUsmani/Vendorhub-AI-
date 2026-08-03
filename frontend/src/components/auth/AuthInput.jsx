function AuthInput({ label, icon, type, name, value, placeholder, onChange, error, }) {
    const Icon = icon;
    return (
        <>
            <label className="mb-2 text-sm font-medium text-[var(--text-h)]">
                {label}
            </label>
            <div className="relative">

                {Icon && (
                    <Icon
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                )}


                <input
                    type={type}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    className="h-11 w-full rounded-xl border border-[var(--border)] pl-10 pr-3 outline-none transition-all duration-200 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-bg)] focus:shadow-sm"
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-500">
                    {error}
                </p>
            )}
        </>
    );
}
export default AuthInput;