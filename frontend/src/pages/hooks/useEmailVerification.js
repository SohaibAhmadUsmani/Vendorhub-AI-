import { useCallback, useState } from "react";
import { resendVerification, verifyEmail } from "../../services/authService";

export function useEmailVerification() {
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [resending, setResending] = useState(false);

  const verify = useCallback(async (token) => {
    setStatus("verifying");

    try {
      await verifyEmail(token);
      setStatus("verified");
    } catch (error) {
      setErrorMessage(error.message);
      setStatus("failed");
    }
  }, []);

  const resend = useCallback(async (email) => {
    setResending(true);

    try {
      const result = await resendVerification(email);
      return { success: true, message: result.message || "Verification email sent." };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setResending(false);
    }
  }, []);

  return { status, errorMessage, resending, verify, resend };
}