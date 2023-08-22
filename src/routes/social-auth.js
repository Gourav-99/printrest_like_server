// oauthRoutes.js

import { Router } from "express";
import passport from "passport";
import { User } from "../database";
import { generateToken } from "../utils/token";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async function (req, res) {
    const { email } = req.user;
    const user = await User.findOne({ email });
    const userData = {
      id: user._id,
      email: user.email,
      initials: user.initials,
      fullName: user.fullName,
      profilePicture: user.profilePicture,
      role: user.role,
    };
    const token = await generateToken(userData);
    console.log("token", token);
    console.log("user", userData);
    res.cookie("access_token", token, {
      httpOnly: false, // Set this to true for security (default)
      domain: ".amplifyapp.com",
      maxAge: 24 * 60 * 60 * 1000, // Optional: Set cookie expiration time
      secure: true, // Optional: Use for secure connections (HTTPS)
      sameSite: "strict", // Optional: Apply same-site policy
    });
    res.redirect("https://master.dwrud2cqgk3ja.amplifyapp.com/");

    // Successful authentication, redirect home.
  }
);

export default router;
