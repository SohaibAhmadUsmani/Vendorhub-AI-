const User = require("../models/User");
const bcrypt = require("bcryptjs");
const {
    generateToken,
    sendOtpMail,
    sendPasswordResetEmail,
    sendVerificationEmail,
    generateOtp
} = require("../services/emailService");
const {generateJwt} = require("../services/jwtService");


/**
 * Register a new user and send an email verification link.
 */
const signup = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({
            success: false,
            message: "Email already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = generateToken();

    const user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        verificationToken: token,
        verificationTokenExpires: new Date(Date.now() + 60 * 60 * 1000)
    });
    await user.save();


    await sendVerificationEmail(user.name, user.email, token);

    return res.status(201).json({
        success: true,
        message: "Account created successfully. Please verify your email."
    });
};

/**
 * Authenticate a user. Issues a JWT directly, or triggers a 2FA
 * challenge first if the user has two-factor authentication enabled.
 */
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required."
        });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "No account found with this email."
        });
    }

    if (!user.isVerified) {
        return res.status(400).json({
            success: false,
            message: "Your email is not verified."
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password."
        });
    }

    if (user.twoFAEnabled) {
        const otp = generateOtp();
        user.twoFactorCode = otp;
        user.twoFactorCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        await sendOtpMail(user.name, user.email, otp);

        return res.status(200).json({
            success: true,
            requires2FA: true,
            message: "A verification code has been sent to your email."
        });
    }

    const token = generateJwt(user);

    return res.status(200).json({
        success: true,
        message: "Login successful.",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};

/**
 * Confirm a user's email address using the token sent at signup.
 */
const verifyEmail = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Verification Token is required."
        });
    }

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Invalid or expired verification link."
        });
    }

    if (Date.now() > user.verificationTokenExpires) {
        return res.status(400).json({
            success: false,
            message: "Verification link has expired. Please request a new verification email."
        });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    return res.status(200).json({
        success: true,
        message: "Email verified successfully. You can now log in."
    });
};

/**
 * Issue a fresh email verification token for a user who hasn't
 * verified yet (e.g. their original link expired).
 */
const resendVerification = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required."
        });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "No account found with this email."
        });
    }

    if (user.isVerified) {
        return res.status(400).json({
            success: false,
            message: "Your email is already verified."
        });
    }

    const token = generateToken();
    user.verificationToken = token;
    user.verificationTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    // await sendVerificationEmail(user.name, user.email, token);
    await sendVerificationEmail(user.name, user.email, token);

    return res.status(200).json({
        success: true,
        message: "A new verification email has been sent."
    });
};

/**
 * Generate a password-reset token and email it to the user.
 */
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required."
        });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "No account found with this email."
        });
    }

    const token = generateToken();
    user.resetPasswordToken = token;
    user.resetPasswordTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    await sendPasswordResetEmail(user.name, user.email, token);

    return res.status(200).json({
        success: true,
        message: "Password reset email sent successfully."
    });
};

/**
 * Consume a password-reset token and set the user's new password.
 */
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "Token and new password are required."
        });
    }

    const user = await User.findOne({ resetPasswordToken: token });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Invalid or expired reset password link."
        });
    }

    if (Date.now() > user.resetPasswordTokenExpires) {
        return res.status(400).json({
            success: false,
            message: "Reset Password link has expired. Please request a new reset password email."
        });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpires = null;
    await user.save();

    return res.status(200).json({
        success: true,
        message: "Password reset successfully. You can now log in with your new password."
    });
};

/**
 * Verify the OTP submitted for a 2FA-protected login and, on
 * success, complete the login by issuing a JWT.
 */
const verify2fa = async (req, res) => {
    const { otp, email } = req.body;

    if (!otp || !email) {
        return res.status(400).json({
            success: false,
            message: "Email and otp are required."
        });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "No account found with this email."
        });
    }

    if (user.twoFactorCode !== otp) {
        return res.status(400).json({
            success: false,
            message: "Invalid verification code."
        });
    }

    if (Date.now() > user.twoFactorCodeExpires) {
        return res.status(400).json({
            success: false,
            message: "Verification code has expired. Please login again."
        });
    }

    user.twoFactorCode = null;
    user.twoFactorCodeExpires = null;
    await user.save();

    const token = generateJwt(user);

    return res.status(200).json({
        success: true,
        message: "Login successful.",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};

module.exports = {
    signup,
    login,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    verify2fa
};