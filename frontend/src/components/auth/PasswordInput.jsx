import { Eye, EyeOff  } from "lucide-react";
import { useState } from "react";


function PasswordInput({ label, name, value, placeholder, onChange, error, disabled = false, icon }) {
    const [showPassword, setShowPassword] = useState(false);
    
    return (
        <>
            <label className="mt-1 mb-2 text-sm font-medium text-[var(--text-h)]">
                {label}
            </label>
            <div className="relative">

  <input
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
      border-gray-200
      bg-white
      px-4
      pr-12
      text-base
      outline-none
      placeholder:text-gray-400
      focus:border-[var(--primary-purple)]
      focus:ring-2
      focus:ring-[var(--primary-purple)]/10
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
      text-gray-400
      hover:text-[var(--primary-purple)]
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