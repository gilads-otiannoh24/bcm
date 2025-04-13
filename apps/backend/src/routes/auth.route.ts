import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateDetails,
  checkAdminExists,
  validateResetToken,
  getUserProfile,
  anonymizeAccount,
} from "../controllers/auth";
import { protect } from "../middleware/auth";

const router = express.Router();

// Public Routes
router.post("/register", register);
router.post("/login", login);
router.get("/admin-exists", checkAdminExists);
router.post("/forgotpassword", forgotPassword);
router.post("/validateresettoken", validateResetToken);
router.patch("/resetpassword/:resettoken", resetPassword);

// Apply protection middleware to all routes below
router.use(protect);

// Protected Routes
router.get("/me", getMe);
router.get("/profile", getUserProfile);
router.get("/logout", logout);
router.patch("/updatepassword", updatePassword);
router.patch("/updatedetails", updateDetails);
router.post("/deleteaccount", anonymizeAccount);

export default router;
