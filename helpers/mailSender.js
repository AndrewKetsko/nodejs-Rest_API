const nodemailer = require("nodemailer");

const { EMAIL_PASS, SMTP_HOST, EMAIL_ADDR } = process.env;

const mailerConfig = {
  host: SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_ADDR,
    pass: EMAIL_PASS,
  },
};

const transport = nodemailer.createTransport(mailerConfig);

const mailSender = async (data) => {
  const mail = { ...data, from: "monicm82@meta.ua" };
  await transport.sendMail(mail);
  return true;
};

module.exports = mailSender;

// const mail = {
//   to: "monicm82@i.ua",
//   from: "monicm82@meta.ua",
//   subject: "some subject",
//   html: "<p>Test mail</p>",
// };

// transport
//   .sendMail(mail)
//   .then(() => console.log("send"))
//   .catch((err) => console.log(err.message));
