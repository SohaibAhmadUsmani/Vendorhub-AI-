import AuthLayout from "../../components/auth/AuthLayout";
import { useState } from "react";
import { Mail, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";
import { RiMicrosoftFill } from "react-icons/ri";
import SocialButton from "../../components/auth/SocialButton";
import Divider from "../../components/auth/Divider";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";

function Login() {
    const [otp, setOtp] = useState("");
    const [errors, setErrors] = useState({});
    const [otpError, setOtpError] = useState("");
    const [step, setStep] = useState("login");
    const [formData, setFormData] = useState(
        {
            email: "",
            password: "",
        })
    function handleChange(e) {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }
    const emailPattern = /^[^\s]+@[^\s]+\.[^\s]+$/;
    function validateForm() {
        const newErrors = {};
        if (!formData.email.trim() || !emailPattern.test(formData.email)) {
            newErrors.email = "Valid email is required";
        }
        if (!formData.password.trim() || formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }
    
        function handleSubmit() {
            if (step === "login") {

                if (!validateForm()) return;

                // TODO: Login API

                setStep("2fa");

            } else if (step === "2fa") {
               const otpPattern = /^\d{6}$/;
                if (!otpPattern.test(otp)) {
                    setOtpError("Please enter a valid 6-digit code.");
                    return;
                }

                // TODO: Verify OTP API

                // Navigate to dashboard
            }
        
    }
    return (
        <AuthLayout>
            <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-white p-8 shadow-lg animate-fade-in">

                {/* Heading */}
                <div className="mb-8 text-center">
                    {step === "login" ? (
                        <>
                            <h2 className="text-3xl font-bold text-[var(--text-h)]">
                                Welcome Back
                            </h2>
                            <p className="mt-2 text-sm text-[var(--text)]">
                                Login to your VendorHub AI account
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-3xl font-bold text-[var(--text-h)]">
                                Two-Factor Authentication
                            </h2>

                            <p className="mt-2 text-sm text-[var(--text)]">
                                Enter the verification code sent to your email.
                            </p>
                        </>
                    )}
                </div>

                {step === "login" ? (
                    <div className="flex flex-col">


                        <AuthInput label="Email Address" icon={Mail} type="email"
                            name="email"
                            value={formData.email}
                            placeholder="Enter your email"
                            onChange={handleChange}
                            error={errors.email}
                        />
                        {/* Password Header */}
                        <div className="mb-2 mt-5 flex items-center justify-between">
                            <label className="text-sm font-medium text-[var(--text-h)]">
                                Password
                            </label>

                            <Link
                                to="/forgot-password"
                                className="text-sm text-[var(--accent)] hover:underline"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Password Input */}
                        <PasswordInput
                            name="password"
                            value={formData.password}
                            placeholder="Enter your password"
                            onChange={handleChange}
                            error={errors.password}
                        />



                        {/* Sign In */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="mt-8 h-11 w-full rounded-xl bg-[var(--accent)] font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-95"
                        >
                            Sign In
                        </button>

                        {/* Divider */}
                        <Divider text="OR CONTINUE WITH" />

                        {/* Social Login */}
                        <div className="space-y-3">

                            <SocialButton
                                icon={<FcGoogle size={22} />}
                                text="Continue with Google"
                            />

                            <SocialButton
                                icon={<RiMicrosoftFill size={20} />}
                                text="Continue with Microsoft"
                            />

                            <SocialButton
                                icon={<FaLinkedin size={20} />}
                                text="Continue with LinkedIn"
                            />
                        </div>

                        {/* Footer */}
                        <div className="mt-8 text-center text-sm">
                            <span className="text-[var(--text)]">
                                Don't have an account?
                            </span>

                            <Link
                                to="/signup"
                                className="ml-1 font-semibold text-[var(--accent)] hover:underline"
                            >
                                Create one
                            </Link>
                        </div>

                        <p className="mt-8 text-center text-xs text-gray-400">
                            Protected by VendorHub AI
                        </p>

                    </div>
                ) : (
                    <div className="mt-6 flex w-full max-w-md flex-col items-center text-center animate-fade-in">

                        {/* Icon */}
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--accent-bg)]">
                            <ShieldCheck
                                size={40}
                                className="text-[var(--accent)]"
                            />
                        </div>

                        {/* Badge */}
                        <span className="rounded-full bg-[var(--accent-bg)] px-4 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                            Two-Factor Authentication
                        </span>

                        {/* Message */}
                        <p className="mt-6 text-sm leading-6 text-[var(--text)]">
                            Enter the 6-digit verification code sent to
                        </p>

                        <p className="mt-2 text-lg font-semibold text-[var(--text-h)] break-all">
                            {formData.email}
                        </p>

                        {/* OTP */}
                        <input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) =>{ setOtp(e.target.value); setOtpError("");}}
                            placeholder="123456"
                            className="mt-8 h-14 w-full rounded-xl border border-[var(--border)] text-center text-2xl font-semibold tracking-[0.6em] outline-none transition-all duration-200 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-bg)]"
                        />

                        {otpError && (
                            <p className="mt-2 text-sm text-red-500">
                                {error}
                            </p>
                        )}

                        {/* Verify */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="mt-8 h-11 w-full rounded-xl bg-[var(--accent)] font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-95"
                        >
                            Verify Code
                        </button>

                        {/* Resend */}
                        <button
                            type="button"
                            className="mt-5 text-sm font-medium text-[var(--accent)] hover:underline"
                        >
                            Resend Code
                        </button>

                        {/* Back */}
                        <button
                            type="button"
                            onClick={() => setStep("login")}
                            className="mt-3 text-sm text-[var(--text)] hover:text-[var(--accent)]"
                        >
                            ← Back to Login
                        </button>
                    </div>
                )}


            </div>
        </AuthLayout>
    );
}

export default Login;