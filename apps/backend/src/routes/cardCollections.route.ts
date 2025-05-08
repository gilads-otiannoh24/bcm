import advancedResults from "../middleware/advancedResults";
import { CardCollection } from "../models/CardCollection";

const express = require("express");
const router = express.Router();
const {
  getCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection,
  toggleFavorite,
  addTag,
  removeTag,
} = require("../controllers/cardCollections");

const { protect } = require("../middleware/auth");

// Apply protection to all routes
router.use(protect);

// Collection routes
router.route("/").get(getCollections).post(createCollection);

router
  .route("/:id")
  .get(
    advancedResults(CardCollection, {
      populate: {
        path: "card",
        select:
          "title name jobTitle company email phone template color preview",
      },
    }),
    getCollection
  )
  .patch(updateCollection)
  .delete(deleteCollection);

// Collection actions
router.patch("/:id/favorite", toggleFavorite);
router.post("/:id/tags", addTag);
router.delete("/:id/tags/:tag", removeTag);

export default router;
