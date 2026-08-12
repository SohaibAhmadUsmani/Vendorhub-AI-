const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const MicrosoftStrategy = require("passport-microsoft").Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const User = require("../models/User");

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;

          if (!email) {
            return done(
              new Error("Google account does not have an email address.")
            );
          }

          const user = await User.findOne({ email });

          // Existing VendorHub user
          if (user) {
            user.oauthProvider = "google";
            user.isVerified = true;
            await user.save();

            return done(null, user);
          }

          // New OAuth user — don't create them yet.
          return done(null, {
            isNewOAuthUser: true,
            name: profile.displayName || "Google User",
            email,
            oauthProvider: "google",
          });
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
} else {
  console.warn("[passport] Google OAuth disabled: Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in .env");
}

if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
  passport.use(
    new MicrosoftStrategy(
      {
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        callbackURL: process.env.MICROSOFT_CALLBACK_URL || "http://localhost:5000/api/auth/microsoft/callback",
        scope: ["user.read"],
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          const email =
            profile.emails?.[0]?.value ||
            profile._json?.mail ||
            profile._json?.userPrincipalName;

          if (!email) {
            return done(
              new Error("Microsoft account does not have an email address.")
            );
          }

          const user = await User.findOne({ email });

          // Existing VendorHub user
          if (user) {
            user.oauthProvider = "microsoft";
            user.isVerified = true;
            await user.save();

            return done(null, user);
          }

          // New OAuth user
          return done(null, {
            isNewOAuthUser: true,
            name: profile.displayName || "Microsoft User",
            email,
            oauthProvider: "microsoft",
          });
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
} else {
  console.warn("[passport] Microsoft OAuth disabled: Missing MICROSOFT_CLIENT_ID or MICROSOFT_CLIENT_SECRET in .env");
}

if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  passport.use(
    new LinkedInStrategy(
      {
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: process.env.LINKEDIN_CALLBACK_URL || "http://localhost:5000/api/auth/linkedin/callback",
        scope: ["openid", "profile", "email"],
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          const email =
            profile.emails?.[0]?.value ||
            profile._json?.email;

          if (!email) {
            return done(
              new Error("LinkedIn account email not available.")
            );
          }

          const user = await User.findOne({ email });

          // Existing VendorHub user
          if (user) {
            user.oauthProvider = "linkedin";
            user.isVerified = true;
            await user.save();

            return done(null, user);
          }

          // New OAuth user
          return done(null, {
            isNewOAuthUser: true,
            name: profile.displayName || "LinkedIn User",
            email,
            oauthProvider: "linkedin",
          });
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
} else {
  console.warn("[passport] LinkedIn OAuth disabled: Missing LINKEDIN_CLIENT_ID or LINKEDIN_CLIENT_SECRET in .env");
}

module.exports = passport;