const express = require("express");
const ctrls = require("../../controllers/users");
const {
  validateBody,
  checkToken,
  uploadFiles,
} = require("../../middleware/index");
const {
  userValidationSchema,
  userSubscriptionSchema,
  mailSchema,
} = require("../../models/joiSchemas");

const router = express.Router();

router.post(
  "/register",
  validateBody(userValidationSchema),
  ctrls.registerUser
);

router.get("/verify/:verificationToken", ctrls.verifyMail);

router.post("/verify", validateBody(mailSchema), ctrls.resendVerifyMail);

router.post("/login", validateBody(userValidationSchema), ctrls.loginUser);

router.post("/logout", checkToken, ctrls.logoutUser);

router.get("/current", checkToken, ctrls.currentUser);

router.patch(
  "/",
  // some adminCheckToken,
  validateBody(userSubscriptionSchema),
  ctrls.setSubscription
);

router.patch(
  "/avatars",
  checkToken,
  uploadFiles.single("avatar"),
  ctrls.updateAvatar
);

module.exports = router;
