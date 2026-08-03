import { Eye, EyeOff , Lock } from "lucide-react";
import { useState } from "react";


function PasswordInput({ label, name, value, placeholder, onChange, error, disabled = false, icon }) {
    const [showPassword, setShowPassword] = useState(false);
    
    return (
        <>
            <label className="mb-2 text-sm font-medium text-[var(--text-h)]">
                {label}
            </label>
            <div className="relative">
                
                    <Lock
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                
                <input
                    type={showPassword ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="h-11 w-full rounded-xl border border-[var(--border)] pl-10 pr-10 outline-none transition-all duration-200 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-bg)] focus:shadow-sm"
                />

                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-[var(--accent)]"
                >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-500">
                    {error}
                </p>
            )}
        </>
    );
}

export default PasswordInput;