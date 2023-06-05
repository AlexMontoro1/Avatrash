const nodemailer = require("nodemailer");

// funcion para obtener la configuración del transportador de correo electrónico según el proveedor de correo electrónico del usuario
const getTransporterConfig = (user) => {
  if (user.emailProvider === "gmail") {
    return {
      service: "gmail",
      auth: {
        user: user.email,
        pass: user.emailPassword,
      },
    };
  } else if (user.emailProvider === "outlook") {
    return {
      service: "hotmail",
      auth: {
        user: user.email,
        pass: user.emailPassword,
      },
    };
  } else if (user.emailProvider === "yahoo") {
    return {
      service: "yahoo",
      auth: {
        user: user.email,
        pass: user.emailPassword,
      },
    }
  
}else{
    throw new Error("Proveedor de correo electrónico no admitido");
}
}

// funcion para enviar un correo electronico
const sendEmail = async (to, subject, text, user) => {
  try {
    const transporterConfig = getTransporterConfig(user);
    const transporter = nodemailer.createTransport(transporterConfig);

    const mailOptions = {
      from: user.email,
      to,
      subject,
      text
    };

    // envio del correo electronico
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo electrónico enviado:", info.response);
  } catch (error) {
    console.error("Error al enviar el correo electrónico:", error);
  }
};

module.exports = { sendEmail };
