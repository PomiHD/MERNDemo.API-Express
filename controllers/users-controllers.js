const HttpError = require("../models/http-error");
const User = require("../models/user");

const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Tom",
    email: "test1@test.com",
    password: "testers",
  },
];

const getUsers = (req, res, next) => {
  const users = DUMMY_USERS.map((user) => user.email);
  res.json({ users });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422),
    );
  }

  const { name, email, password, places } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500,
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422,
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password,
    image:
      "https://images3.memedroid.com/images/UPLOADED466/5ea63705d0f23.jpeg",
    places,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500,
    );
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422),
    );
  }

  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Login up failed, please try again later.",
      500,
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      422,
    );
    return next(error);
  }

  res.json({ message: "Logged in!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
