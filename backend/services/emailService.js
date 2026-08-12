const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

function generateToken() {
    return crypto.randomBytes(32).toString("hex");
}
function generateOtp(){
      return  Math.floor(Math.random() * 900000) + 100000;
}


async function sendVerificationEmail(name, email, token) {
    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Verify your VendorHub AI account",
        html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
                <h2 style="color: #2563eb;">Welcome to VendorHub AI</h2>

                <p>Hello <strong>${name}</strong>,</p>

                <p>
                    Thank you for creating your VendorHub AI account.
                    Please verify your email by clicking the button below.
                </p>

                <p style="margin: 30px 0;">
                    <a
                        href="${verificationLink}"
                        style="
                            background-color: #2563eb;
                            color: white;
                            padding: 12px 24px;
                            text-decoration: none;
                            border-radius: 6px;
                            display: inline-block;
                            font-weight: bold;
                        "
                    >
                        Verify Email
                    </a>
                </p>

                <p>
                    This verification link will expire in <strong>1 hour</strong>.
                </p>

                <p>
                    If you didn't create this account, you can safely ignore this email.
                </p>

                <hr>

                <p style="font-size: 12px; color: gray;">
                    VendorHub AI Team
                </p>
            </div>

        `
    }
    try {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn("[emailService] SMTP_USER or SMTP_PASS missing in .env. Verification email skipped.");
            return;
        }
        await transporter.sendMail(mailOptions);
        console.log("Verification email sent successfully.");
    } catch (error) {
        console.error("Error sending verification email (non-fatal):", error.message);
    }
}
async function sendPasswordResetEmail(name, email, token) {
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Reset your Password",
        html: `
    <h2>Reset Your Password</h2>

    <p>Hello ${name},</p>

    <p>
        We received a request to reset your VendorHub AI account password.
    </p>

    <p>
        Click the button below to create a new password.
    </p>

    <a
        href="${resetLink}"
        style="
            display:inline-block;
            padding:12px 24px;
            background:#2563eb;
            color:white;
            text-decoration:none;
            border-radius:6px;
            font-weight:bold;
        "
    >
        Reset Password
    </a>

    <p style="margin-top:20px;">
        This link expires in 1 hour.
    </p>

    <p>
        If you didn't request a password reset, you can safely ignore this email.
    </p>`
    }
    try {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn("[emailService] SMTP credentials missing in .env. Password reset email skipped.");
            return;
        }
        await transporter.sendMail(mailOptions);
        console.log(`Password reset email sent to ${email}`);
    } catch (error) {
        console.error(`Failed to send password reset email to ${email}:`, error.message);
    }
}
async function sendOtpMail(name, email, otp) {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "VendorHub AI - Two-Factor Authentication Code",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
                
                <h2 style="color: #2563eb;">VendorHub AI</h2>

                <p>Hello <strong>${name}</strong>,</p>

                <p>
                    Your two-factor authentication (2FA) verification code is:
                </p>

                <div style="
                    margin: 25px 0;
                    padding: 15px;
                    text-align: center;
                    background-color: #f3f4f6;
                    border-radius: 8px;
                    font-size: 28px;
                    font-weight: bold;
                    letter-spacing: 6px;
                    color: #2563eb;
                ">
                    ${otp}
                </div>

                <p>
                    This verification code will expire in <strong>10 minutes</strong>.
                </p>

                <p>
                    If you did not attempt to log in to your VendorHub AI account,
                    please ignore this email and consider changing your password.
                </p>

                <hr>

                <p style="font-size: 12px; color: gray;">
                    VendorHub AI Team
                </p>

            </div>
        `
    };

    try {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn("[emailService] SMTP credentials missing in .env. OTP email skipped.");
            return;
        }
        await transporter.sendMail(mailOptions);
        console.log(`OTP email sent to ${email}`);
    } catch (error) {
        console.error(`Failed to send OTP email to ${email}:`, error.message);
    }
}


module.exports = { sendVerificationEmail, generateToken , sendPasswordResetEmail,sendOtpMail , generateOtp };