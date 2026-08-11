import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";
import { RiMicrosoftFill } from "react-icons/ri";
import SocialButton from "../../components/auth/SocialButton";
import Divider from "../../components/auth/Divider";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import { login, verify2FA } from "../../services/authService";
import { useAuthForm } from "../hooks/useAuthForm";
import { LeftPanel } from "../../components/auth/LeftPanel";
import { getDashboardRoute } from "../../utils/authRedirect";
import VendorHubLogo from "../../components/layout/VendorHubLogo";

const STEP = {
  LOGIN: "login",
  TWO_FACTOR: "2fa",
};

const LOGIN_FIELDS = ["email", "password"];

function persistSession({ token, user }) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

function Login() {
  const navigate = useNavigate();
  const { formData, errors, handleChange, validate } = useAuthForm(LOGIN_FIELDS);

  const [step, setStep] = useState(STEP.LOGIN);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  async function handleLoginSubmit() {
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      if (response.requires2FA) {
        setStep(STEP.TWO_FACTOR);
        return;
      }

      persistSession(response);
      navigate(getDashboardRoute(response.user.role));
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleTwoFactorSubmit() {
    const otpPattern = /^\d{6}$/;
    if (!otpPattern.test(otp)) {
      setOtpError("Please enter a valid 6-digit code.");
      return;
    }

    setLoading(true);

    try {
      const response = await verify2FA({ email: formData.email, otp });

      persistSession(response);
      navigate(getDashboardRoute(response.user.role));
    } catch (error) {
      setOtpError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit() {
    if (step === STEP.LOGIN) return handleLoginSubmit();
    if (step === STEP.TWO_FACTOR) return handleTwoFactorSubmit();
  }

  function handleOtpChange(e) {
    setOtp(e.target.value);
    setOtpError("");
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">

      {/* LEFT SIDE  */}
      <LeftPanel
        variant="welcome"
        dotsIndex={step === STEP.LOGIN ? 0 : 1}
      />

      {/* RIGHT SIDE */}
      <div className="flex min-h-screen items-center justify-center bg-white px-12 py-12 lg:px-20">
        <div className="w-full max-w-[680px]">

          {step === STEP.LOGIN ? (
            <div className="flex w-full flex-col">

              {/* Heading */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="mb-3 flex justify-center">
                  <VendorHubLogo size="medium" showTagline={false} lightMode />
                </div>

                <h2 className="font-heading text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                  Welcome Back
                </h2>

                <p className="mt-1.5 text-base font-medium text-slate-600">
                  Login to your account to manage sourcing & vendors
                </p>
              </div>

              {/* Login Form */}
              <div className="mt-8 flex flex-col">

                <AuthInput
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="Enter your email"
                  onChange={handleChange}
                  error={errors.email}
                />

                <div className="mb-2 mt-5 flex items-center justify-between">
                  <label className="text-sm font-medium text-[var(--text-primary)]">
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm text-[var(--accent)] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <PasswordInput
                  name="password"
                  value={formData.password}
                  placeholder="Enter your password"
                  onChange={handleChange}
                  error={errors.password}
                />
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="mt-8 h-12 w-full max-w-[280px] rounded-xl bg-[var(--accent)] px-6 font-heading text-base font-semibold text-white transition hover:bg-[var(--primary-purple-hover)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </button>
                </div>

                <Divider text="OR CONTINUE WITH" />

                <div className="flex flex-col gap-3">
                  <SocialButton
                    icon={<FcGoogle size={22} />}
                    text="Continue with Google"
                    onClick={() => {
                      window.location.href = "http://localhost:5000/api/auth/google";
                    }}
                  />

                  <SocialButton
                    icon={<RiMicrosoftFill size={20} />}
                    text="Continue with Microsoft"
                    onClick={() => {
                      window.location.href =
                        "http://localhost:5000/api/auth/microsoft";
                    }}
                  />

                  <SocialButton
                    icon={<FaLinkedin size={20} />}
                    text="Continue with LinkedIn"
                    onClick={() => {
                      window.location.href =
                        "http://localhost:5000/api/auth/linkedin";
                    }}
                  />
                </div>

                {/* Signup link */}
                <div className="mt-8 flex items-center gap-1 text-base">
                  <p className="text-[var(--text-secondary)]">
                    Don't have an account?
                  </p>

                  <Link
                    to="/signup"
                    className="font-semibold text-[var(--accent)] hover:underline"
                  >
                    Create one
                  </Link>
                </div>

                <p className="mt-6 text-xs text-slate-500">
                  Protected by VendorHub AI
                </p>
              </div>
            </div>

          ) : (

            /* ================= 2FA ================= */

            <div className="flex w-full max-w-[500px] flex-col animate-fade-in">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent-bg)]">
                <ShieldCheck
                  size={32}
                  className="text-[var(--accent)]"
                />
              </div>

              <h2 className="mt-6 font-heading text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                Two-Factor Authentication
              </h2>

              <p className="mt-2 text-base text-[var(--text-secondary)]">
                Enter the verification code sent to your email.
              </p>

              <div className="mt-8">

                <p className="text-sm text-[var(--text-secondary)]">
                  Enter the 6-digit verification code sent to
                </p>

                <p className="mt-2 break-all text-lg font-semibold text-[var(--text-primary)]">
                  {formData.email}
                </p>

                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="123456"
                  className="mt-6 h-14 w-full rounded-xl border border-[var(--border)] bg-white text-center text-2xl font-semibold tracking-[0.6em] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-bg)]"
                />

                {otpError && (
                  <p className="mt-2 text-sm text-red-500">
                    {otpError}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="mt-6 h-12 w-full max-w-[280px] rounded-xl bg-[var(--accent)] px-6 font-heading text-base font-semibold text-white transition hover:bg-[var(--primary-purple-hover)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </button>

                <button
                  type="button"
                  className="mt-5 block text-sm font-medium text-[var(--accent)] hover:underline"
                >
                  Resend Code
                </button>

                <button
                  type="button"
                  onClick={() => setStep(STEP.LOGIN)}
                  className="mt-3 block text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]"
                >
                  ← Back to Login
                </button>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Login;