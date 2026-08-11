import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Building2, ShoppingCart, Loader2 } from "lucide-react";
import { getDashboardRoute } from "../../utils/authRedirect";

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

function OAuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  const [oauthData, setOauthData] = useState(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");

    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const oauthProvider = searchParams.get("oauthProvider");

    // Existing user
    if (token && userParam) {
      try {
        const user = JSON.parse(userParam);

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        navigate(getDashboardRoute(user.role), {
          replace: true,
        });

        return;
      } catch (error) {
        console.error("OAuth login failed:", error);

        navigate("/login", {
          replace: true,
        });

        return;
      }
    }

    // New OAuth user
    if (name && email && oauthProvider) {
      setOauthData({
        name,
        email,
        oauthProvider,
      });

      setCheckingSession(false);
      return;
    }

    // Invalid OAuth response
    navigate("/login", {
      replace: true,
    });
  }, [navigate, searchParams]);

  async function handleCompleteSignup() {
    if (!role) {
      setError("Please select how you will use VendorHub AI.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/oauth/complete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: oauthData.name,
            email: oauthData.email,
            role,
            oauthProvider: oauthData.oauthProvider,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to complete account setup."
        );
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate(getDashboardRoute(data.user.role), {
        replace: true,
      });
    } catch (error) {
      console.error("OAuth signup failed:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession || !oauthData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent" />

          <h2 className="mt-5 font-heading text-xl font-semibold text-[var(--text-primary)]">
            Signing you in...
          </h2>

          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Please wait while we finish setting up your session.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12">
      <div className="w-full max-w-[680px]">

        {/* Heading */}
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Complete your account
          </h2>

          <p className="mt-2 text-base text-[var(--text-secondary)]">
            Welcome,{" "}
            <span className="font-semibold text-[var(--primary-purple)]">
              {oauthData.name}
            </span>
            !
          </p>

          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            How will you use VendorHub AI?
          </p>
        </div>

        {/* Roles */}
        <div className="mt-8 flex flex-col gap-5">
          {ROLE_OPTIONS.map((option) => {
            const Icon = option.icon;
            const selected = role === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setRole(option.id);
                  setError("");
                }}
                className={`
                  group relative flex min-h-[120px] w-full items-center
                  gap-6 rounded-2xl border px-6 py-6 text-left
                  transition-all duration-200
                  ${
                    selected
                      ? "border-[var(--primary-purple)] bg-white shadow-[0_8px_24px_rgba(108,92,231,0.12)]"
                      : "border-[#E3E5EC] bg-white hover:border-[var(--primary-purple)]/40 hover:shadow-lg"
                  }
                `}
              >
                <div
                  className={`
                    flex h-16 w-16 shrink-0 items-center justify-center rounded-xl
                    ${
                      selected
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

                <div className="min-w-0 flex-1">
                  <h3 className="font-heading text-xl font-semibold text-[var(--text-primary)]">
                    {option.title}
                  </h3>

                  <p className="mt-2 text-base leading-6 text-[var(--text-secondary)]">
                    {option.description}
                  </p>
                </div>

                <div
                  className={`
                    flex h-8 w-8 shrink-0 items-center justify-center
                    rounded-full border-2
                    ${
                      selected
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
          })}
        </div>

        {/* Error */}
        {error && (
          <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        {/* Continue */}
        <button
          type="button"
          disabled={!role || loading}
          onClick={handleCompleteSignup}
          className="
            mt-7 flex h-12 w-full items-center justify-center gap-2
            rounded-xl bg-[var(--primary-purple)] px-6
            font-heading text-base font-semibold text-white
            transition hover:bg-[var(--primary-purple-hover)]
            disabled:cursor-not-allowed disabled:opacity-40
          "
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Creating Account...
            </>
          ) : (
            "Continue"
          )}
        </button>

        <p className="mt-5 text-center text-xs text-[var(--text-secondary)]">
          Signed in with {oauthData.oauthProvider}
        </p>
      </div>
    </div>
  );
}

export default OAuthSuccess;