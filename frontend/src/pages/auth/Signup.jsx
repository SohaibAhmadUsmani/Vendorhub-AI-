import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AlertTriangle, ArrowRight, Building2, CheckCircle2,
  Info, Loader2, Lock, Mail, MailCheck, Send, ShoppingCart, XCircle,
} from "lucide-react";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import { signup } from "../../services/authService";
import { useAuthForm } from "../hooks/useAuthForm";
import { LeftPanel } from "../../components/auth/LeftPanel";
import { useEmailVerification } from "../hooks/useEmailVerification";

const SIGNUP_FIELDS = ["fullname", "email", "password", "confirmPassword"];

const VIEW = {
  ROLE: "role",
  FORM: "form",
  SIGNUP_SUCCESS: "signup_success",
  VERIFYING: "verifying",
  VERIFIED: "verified",
  VERIFICATION_FAILED: "verification_failed",
};

const ROLE_OPTIONS = [
  {
    id: "buyer",
    title: "Buyer",
    description: "Find suppliers, manage RFQs and orders.",
    icon: ShoppingCart,
  },
  {
    id: "vendor",
    title: "Vendor",
    description: "Showcase products, receive RFQs and grow your business.",
    icon: Building2,
  },
];



function RoleCard({ icon: Icon, title, description, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`
        group
        relative
        flex
        min-h-[120px]
        w-full
        items-center
        gap-6
        rounded-2xl
        border
        px-6
        py-6
        text-left
        transition-all
        duration-200
        focus:outline-none
        ${selected
          ? "border-[var(--primary-purple)] bg-white shadow-[0_8px_24px_rgba(108,92,231,0.12)]"
          : "border-[#E3E5EC] bg-white hover:border-[var(--primary-purple)]/40 hover:shadow-lg"
        }
      `}
    >
      {/* Icon */}
      <div
        className={`
          flex
          h-16
          w-16
          shrink-0
          items-center
          justify-center
          rounded-xl
          ${selected
            ? "bg-[var(--primary-purple-light)]"
            : "bg-[#F5F3FF]"
          }
        `}
      >
        <Icon
          size={28}
          strokeWidth={2}
          className="text-[var(--primary-purple)]"
        />
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <h3 className="font-heading text-xl font-semibold leading-tight text-[var(--text-primary)]">
          {title}
        </h3>

        <p className="mt-2 text-base leading-6 text-[var(--text-secondary)]">
          {description}
        </p>
      </div>

      {/* Radio */}
      <div
        className={`
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-full
          border-2
          ${selected
            ? "border-[var(--primary-purple)]"
            : "border-[#D9DDE7]"
          }
        `}
      >
        {selected && (
          <div className="h-4 w-4 rounded-full bg-[var(--primary-purple)]" />
        )}
      </div>
    </button>
  );
}

function SubmitButton({ loading, disabled, children, className = "", ...props }) {
  return (
    <button
      type="button"
      disabled={loading || disabled}
      className={`flex h-11 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--primary-purple)] px-4 font-heading text-sm font-semibold text-white shadow-[var(--shadow-card)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--primary-purple-hover)] hover:shadow-[var(--shadow-hover)] active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[var(--shadow-card)] ${className}`}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : children}
    </button>
  );
}

function InfoBox({ tone, icon: Icon, children }) {
  const tones = {
    info: "bg-[var(--accent-cyan-light)] text-[var(--text-secondary)]",
    success: "bg-[var(--status-active-bg)] text-[var(--status-active-text)]",
    error: "bg-red-50 text-red-600",
  };
  const iconTones = {
    info: "text-[var(--accent-cyan)]",
    success: "text-[var(--status-active-text)]",
    error: "text-red-500",
  };
  return (
    <div
      className={`mt-5 flex items-start gap-2 rounded-[var(--radius-md)] px-4 py-3 text-sm font-medium leading-relaxed ${tones[tone]}`}
    >
      <Icon size={16} className={`mt-0.5 shrink-0 ${iconTones[tone]}`} />
      <span>{children}</span>
    </div>
  );
}

function Signup() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [view, setView] = useState(token ? VIEW.VERIFYING : VIEW.ROLE);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resendFeedback, setResendFeedback] = useState(null);

  const { formData, errors, handleChange, validate } = useAuthForm(SIGNUP_FIELDS);
  const { status, errorMessage, resending, verify, resend } = useEmailVerification();

  useEffect(() => {
    if (token) verify(token);
  }, [token, verify]);

  useEffect(() => {
    if (!token) return;
    if (status === "verified") setView(VIEW.VERIFIED);
    if (status === "failed") setView(VIEW.VERIFICATION_FAILED);
  }, [status, token]);

  async function handleSubmit() {
    if (!validate()) return;

    setSubmitError("");
    setLoading(true);

    try {
      await signup({
        name: formData.fullname,
        email: formData.email,
        password: formData.password,
        role,
      });
      setView(VIEW.SIGNUP_SUCCESS);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend(email) {
    setResendFeedback(null);
    const result = await resend(email);
    setResendFeedback(result);
  }

  const isVerificationExpired = /expired/i.test(errorMessage);
  const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : "";

  const leftPanelProps = {
    [VIEW.ROLE]: { variant: "welcome", dotsIndex: 0 },
    [VIEW.FORM]: { variant: "welcome", dotsIndex: 1 },
    [VIEW.SIGNUP_SUCCESS]: {
      variant: "status",
      icon: MailCheck,
      iconClassName: "text-[var(--primary-purple)]",
      title: "Almost there!",
      subtitle: "We've sent a verification email to complete your registration.",
    },
    [VIEW.VERIFYING]: {
      variant: "status",
      icon: Lock,
      iconClassName: "text-[var(--primary-purple)]",
      title: "Verifying...",
      subtitle: "Please wait while we verify your email address.",
    },
    [VIEW.VERIFIED]: {
      variant: "status",
      icon: CheckCircle2,
      iconClassName: "text-green-600",
      title: "Success!",
      subtitle: "Your email has been verified successfully.",
    },
    [VIEW.VERIFICATION_FAILED]: {
      variant: "status",
      icon: XCircle,
      iconClassName: "text-red-600",
      title: "Verification failed",
      subtitle: "This link is invalid or has expired.",
    },
  }[view];

  return (
    <div className="grid min-h-screen items-stretch md:grid-cols-2">

      <LeftPanel {...leftPanelProps} />

      <div className="flex min-h-screen items-start justify-center bg-white px-8 py-12 lg:px-16 xl:px-20">
        {view === VIEW.ROLE && (
          <div className="flex w-full max-w-[680px] flex-col gap-4">

            {/* Heading */}
            <div className="flex flex-col gap-2">
              <h2 className="font-heading text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                Create your account
              </h2>

              <p className="text-base text-[var(--text-secondary)]">
                How will you use VendorHub AI?
              </p>
            </div>

            {/* Roles */}
            <div className="flex flex-col gap-5">
              {ROLE_OPTIONS.map((option) => (
                <RoleCard
                  key={option.id}
                  icon={option.icon}
                  title={option.title}
                  description={option.description}
                  selected={role === option.id}
                  onSelect={() => setRole(option.id)}
                />
              ))}
            </div>

            {/* Continue + Login */}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                disabled={!role}
                onClick={() => setView(VIEW.FORM)}
                className="
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
          transition
          hover:bg-[var(--primary-purple-hover)]
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
              >
                Continue
              </button>

              <div className="flex items-center gap-1 text-base">
                <p className="text-[var(--text-secondary)]">
                  Already have an account?
                </p>

                <Link
                  to="/login"
                  className="font-semibold text-[var(--primary-purple)] hover:underline"
                >
                  Log in
                </Link>
              </div>
            </div>

          </div>
        )}

        {view === VIEW.FORM && (
          <div className="w-full max-w-[520px] animate-fade-in">

            {/* Heading */}
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                Complete your account
              </h2>

              <p className="mt-2 text-base text-[var(--text-secondary)]">
                You're signing up as{" "}
                <span className="font-semibold text-[var(--primary-purple)]">
                  {roleLabel}
                </span>
                .
              </p>
            </div>

            {/* Form */}
            <div className="mt-3 flex flex-col ">

              <AuthInput
                label="Full Name"
                type="text"
                name="fullname"
                value={formData.fullname}
                placeholder="i.e. Khadija Ayub"
                onChange={handleChange}
                error={errors.fullname}
              />

              <AuthInput
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                placeholder="Enter your email"
                onChange={handleChange}
                error={errors.email}
              />

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

              {/* Error */}
              {submitError && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {submitError}
                </p>
              )}

              {/* Create account */}
              <SubmitButton
                className="mt-4 h-12 w-full rounded-xl text-base"
                loading={loading}
                onClick={handleSubmit}
              >
                Create Account
              </SubmitButton>
            </div>

            {/* Login */}
            <div className="mt-6 flex items-center justify-center gap-1 text-sm">
              <p className="text-[var(--text-secondary)]">
                Already have an account?
              </p>

              <Link
                to="/login"
                className="font-semibold text-[var(--primary-purple)] transition-colors hover:text-[var(--primary-purple-hover)] hover:underline"
              >
                Log in
              </Link>
            </div>

          </div>
        )}

        {view === VIEW.SIGNUP_SUCCESS && (
          <div className="w-full max-w-[610px] animate-fade-in">

            {/* Heading */}
            <h2 className="flex justify-center font-heading text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              Verify your email
            </h2>

            {/* Verification message */}
            <div className="mt-5 ">
              <p className="text-lg text-[var(--text-secondary)]">
                We've sent a verification link to:
              </p>

              <p className=" flex justify-center mt-1 break-all text-lg font-semibold text-[var(--primary-purple)]">
                {formData.email}
              </p>
            </div>

            {/* Success badge */}
            <div className="mt-6 flex  justify-center min-h-[52px] w-full items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
              <CheckCircle2
                size={22}
                className="shrink-0"
              />

              <span className="text-base font-semibold">
                Verification email sent
              </span>
            </div>

            {/* Instructions */}
            <p className="mt-5 text-base leading-7 text-[var(--text-secondary)]">
              Please check your inbox and click on the link to verify your
              email address.
            </p>

            {/* Info box */}
            <div className="mt-5">
              <InfoBox tone="info" icon={Info}>
                Didn't receive the email? Check your spam folder or resend the email.
              </InfoBox>
            </div>

            {/* Resend feedback */}
            {resendFeedback && (
              <p
                className={`mt-4 text-sm font-medium ${resendFeedback.success
                  ? "text-[var(--status-active-text)]"
                  : "text-red-600"
                  }`}
              >
                {resendFeedback.message}
              </p>
            )}

            {/* Resend button */}
            <SubmitButton
              className="mt-6 w-full"
              loading={resending}
              onClick={() => handleResend(formData.email)}
            >
              <Send size={17} />
              Resend Verification Email
            </SubmitButton>

            {/* Login */}
            <Link
              to="/login"
              className="mt-5 block text-center text-base font-semibold text-[var(--primary-purple)] transition-colors hover:text-[var(--primary-purple-hover)] hover:underline"
            >
              Go to Login
            </Link>

          </div>
        )}

        {view === VIEW.VERIFYING && (
          <div className="flex w-full max-w-[680px] flex-col items-center justify-center py-20 text-center animate-fade-in">

            <Dots count={3} activeIndex={2} tone="dark" />

            <h2 className="mt-8 font-heading text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              Verifying your email
            </h2>

            <p className="mt-3 max-w-md text-base leading-7 text-[var(--text-secondary)]">
              This will only take a few seconds.
            </p>

          </div>
        )}

        {view === VIEW.VERIFIED && (
          <div className="w-full max-w-[680px] animate-fade-in">

            {/* Heading */}
            <h2 className="font-heading text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              Email verified!
            </h2>

            {/* Success message */}
            <div className="mt-6">
              <InfoBox tone="success" icon={CheckCircle2}>
                Your email has been verified successfully.
              </InfoBox>
            </div>

            {/* Description */}
            <p className="mt-5 text-base leading-7 text-[var(--text-secondary)]">
              You can now access all features of VendorHub AI.
            </p>

            {/* Login button */}
            <Link
              to="/login"
              className="
        mt-7
        flex
        h-12
        w-full
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-[var(--primary-purple)]
        px-6
        font-heading
        text-base
        font-semibold
        text-white
        shadow-[var(--shadow-card)]
        transition-all
        duration-200
        ease-out
        hover:-translate-y-0.5
        hover:bg-[var(--primary-purple-hover)]
        hover:shadow-[var(--shadow-hover)]
        active:translate-y-0
        active:scale-[0.98]
      "
            >
              Go to Login
              <ArrowRight size={17} />
            </Link>

          </div>
        )}

        {view === VIEW.VERIFICATION_FAILED && (
          <div className="w-full max-w-[680px] animate-fade-in">

            {/* Heading */}
            <h2 className="font-heading text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              {isVerificationExpired ? "Link expired" : "Invalid link"}
            </h2>

            {/* Error message */}
            <div className="mt-6">
              <InfoBox tone="error" icon={AlertTriangle}>
                {errorMessage || "This verification link is invalid or has expired."}
              </InfoBox>
            </div>

            {/* Explanation */}
            <p className="mt-5 text-base leading-7 text-[var(--text-secondary)]">
              Don't worry! You can request a new verification email.
            </p>

            {/* Resend feedback */}
            {resendFeedback && (
              <p
                className={`mt-4 text-sm font-medium ${resendFeedback.success
                    ? "text-[var(--status-active-text)]"
                    : "text-red-600"
                  }`}
              >
                {resendFeedback.message}
              </p>
            )}

            {/* Resend form */}
            {!resendFeedback?.success && (
              <div className="mt-7 flex flex-col">

                <AuthInput
                  label="Email Address"
                  type="email"
                  name="resendEmail"
                  value={resendEmail}
                  placeholder="Enter your email"
                  onChange={(e) => setResendEmail(e.target.value)}
                />

                <SubmitButton
                  className="mt-5 w-full"
                  loading={resending}
                  onClick={() => handleResend(resendEmail)}
                >
                  <Send size={16} />
                  Resend Verification Email
                </SubmitButton>

              </div>
            )}

            {/* Login */}
            <Link
              to="/login"
              className="
        mt-6
        block
        text-center
        text-sm
        font-semibold
        text-[var(--primary-purple)]
        transition-colors
        hover:text-[var(--primary-purple-hover)]
        hover:underline
      "
            >
              Go to Login
            </Link>

          </div>
        )}

      </div>
    </div >

  );
}

export default Signup;