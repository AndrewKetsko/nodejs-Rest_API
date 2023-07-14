const { ctrlsWrapper, newError, mailSender } = require("../helpers");
const crypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const User = require("../models/User");
const { use } = require("../routes/api/users");
const { JWT_STRING, APP_HOST } = process.env;

const avatarsFolder = path.join(__dirname, "..", "public", "avatars");

const registerUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    next(newError(409, "Email in use"));
  }
  const hashPassword = await crypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = await crypt.hash(email, 10);
  const newUser = await User.create({
    email,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });
  const verMail = {
    to: email,
    subject: "Verify Email",
    html: `<a target="_blanc" href="${APP_HOST}/users/verify/${verificationToken}">Click to verify</a>`,
  };
  // await mailSender(verMail);
  res.status(201).json({ user: { email, subscription: newUser.subscription } });
};

const verifyMail = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    next(newError(404, "User not found"));
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  res.status(200).json({ message: "Verification successful" });
};

const resendVerifyMail = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    next(newError(401, "Email or password is wrong"));
  }
  if (user.verify) {
    next(newError(400, "Verification has already been passed"));
  }
  const verMail = {
    to: email,
    subject: "Verify Email",
    html: `<a target="_blanc" href="${APP_HOST}/users/verify/${user.verificationToken}">Click to verify</a>`,
  };
  // await mailSender(verMail);
  res.status(200).json({ message: "Verification email sent" });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    next(newError(401, "Email or password is wrong"));
  }
  if (!user.verify) {
    next(newError(409, "Verify your mail first, please"));
  }
  const comparePassword = await crypt.compare(password, user.password);
  if (!comparePassword) {
    next(newError(401, "Email or password is wrong"));
  }
  const token = jwt.sign({ id: user._id }, JWT_STRING, { expiresIn: "1d" });
  await User.findByIdAndUpdate(user._id, { token });
  res
    .status(200)
    .json({ token, user: { email, subscription: user.subscription } });
};

const logoutUser = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { token: "" });
  res.status(204).json();
};

const currentUser = async (req, res, next) => {
  res
    .status(200)
    .json({ email: req.user.email, subscription: req.user.subscription });
};

const setSubscription = async (req, res, next) => {
  const { subscription, id } = req.body;
  console.log(id, subscription);
  const result = await User.findByIdAndUpdate(
    id,
    { subscription },
    { new: true, select: "email subscription" }
  );
  if (!result) {
    next(newError(404, "Not found"));
  }
  res.status(200).json(result);
};

const updateAvatar = async (req, res, next) => {
  const { _id } = req.user;
  const { path: tempPath, originalname } = req.file;
  Jimp.read(tempPath)
    .then((img) => img.resize(250, 250).write(resultPath))
    .catch((err) => console.log(err.message));
  const fileName = `${_id}${originalname}`;
  const resultPath = path.join(avatarsFolder, fileName);
  await fs.rename(tempPath, resultPath);
  const avatarURL = path.join("avatars", fileName);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.status(200).json({ avatarURL });
};

module.exports = {
  registerUser: ctrlsWrapper(registerUser),
  loginUser: ctrlsWrapper(loginUser),
  logoutUser: ctrlsWrapper(logoutUser),
  currentUser: ctrlsWrapper(currentUser),
  setSubscription: ctrlsWrapper(setSubscription),
  updateAvatar: ctrlsWrapper(updateAvatar),
  verifyMail: ctrlsWrapper(verifyMail),
  resendVerifyMail: ctrlsWrapper(resendVerifyMail),
};
