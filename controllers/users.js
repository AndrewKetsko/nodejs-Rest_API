const { ctrlsWrapper } = require("../helpers");
const crypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_STRING } = process.env;
// const JWT_STRING = "2M6vwnlAxDyBdJBCJYYYv0q";

const registerUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    res.status(409).json("Email in use");
  } else {
    const hashPassword = await crypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashPassword });
    console.log(newUser);
    res
      .status(201)
      .json({ user: { email, subscribtion: newUser.subscribtion } });
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json("Email or password is wrong");
  } else {
    const comparePassword = await crypt.compare(password, user.password);
    if (!comparePassword) {
      res.status(401).json("Email or password is wrong");
    } else {
      const token = jwt.sign({ id: user._id }, JWT_STRING, { expiresIn: "1d" });
      await User.findByIdAndUpdate(user._id, { token });
      res
        .status(201)
        .json({ token, user: { email, subscribtion: user.subscribtion } });
    }
  }
};

const logoutUser = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { token: "" });
  res.status(204).json();
};

const currentUser = async (req, res, next) => {
  res
    .status(200)
    .json({ email: req.user.email, subscribtion: req.user.subscribtion });
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
    res.status(404).json({ message: "Not found" });
  } else {
    res.status(200).json(result);
  }
};

module.exports = {
  registerUser: ctrlsWrapper(registerUser),
  loginUser: ctrlsWrapper(loginUser),
  logoutUser: ctrlsWrapper(logoutUser),
  currentUser: ctrlsWrapper(currentUser),
  setSubscription: ctrlsWrapper(setSubscription),
};
