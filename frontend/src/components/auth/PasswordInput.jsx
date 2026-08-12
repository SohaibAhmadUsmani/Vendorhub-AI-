import { Eye, EyeOff  } from "lucide-react";
import { useState } from "react";


function PasswordInput({ label, name, value, placeholder, onChange, error, disabled = false, icon }) {
    const [showPassword, setShowPassword] = useState(false);
    
    return (
        <>
            {label && (
                <label
                    htmlFor={name}
                    className="mt-1 mb-2 text-sm font-semibold text-slate-900"
                >
                    {label}
                </label>
            )}
            <div className="relative">

  <input
    id={name}
    type={showPassword ? "text" : "password"}
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
      pr-12
      text-base
      font-medium
      text-slate-900
      outline-none
      placeholder:text-slate-500
      focus:border-[var(--primary-purple)]
      focus:ring-2
      focus:ring-[var(--primary-purple)]/20
    "
  />

  {/* Right eye */}
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="
      absolute
      right-4
      top-1/2
      -translate-y-1/2
      text-slate-500
      hover:text-slate-700
    "
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