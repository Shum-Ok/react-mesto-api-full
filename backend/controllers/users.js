const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const { JWT_SECRET, NODE_ENV } = process.env;

// errors
const ValidationError = require("../errors/ValidationError"); // 400
const UnauthorizedError = require("../errors/UnauthorizedError"); // 401
const NotFoundError = require("../errors/NotFoundError"); // 404
const ConflictError = require("../errors/ConflictError"); // 409

const MONGO_DUPLICATE_KEY_CODE = 11000;

// salt
const saltRounds = 10;

// Регистрация пользователя
const createUser = async (req, res, next) => {
  try {
    const { email, password, name, about, avatar } = req.body;

    const passHash = await bcrypt.hash(password, saltRounds);
    const doc = await User.create({
      email,
      password: passHash,
      name,
      about,
      avatar,
    });

    // сохраняем документ в базеданных
    await doc.save();

    res.status(201).json({
      email: doc.email,
      name: doc.name,
      about: doc.about,
      avatar: doc.avatar,
    });
  } catch (err) {
    if (err.code === MONGO_DUPLICATE_KEY_CODE) {
      next(new ConflictError(`Емайл ${err.keyValue.email} уже занят`));
    }
    next(err);
  }
};

// авторизация пользователя
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign(
      { _id: user._id },
      `${NODE_ENV === "production" ? JWT_SECRET : "dev-secret"}`,
      { expiresIn: "7d" }
    ); // создали токен

    res.status(200).send({ token });
  } catch (err) {
    console.log(err);
    next(new UnauthorizedError("Неверные логин или пароль"));
  }
};

// Вернуть одного юзера GET
const getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError("Пользователь с таким ID не найден");
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.name === "CastError") {
      return next(new ValidationError("Не корректный ID пользователя"));
    }
    return next(err);
  }
};

// Вернуть всех юзеров GET
const getUsers = async (_, res, next) => {
  try {
    const users = await User.find({});
    console.log(users);
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

// Получить свои данные
const getUserMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

// Обновить профиль Юзера PATCH
const patchUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        about,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

// Обновить аватар Юзера PATCH
const patchUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true }
    );
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  patchUser,
  patchUserAvatar,
  login,
  getUserMe,
};
