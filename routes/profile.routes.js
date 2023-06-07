const User = require("../models/User.model");
const { passValidation, emailValidation } = require("../utils/verification.js");
const bcrypt = require("bcryptjs");
const router = require("express").Router();
const isAuthenticated = require("../middlewares/isAuthenticated.js");
const Avatar = require("../models/Avatar.model");
const uploader = require("../middlewares/cloudinary.config")

// GET "/profile/main" gets the user profile

router.get("/main", isAuthenticated, async (req,res,next)=> {
  const userId = req.payload._id
  console.log(userId)
    try {
        const findUser = await User.findById(userId)
        console.log(findUser)
        const userAvatars = await Avatar.find({owner: userId})
        await findUser.save();
        const userData = {
          user: findUser,
          avatars: userAvatars,
        };
        res.json(userData)
    } catch (err) {
        next(err)
    }
})


// PUT "/profile/:userId/edit" edit the user profile

router.put("/edit", isAuthenticated, async (req,res,next)=> {
    const  userId  = req.payload._id
    const { username, email, password } = req.body
    try {
        const emailValid = await emailValidation(email);
    const passValid = await passValidation(password);
    if (!emailValid.valid) {
      res.status(400).json({ errorMessage: emailValid.errorMessage });
      return;
    }
    if (!passValid.valid) {
      res.status(400).json({ errorMessage: passValid.errorMessage });
      return;
    }
    // we verify if user is registered with this email,pass or user
    const foundUsername = await User.findOne({ username });
    const foundMail = await User.findOne({ email });
    if (foundUsername !== null && foundUsername._id.toString() !== userId) {
      res
        .status(500)
        .json({ errorMessage: "El usuario ya existe, prueba con otro nombre" });
      return;
    }
    if (foundMail !== null && foundMail._id.toString() !== userId) {
      res
        .status(500)
        .json({
          errorMessage:
            "El correo electronico ya existe, prueba con otro correo",
        });
      return;
    }
    const salt = await bcrypt.genSalt(12);
    const encryptedPassword = await bcrypt.hash(password, salt);
        await User.findByIdAndUpdate(userId,{
            username,
            email,
            password: encryptedPassword
        },
        {new: true})
        res.json("Usuario actualizado!")
    } catch (err) {
        next(err)
    }
})

router.put("/main",isAuthenticated, uploader.single("image"), async (req, res, next) => {
  
  try {
    const  userId  = req.payload._id
    const image = req.file;
    const currentImage = req.body.currentImage;
    console.log(currentImage);
    let imageUrl = currentImage;
    if (image) {
      imageUrl = image.path;
    }


    

    await User.findByIdAndUpdate(
      userId,
      { image: imageUrl },
      { new: true }
    );

    res.json({ imageUrl });
  } catch (err) {
    next(err);
  }
});






module.exports = router;