const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createAdmin,
  verifyUser,
  getUserMetrics,
  getAllUsersInTheSystem,
} = require("../controller/userController");
const { protect, authorizeRoles } = require("../middlewares/middleware");

const router = express.Router();

router.get("/all", protect, getAllUsersInTheSystem);
router.get("/", protect, authorizeRoles("admin"), getAllUsers);
router.get("/user-metrics", protect, authorizeRoles("admin"), getUserMetrics);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

// to verify user (Only Admins & SuperAdmins can do this)
router.put(
  "/verify/:userId",
  protect,
  authorizeRoles("Admin", "SuperAdmin"),
  verifyUser
);

//for adding admin
router.post("/", protect, authorizeRoles("SuperAdmin"), createAdmin);

module.exports = router;
