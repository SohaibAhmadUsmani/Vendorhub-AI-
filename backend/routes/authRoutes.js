const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  verify2fa,
} = require("../controllers/authController");

const passport = require("../config/passport");
const { generateJwt } = require("../services/jwtService");

// Normal authentication
router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-2fa", verify2fa);

// ==================== GOOGLE ====================

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    const token = generateJwt(req.user);

    const user = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    };

    const params = new URLSearchParams({
      token,
      user: JSON.stringify(user),
    });

    res.redirect(
      `http://localhost:5173/oauth-success?${params.toString()}`
    );
  }
);

// ==================== MICROSOFT ====================

router.get(
  "/microsoft",
  passport.authenticate("microsoft", {
    session: false,
  })
);

router.get(
  "/microsoft/callback",
  passport.authenticate("microsoft", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    const token = generateJwt(req.user);

    const user = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    };

    const params = new URLSearchParams({
      token,
      user: JSON.stringify(user),
    });

    res.redirect(
      `http://localhost:5173/oauth-success?${params.toString()}`
    );
  }
);

// ==================== LINKEDIN ====================

router.get(
  "/linkedin",
  passport.authenticate("linkedin", {
    session: false,
  })
);

router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    const token = generateJwt(req.user);

    const user = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    };

    const params = new URLSearchParams({
      token,
      user: JSON.stringify(user),
    });

    res.redirect(
      `http://localhost:5173/oauth-success?${params.toString()}`
    );
  }
);

module.exports = router;