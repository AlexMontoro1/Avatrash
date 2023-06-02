const Avatar = require("../models/Avatar.model");
const isAuthenticated = require("../middlewares/isAuthenticated.js")
const router = require("express").Router();
const Comment = require("../models/Comment.model")

// POST "/avatar/create" create a new avatar

router.post("/create", isAuthenticated, async (req,res,next) => {
    const userId  = req.payload._id

    const { seed, flip, rotate, scale, radius, size, backgroundColor, backgroundType, backgroundRotation, translateX, translateY, clip, randomizeIds, accessories, accessoriesColor, accessoriesProbability, base, clothesColor, clothing, clothingGraphic, eyebrows, eyes, facialHair, facialHairColor, facialHairProbability, hairColor, hatColor, mouth, nose, skinColor, style, top, topProbability, likes } = req.body
    try {
        await Avatar.create({
            seed, flip, rotate, scale, radius, size, backgroundColor, backgroundType, backgroundRotation, translateX, translateY, clip, randomizeIds, accessories, accessoriesColor, accessoriesProbability, base, clothesColor, clothing, clothingGraphic, eyebrows, eyes, facialHair, facialHairColor, facialHairProbability, hairColor, hatColor, mouth, nose, skinColor, style, top, topProbability, owner: userId , likes
        })
        res.json("avatar creado !")

    } catch (err) {
        next(err)
    }
})

// GET "/avatar/:avatarId" details of an avatar

router.get("/:avatarId", isAuthenticated, async (req,res,next) => {
    const {avatarId} = req.params
    try {
        const avatarParams = await Avatar.findById(avatarId)
        const allComents = await Comment({avatar: avatarParams._id}).populate("author","username")
        res.json(avatarParams, allComents)
    } catch (err) {
        next(err)
    }
})

// PUT "/avatar/:avatarId" receive details and edit avatar

router.put("/:avatarId", isAuthenticated, async (req,res,next) => {
    const {avatarId} = req.params
    const { seed, flip, rotate, scale, radius, backgroundColor, backgroundType, backgroundRotation, translateX, translateY, clip, accessories, accessoriesColor, base, clothesColor, clothing, clothingGraphic, eyebrows, eyes, facialHair, facialHairColor, hairColor, hatColor, mouth, nose, skinColor, style, top } = req.body
    try {
        await Avatar.findByIdAndUpdate(avatarId, {
            seed, flip, rotate, scale, radius, backgroundColor, backgroundType, backgroundRotation, translateX, translateY, clip, accessories, accessoriesColor, base, clothesColor, clothing, clothingGraphic, eyebrows, eyes, facialHair, facialHairColor, hairColor, hatColor, mouth, nose, skinColor, style, top
        })
        res.json("avatar actualizado !")
    } catch (err) {
        next(err)
    }
})

// POST "/avatar/:avatarId/comment" create a new comment on avatar details page

router.post("/:avatarId/comment", isAuthenticated, async (req,res,next) => {
    const userId  = req.payload._id
    const { content } = req.body;
    const {avatarId} = req.params
    try {
        const avatarParams = await Avatar.findById(avatarId)
        await Comment.create({
            content,
            avatar: avatarParams._id,
            author: userId
        })
        res.json("comentario creado!")
    } catch (err) {
        next(err)
    }


})





module.exports = router;