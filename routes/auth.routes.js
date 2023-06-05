const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require ("jsonwebtoken")
const isAuthenticated = require("../middlewares/isAuthenticated.js")
const { sendEmail } = require("../utils/emailService.js");

const User = require("../models/User.model");

const { passValidation, emailValidation } = require("../utils/verification.js");

// POST > /auth/signin sin params registers user
router.post("/signin", async (req, res, next) => {
  const { username, email, password } = req.body;
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
    if (foundUsername !== null) {
      res
        .status(500)
        .json({ errorMessage: "El usuario ya existe, prueba con otro nombre" });
      return;
    }
    if (foundMail !== null) {
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
    await User.create({
      username,
      email,
      password: encryptedPassword,
    });
    const subject = "Bienvenido a nuestra aplicación";
    const text = "Gracias por registrarte en nuestra aplicación. ¡Disfruta tu experiencia!";
    await sendEmail(email, subject, text);
    res.json("User created !");
  } catch (err) {
    next(err);
  }
});

// POST > /auth/login sin params validates user credentials
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // verificamos que el correo y la contraseña sean válidas
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      res
        .status(400)
        .json({ errorMessage: "Usuario no registrado con ese correo" });
      return;
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password
    );
    if (!isPasswordCorrect) {
      res.status(400).json({ errorMessage: "Contraseña incorrecta" });
      return;
    }
    // creamos un token y se lo enviamos al cliente
    const payload = {
        _id: foundUser._id,
        email: foundUser.email,
        role: foundUser.role
    }
    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, { algorithm: "HS256", expiresIn: "30d" })
    res.json({authToken})
  } catch (err) {
    next(err);
  }
});

// GET > /auth/verify sin params verifies if user is active
router.get("/verify", isAuthenticated, async (req,res,next)=> {
    res.json({ payload: req.payload })
})


module.exports = router;
