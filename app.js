const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://curriculum-vitae-stambouli-amine.netlify.app");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// const rateLimit = require("express-rate-limit");

// const limiter = rateLimit({
//   windowMs: 3 * 60 * 1000,
//   max: 30, // per IP
// });

app.use(limiter);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.post("/send-email", (req, res, next) => {
  const output = `
      <p>Vous avez un nouveau message</p>
      <h3>Détails du contact</h3>
      <ul>
         <li>Nom : ${req.body.firstName}</li>
         <li>Prénom : ${req.body.lastName}</li>
         <li>E-mail: ${req.body.email}</li>
      </ul>
      <h3>Message :</h3>
      <p>${req.body.message}</p>
  `;
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    port: 465,
    secure: true, 
    auth: {
      user: process.env.EMAIL, 
      pass: process.env.PASSWORD,
    },
  });

  let info = transporter.sendMail({
    from: req.body.email, 
    to: process.env.EMAIL,
    firstName: req.body.firstName, 
    lastName: req.body.lastName,
    email: req.body.email, 
    message: req.body.message, 
    html: output, 
  }, (err) => {
    if(err){
      console.log("il ya eu une erreur dans l'envois du mail")
    }
    res.send("Email a été envoyé avec succés")
  });
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
})




app.listen(PORT, (err) => {
  if (err) {
    throw new Error("Something bad happened...");
  }
  console.log(`Server is listening on ${PORT}`)
})