const Avatar = require("../models/Avatar.model");
const isAuthenticated = require("../middlewares/isAuthenticated.js")
const router = require("express").Router();
const Comment = require("../models/Comment.model")

router.get("/", async (req,res,next)=> {
    try {
        const response = await Avatar.find()
        res.json(response)
    } catch (err) {
        next(err)
    }
})

// POST "/avatar/create" create a new avatar

router.post("/create", isAuthenticated, async (req,res,next) => {
    const userId  = req.payload._id

    const { seed, flip, rotate, scale, radius, size, backgroundColor, backgroundType, backgroundRotation, translateX, translateY, clip, randomizeIds, accessories, accessoriesColor, accessoriesProbability, base, clothesColor, clothing, clothingGraphic, eyebrows, eyes, facialHair, facialHairColor, facialHairProbability, hairColor, hatColor, mouth, nose, skinColor, style, top, topProbability, likes, name, json } = req.body
    try {
        await Avatar.create({
            seed, flip, rotate, scale, radius, size, backgroundColor, backgroundType, backgroundRotation, translateX, translateY, clip, randomizeIds, accessories, accessoriesColor, accessoriesProbability, base, clothesColor, clothing, clothingGraphic, eyebrows, eyes, facialHair, facialHairColor, facialHairProbability, hairColor, hatColor, mouth, nose, skinColor, style, top, topProbability, owner: userId , likes, name, json
        })
        res.json("avatar creado !")

    } catch (err) {
        next(err)
    }
})

// GET "/avatar/:avatarId" details of an avatar

router.get("/:avatarId", async (req,res,next) => {
    const {avatarId} = req.params
    try {
        const avatarParams = await Avatar.findById(avatarId)
        const allComents = await Comment.find({avatar: avatarParams._id}).populate("author","username")
        const avatarData = {
            avatar: avatarParams,
            comment: allComents,
          };
        res.json(avatarData)
    } catch (err) {
        next(err)
    }
})

// PUT "/avatar/:avatarId" receive details and edit avatar

router.put("/:avatarId", isAuthenticated, async (req,res,next) => {
    const {avatarId} = req.params
    const { seed, flip, rotate, scale, radius, backgroundColor, backgroundType, backgroundRotation, translateX, translateY, clip, accessories, accessoriesColor, base, clothesColor, clothing, clothingGraphic, eyebrows, eyes, facialHair, facialHairColor, hairColor, hatColor, mouth, nose, skinColor, style, top, name, json } = req.body
    try {
        await Avatar.findByIdAndUpdate(avatarId, {
            seed, flip, rotate, scale, radius, backgroundColor, backgroundType, backgroundRotation, translateX, translateY, clip, accessories, accessoriesColor, base, clothesColor, clothing, clothingGraphic, eyebrows, eyes, facialHair, facialHairColor, hairColor, hatColor, mouth, nose, skinColor, style, top, name, json
        })
        res.json("avatar actualizado !")
    } catch (err) {
        next(err)
    }
})

// DELETE "/avatar/:avatarId" delete avatar with this ID

router.delete("/:avatarId", isAuthenticated, async (req,res,next) => {
    const {avatarId} = req.params
    try {
        await Avatar.findByIdAndDelete(avatarId)
        res.json("Avatar borrado !")
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

// DELETE "/avatar/:avatarId/comment" delete a comment from the owner

router.delete("/:avatarId/comment/:commentId", isAuthenticated, async (req,res,next) => {
    const userId = req.payload._id;
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    // Verificar si el usuario autenticado es el propietario del comentario
    if (comment.author.toString() !== userId) {
      return res.status(403).json({ message: "Acceso no autorizado" });
    }

    // El usuario está autorizado, eliminar el comentario
    await Comment.findByIdAndDelete(commentId);

    res.json({ message: "Comentario eliminado" });
  } catch (err) {
    next(err);
  }
})




module.exports = router;