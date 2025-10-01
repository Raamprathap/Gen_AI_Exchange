const router = require("express").Router();
const { getUser, updateProfile, getDashboardData } = require("../controllers/profile.controller");
const { tokenValidator } = require("../middlewares/auth/tokenValidation");

router.get("/user", tokenValidator, getUser);
router.patch("/user", tokenValidator, updateProfile);
router.get("/dashboard", tokenValidator, getDashboardData);

module.exports = router;