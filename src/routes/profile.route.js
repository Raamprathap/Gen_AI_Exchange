const router = require("express").Router();
const { getUser, updateProfile } = require("../controllers/profile.controller");
const { tokenValidator } = require("../middlewares/auth/tokenValidation");

router.get("/user", tokenValidator, getUser);
router.patch("/user", tokenValidator, updateProfile);

module.exports = router;