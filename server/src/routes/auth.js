import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  login,
  logout,
  signUp,
  validateAuth,
} from "../controllers/auth";
const router = Router();
router.get("/validate-auth/:token", validateAuth);
router.post("/signup", signUp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", changePassword);
router.get("/logout", logout);
export default router;
