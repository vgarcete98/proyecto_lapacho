const nodemailer = require("nodemailer");


const pass_email_tronco = process.env.P4SS_3M4IL;
const acount = process.env.T3ST_M4IL_CU3NT4;

const transporter = nodemailer.createTransport({
  service : "gmail",
  auth: {
    user: acount,
    pass: pass_email_tronco,
  },
});


async function sendMail( email_socio = "", cuerpo_email = "" ) {

  try {
    
    
    const info = await transporter.sendMail({
      from: `'"Club lapacho de Tenis de Mesa 🏓" <${process.env.T3ST_M4IL_CU3NT4}>'`, // sender address
      to: email_socio, // list of receivers
      subject: "Envio de credenciales para proyecto Tronco", // Subject line
      text: `${ cuerpo_email }`, // plain text body
      html: `<b> ${ cuerpo_email } </b>`, // html body
    });
    
    console.log("Envio de contraseñas logrado: %s", info.messageId);
  } catch (error) {
    console.log( `No se logro enviar el correo ${ error }` );
  }


}


module.exports = { sendMail };
