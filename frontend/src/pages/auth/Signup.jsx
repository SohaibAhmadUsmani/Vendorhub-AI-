import { useState } from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import { Link } from "react-router-dom";
import { ShoppingCart, Building2, MailCheck, Mail, } from "lucide-react";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import Divider from "../../components/auth/Divider";

function Signup() {
    const [role, setRole] = useState("");
    const [step, setStep] = useState("role");
    const [errors, setErrors] = useState({});
    const [accountCreated, setAccountCreated] = useState(false);
    const [formData, setFormData] = useState(
        {
            fullname: "",
            email: "",
            password: "",
            confirmPassword: ""
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

        if (!formData.fullname.trim()) {
            newErrors.fullname = "Full name is required";
        }
        if (!formData.email.trim() || !emailPattern.test(formData.email)) {
            newErrors.email = "Valid email is required";
        }
        if (!formData.password.trim() || formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }
        if (!formData.confirmPassword.trim() || formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = "Password must match.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }
    function handleSubmit() {
        if (!validateForm()) return;
        setAccountCreated(true);
    }

    return (

        <AuthLayout>
            <div className="flex flex-col items-center justify-center">
                {accountCreated ?
                    <>
                        <h2 className="text-3xl font-bold text-[var(--text-h)]">
                            Verify Your Email
                        </h2>

                        <p className="mt-2 text-sm text-[var(--text)]">
                            Your account has been created successfully.
                        </p>


                    </> :
                    step === "role" ? (
                        <>
                            <h2>Create your account</h2>
                            <p>How will you use VendorHub AI?</p>
                        </>
                    ) : (
                        <>
                            <h2>Complete your account</h2>
                            <p>You're signing up as a {role}.</p>
                        </>
                    )


                }

                {accountCreated ?
                    (
                        <div className="mt-6 flex w-full max-w-md flex-col items-center text-center animate-fade-in">

                            {/* Success Icon */}
                            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                                <MailCheck
                                    size={40}
                                    className="text-green-600"
                                />
                            </div>

                            {/* Success Badge */}
                            <span className="rounded-full bg-green-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-green-700">
                                Verification Email Sent
                            </span>

                            {/* Message */}
                            <p className="mt-6 text-sm leading-6 text-[var(--text)]">
                                We've sent a verification email to
                            </p>

                            <p className="mt-2 text-lg font-semibold text-[var(--text-h)] break-all">
                                {formData.email}
                            </p>

                            <p className="mt-4 text-sm leading-6 text-[var(--text)]">
                                Please verify your email before signing in.
                                <br />
                                If you don't see the email, check your spam folder.
                            </p>

                            {/* Buttons */}
                            <button
                                type="button"
                                className="mt-8 h-11 w-full rounded-xl bg-[var(--accent)] font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-95"
                            >
                                Resend Verification Email
                            </button>

                            <Link
                                to="/login"
                                className="mt-4 text-sm font-semibold text-[var(--accent)] hover:underline"
                            >
                                Go to Login
                            </Link>
                        </div>
                    ) :

                    step === "form" ?
                        <div className="mt-6 flex w-full max-w-md flex-col">
                            {/* Name */}
                            <AuthInput label="Full Name"
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                placeholder="i.e. Khadija Ayub"
                                onChange={handleChange}
                                error={errors.fullname}
                            />

                            {/* Email */}
                            <AuthInput label="Email Address" type="email"
                                name="email"
                                icon={Mail}
                                value={formData.email}
                                placeholder="Enter your email"
                                onChange={handleChange}
                                error={errors.email}
                            />

                            {/* Password */}
                            <PasswordInput
                                label="Password"
                                name="password"
                                value={formData.password}
                                placeholder="Enter your password"
                                onChange={handleChange}
                                error={errors.password}
                            />

                            <PasswordInput
                                label="Confirm Password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                placeholder="Confirm your password"
                                onChange={handleChange}
                                error={errors.confirmPassword}
                            />

                            {/* Create Account */}
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="mt-6 w-full rounded-xl bg-[var(--accent)] px-4 py-3 font-medium text-white transition hover:opacity-90"
                            >
                                Create Account
                            </button>

                            {/* Login */}
                            <div className="mt-4 flex items-center justify-center gap-1 text-sm">
                                <p>Already have an account?</p>

                                <Link
                                    to="/login"
                                    className="ml-1 font-semibold text-[var(--accent)] hover:underline"
                                >
                                    Login
                                </Link>
                            </div>
                        </div> :



                        <>
                            <div className="mt-6 flex gap-4">

                                {/* Buyer */}
                                <button
                                    type="button"
                                    onClick={() => setRole("buyer")}
                                    className={`flex-1 rounded-xl border p-6 text-left transition-all duration-200 ${role === "buyer"
                                        ? "border-[var(--accent)] bg-[var(--accent-bg)] shadow-md"
                                        : "border-[var(--border)] bg-white hover:border-[var(--accent-border)] hover:shadow-sm"
                                        }`}
                                >
                                    <div className="mb-3">
                                        <ShoppingCart size={20} />
                                    </div>

                                    <h3 className="text-lg font-semibold text-[var(--text-h)]">
                                        Buyer
                                    </h3>

                                    <p className="mt-1 text-sm text-[var(--text)]">
                                        Find suppliers, manage RFQs and orders.
                                    </p>
                                </button>

                                {/* Vendor */}
                                <button
                                    type="button"
                                    onClick={() => setRole("vendor")}
                                    className={`flex-1 rounded-xl border p-6 text-left transition-all duration-200 ${role === "vendor"
                                        ? "border-[var(--accent)] bg-[var(--accent-bg)] shadow-md"
                                        : "border-[var(--border)] bg-white hover:border-[var(--accent-border)] hover:shadow-sm"
                                        }`}
                                >
                                    <div className="mb-3">
                                        <Building2 size={20} />
                                    </div>

                                    <h3 className="text-lg font-semibold text-[var(--text-h)]">
                                        Vendor
                                    </h3>

                                    <p className="mt-1 text-sm text-[var(--text)]">
                                        Showcase products, receive RFQs and grow your business.
                                    </p>
                                </button>
                            </div>

                            {/* Continue */}
                            <button
                                type="button"
                                disabled={!role}
                                onClick={() => setStep("form")}
                                className="mt-6 w-40 rounded-xl bg-[var(--accent)] px-4 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Continue
                            </button>
                        </>
                }


                {/* Step 1: Role Selection
                {step === "role" && (
                   
                )}

                
                {step === "form" && ( */}




            </div>
        </AuthLayout >

    );
}

export default Signup;