import advancedResults from "../middleware/advancedResults";
import { protect } from "../middleware/auth";
import { Connection } from "../models/Connection";

const express = require("express");
const router = express.Router();
const {
  getConnections,
  getConnection,
  createConnection,
  updateConnection,
  deleteConnection,
  acceptConnection,
  rejectConnection,
} = require("../controllers/connections");

// Apply protection to all routes
router.use(protect);

// Connection routes
router.route("/").get(getConnections).post(createConnection);

router
  .route("/:id")
  .get(
    advancedResults(Connection, {
      populate: [
        {
          path: "contact",
          select: "firstName lastName email avatar",
        },
        {
          path: "card",
          select: "title name jobTitle company email phone template color",
        },
      ],
    }),
    getConnection
  )
  .patch(updateConnection)
  .delete(deleteConnection);

// Connection actions
router.patch("/:id/accept", acceptConnection);
router.patch("/:id/reject", rejectConnection);

export default router;
