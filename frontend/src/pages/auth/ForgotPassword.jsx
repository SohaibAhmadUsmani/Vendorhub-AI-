import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MailCheck } from "lucide-react";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";

function ForgotPassword() {
    const [emailSent, setEmailSent] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        email: "",
    });

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const emailPattern = /^[^\s]+@[^\s]+\.[^\s]+$/;

    function validateForm() {
        const newErrors = {};

        if (!formData.email.trim() || !emailPattern.test(formData.email)) {
            newErrors.email = "Valid email is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    function handleSubmit() {
        if (!validateForm()) return;

        setEmailSent(true);
    }

    return (
        <AuthLayout>
            <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-white p-8 shadow-lg animate-fade-in">

                {!emailSent ? (
                    <>
                        {/* Heading */}
                        <div className="mb-8 text-center">
                            <h2 className="text-3xl font-bold text-[var(--text-h)]">
                                Forgot Password
                            </h2>

                            <p className="mt-2 text-sm text-[var(--text)]">
                                Enter your email and we'll send you a password reset link.
                            </p>
                        </div>

                        {/* Email */}
                        <AuthInput
                            label="Email Address"
                            icon={Mail}
                            type="email"
                            name="email"
                            value={formData.email}
                            placeholder="Enter your email"
                            onChange={handleChange}
                            error={errors.email}
                        />

                        {/* Submit */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="mt-8 h-11 w-full rounded-xl bg-[var(--accent)] font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-95"
                        >
                            Send Reset Link
                        </button>

                        {/* Back */}
                        <div className="mt-6 text-center">
                            <Link
                                to="/login"
                                className="text-sm font-medium text-[var(--accent)] hover:underline"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Success */}
                        <div className="flex flex-col items-center text-center">

                            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <MailCheck
                                    size={32}
                                    className="text-green-600"
                                />
                            </div>

                            <h2 className="text-3xl font-bold text-[var(--text-h)]">
                                Check your email
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-[var(--text)]">
                                We've sent a password reset link to
                            </p>

                            <p className="mt-2 font-semibold text-[var(--text-h)]">
                                {formData.email}
                            </p>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="mt-8 text-sm font-medium text-[var(--accent)] hover:underline"
                            >
                                Resend Email
                            </button>

                            <Link
                                to="/login"
                                className="mt-4 text-sm font-medium text-[var(--accent)] hover:underline"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </AuthLayout>
    );
}

export default ForgotPassword;