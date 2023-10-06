require("dotenv").config();
// библиотеки
const express = require("express");
const mongoose = require("mongoose");
const { errors, celebrate, Joi } = require("celebrate");
// routes
const { userRouter } = require("./routes/users");
const { cardRouter } = require("./routes/cards");
// controllers
const { login, createUser } = require("./controllers/users");
// middlewares
const { requestLogger, errorLogger } = require("./middlewares/logger");
const auth = require("./middlewares/auth");
const error = require("./middlewares/error");
const cors = require("./middlewares/cors");
// utils
const { regExpUrl } = require("./utils/const");
// errors
const NotFoundError = require("./errors/NotFoundError");

const app = express();

// mongoose.connect("mongodb://localhost:27017/mestodb");
mongoose.connect(
  "mongodb+srv://admin:272832@admin.kfu0x9w.mongodb.net/movies?retryWrites=true&w=majority",
  () => {
    console.log("BD ok");
  }
);

const { PORT = 3000 } = process.env;

app.use(express.json());

app.use(cors);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Сервер сейчас упадёт");
  }, 0);
});

// Логгер запросов нужно подключить до всех обработчиков роутов:
app.use(requestLogger); // подключаем логгер запросов

app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login
);
app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(regExpUrl),
    }),
  }),
  createUser
);

app.use(auth); // авторизация

app.use("/users", userRouter);
app.use("/cards", cardRouter);

app.use("/", (_, res, next) => {
  next(new NotFoundError("Такой URL не найден"));
});

// errorLogger нужно подключить после обработчиков роутов и до обработчиков ошибок:
app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use(error); // мой обработчий ошибок

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("Server Ok");
});
