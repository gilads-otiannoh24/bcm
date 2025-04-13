"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const auth_2 = require("../middleware/auth");
const router = express_1.default.Router();
// Public Routes
router.post("/register", auth_1.register);
router.post("/login", auth_1.login);
router.get("/admin-exists", auth_1.checkAdminExists);
router.post("/forgotpassword", auth_1.forgotPassword);
router.post("/validateresettoken", auth_1.validateResetToken);
router.patch("/resetpassword/:resettoken", auth_1.resetPassword);
// Apply protection middleware to all routes below
router.use(auth_2.protect);
// Protected Routes
router.get("/me", auth_1.getMe);
router.get("/profile", auth_1.getUserProfile);
router.get("/logout", auth_1.logout);
router.patch("/updatepassword", auth_1.updatePassword);
router.patch("/updatedetails", auth_1.updateDetails);
router.post("/deleteaccount", auth_1.anonymizeAccount);
exports.default = router;
