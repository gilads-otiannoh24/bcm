import advancedResults from "../middleware/advancedResults";
import { Organization } from "../models/Organization";

const express = require("express");
const router = express.Router();
const {
  getOrganizations,
  getOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganizationMembers,
  addOrganizationMember,
  removeOrganizationMember,
  getOrganizationCards,
} = require("../controllers/organizations");

const { protect, authorize } = require("../middleware/auth");

// Apply protection to all routes
router.use(protect);

// Organization routes
router
  .route("/")
  .get(
    authorize("admin"),
    advancedResults(Organization, {
      populate: {
        path: "owner",
        select: "firstName lastName email",
      },
    }),
    getOrganizations
  )
  .post(createOrganization);

router
  .route("/:id")
  .get(getOrganization)
  .patch(updateOrganization)
  .delete(deleteOrganization);

// Organization members
router
  .route("/:id/members")
  .get(getOrganizationMembers)
  .post(authorize("admin"), addOrganizationMember);

router.delete(
  "/:id/members/:userId",
  authorize("admin"),
  removeOrganizationMember
);

// Organization cards
router.get("/:id/cards", getOrganizationCards);

export default router;
