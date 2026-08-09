const BASE_URL = "http://localhost:5000/api/auth";

async function request(endpoint, options = {}) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });


    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong. Please try again.");
    }

    return data;
}

export function signup(userData) {
    return request("/signup", {
        method: "POST",
        body: JSON.stringify(userData),
    });
}

export function login(credentials) {
    return request("/login", {
        method: "POST",
        body: JSON.stringify(credentials),
    });
}

export function verifyEmail(token) {
    return request("/verify-email", {
        method: "POST",
        body: JSON.stringify({ token }),
    });
}

export function resendVerification(email) {
    return request("/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email }),
    });
}

export function forgotPassword(email) {
    return request("/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
    });
}

export function resetPassword(data) {
    return request("/reset-password", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function verify2FA(data) {
    return request("/verify-2fa", {
        method: "POST",
        body: JSON.stringify(data),
    });
}