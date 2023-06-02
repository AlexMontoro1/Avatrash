const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const authRouter = require("./auth.routes.js")
router.use("/auth", authRouter)

const profileRouter = require("./profile.routes.js")
router.use("/profile", profileRouter)

const avatarRouter = require("./avatar.routes.js")
router.use("/avatar", avatarRouter)

module.exports = router;
