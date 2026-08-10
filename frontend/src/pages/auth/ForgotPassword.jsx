import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MailCheck } from "lucide-react";
import { forgotPassword } from "../../services/authService";
import AuthInput from "../../components/auth/AuthInput";
import { LeftPanel } from "../../components/auth/LeftPanel";

function ForgotPassword() {
    const [emailSent, setEmailSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");

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

    async function handleSubmit() {
        if (!validateForm()) return;
        setServerError("");
        setLoading(true);

        try {

            await forgotPassword({
                email: formData.email
            });

            setEmailSent(true);

        } catch (error) {

            setServerError(error.message);

        } finally {

            setLoading(false);

        }
    }

   return (
  <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">

    {/* LEFT SIDE */}
    <LeftPanel
      variant="welcome"
      dotsIndex={0}
    />

    {/* RIGHT SIDE */}
    <div className="flex min-h-screen items-center justify-center bg-white px-12 py-12 lg:px-20">
      <div className="w-full max-w-[680px]">

        {!emailSent ? (
          <div className="animate-fade-in">

            {/* Heading */}
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                Forgot Password
              </h2>

              <p className="mt-2 text-base text-[var(--text-secondary)]">
                Enter your email and we'll send you a password reset link.
              </p>
            </div>

            {/* Form */}
            <div className="mt-8">

              <AuthInput
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                placeholder="Enter your email"
                onChange={handleChange}
                error={errors.email}
              />

              {serverError && (
                <p className="mt-3 text-sm text-red-500">
                  {serverError}
                </p>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="
                  mt-8
                  h-12
                  w-full
                  max-w-[280px]
                  rounded-xl
                  bg-[var(--primary-purple)]
                  px-6
                  font-heading
                  text-base
                  font-semibold
                  text-white
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-[var(--primary-purple-hover)]
                  hover:shadow-lg
                  active:translate-y-0
                  active:scale-95
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              {/* Back */}
              <div className="mt-6">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-[var(--primary-purple)] hover:underline"
                >
                  Back to Login
                </Link>
              </div>

            </div>
          </div>
        ) : (
          <div className="animate-fade-in">

            {/* Success icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <MailCheck
                size={32}
                className="text-green-600"
              />
            </div>

            {/* Heading */}
            <h2 className="mt-6 font-heading text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              Check your email
            </h2>

            <p className="mt-3 text-base leading-7 text-[var(--text-secondary)]">
              We've sent a password reset link to
            </p>

            <p className="mt-2 break-all font-heading text-base font-semibold text-[var(--primary-purple)]">
              {formData.email}
            </p>

            {/* Resend */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="
                mt-8
                text-sm
                font-semibold
                text-[var(--primary-purple)]
                hover:underline
                disabled:opacity-50
              "
            >
              {loading ? "Sending..." : "Resend Email"}
            </button>

            {/* Back */}
            <div className="mt-4">
              <Link
                to="/login"
                className="text-sm font-semibold text-[var(--primary-purple)] hover:underline"
              >
                Back to Login
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>

  </div>
);
}

export default ForgotPassword;