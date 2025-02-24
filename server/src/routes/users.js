const express = require("express");
const { register, login } = require("../controller/users");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Admin-only route
const { protect, authorizeRoles } = require("../middlewares/middleware");
router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
    res.status(200).json({ message: "Welcome Admin!" });
});

module.exports = router;
