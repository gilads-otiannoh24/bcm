import {
  getSetting,
  getSettings,
  getUserSettings,
  updateUserSettings,
} from "../controllers/settings";
import { authorize, protect } from "../middleware/auth";

const express = require("express");
const router = express.Router();

router.use(protect);

router.get("/me", getUserSettings);
router.patch("/updatedetails", updateUserSettings);
router.get("/me/:id", getSetting);

router.get("/", authorize("admin"), getSettings);

export default router;
