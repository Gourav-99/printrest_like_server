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
    res.cookie("access_token", token, {
      httpOnly: false, //when set to true it cann't be accessed from browser or client side
    });
    res.redirect("http://localhost:3000/");

    // Successful authentication, redirect home.
  }
);

export default router;
