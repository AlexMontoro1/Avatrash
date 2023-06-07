const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback.model");
const { isAdmin } = require("../middlewares/isAdmin.config");
const isAuthenticated = require("../middlewares/isAuthenticated.js")

router.get("/feedback", isAuthenticated, isAdmin, async (req, res, next) => {
try {
    const response = await Feedback.find()
    res.json(response)
} catch (err) {
    next(err)
}
}
)

router.post("/feedback", async (req,res,next) => {
    const { contentLike, contentDislike } = req.body;
    try {
        await Feedback.create({
            contentLike,
            contentDislike
        })
        res.json("feedback pasado")
    } catch (err) {
        next(err)
    }
})
module.exports = router;