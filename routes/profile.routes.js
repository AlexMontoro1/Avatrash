const User = require("../models/User.model");
const { passValidation, emailValidation } = require("../utils/verification.js");
const bcrypt = require("bcryptjs");
const router = require("express").Router();
const isAuthenticated = require("../middlewares/isAuthenticated.js")

// GET "/profile/main" gets the user profile

router.get("/main", isAuthenticated, async (req,res,next)=> {
    try {
        const response = await User.find().select({username: 1, email: 1})
        res.json(response)
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






module.exports = router;