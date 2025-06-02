import {
  AddToFavourites,
  getMyFavourites,
  RemoveFromFavourites,
} from "../controllers/favourites";
import { protect } from "../middleware/auth";

const express = require("express");
const router = express.Router();

router.use(protect);

router.get("/me", getMyFavourites);

router.post("/add", AddToFavourites);
router.delete("/:id", RemoveFromFavourites);

export default router;
