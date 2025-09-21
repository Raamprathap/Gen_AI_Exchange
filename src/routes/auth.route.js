const router = require("express").Router();
const { 
    register,
    createUser,
    loginUser,
    forgotPassword,
    verifyToken,
    resetPassword,
    verifyMainToken,
    refreshToken,
} = require("../controllers/auth.controller");

const {
  tokenValidator,
  verifyRegisterToken,
  verifyForgotToken,
  readverifyForgotToken,
  readverifyRegisterTokens
} = require("../middlewares/auth/tokenValidation");

router.post("/register", register);
router.post("/create-user", verifyRegisterToken, createUser);
router.post("/login", loginUser);
router.post("/forgot-password", readverifyForgotToken, forgotPassword);
router.post("/reset-password", verifyForgotToken, resetPassword);
router.post("/verify-token", verifyToken);
router.post("/verify-main-token", verifyMainToken);
router.post("/refresh-token", refreshToken);
router.get('/verify-token-forgot',  readverifyForgotToken, verifyToken);
router.get('/verify-token-register',readverifyRegisterTokens , verifyToken);

module.exports = router;