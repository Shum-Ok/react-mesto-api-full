const Card = require("../models/card");

// errors
const ValidationError = require("../errors/ValidationError"); // 400
const ForbiddenError = require("../errors/ForbiddenError"); // 403
const NotFoundError = require("../errors/NotFoundError"); // 404

// Создать карточку
const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;

    const card = await Card.create({ name, link, owner });
    await card.save();

    res.status(201).send(card);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new ValidationError("Одно из полей не заполнены корректно"));
    }
    return next(err);
  }
};

// Возвратить все карточки
const getCards = async (_, res, next) => {
  try {
    const cards = await Card.find({});

    res.status(200).send(cards);
  } catch (err) {
    next(err);
  }
};

// Удалить карточку
const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const owner = req.user._id;

    const card = await Card.findById(cardId);
    if (!card) {
      throw new NotFoundError("Карточка с таким ID не найдена");
    }
    if (!card.owner.equals(owner)) {
      return next(new ForbiddenError("Нельзя удалить чужую карточку"));
    }

    await Card.findByIdAndRemove(cardId);
    res.status(200).send({ message: "Карточка удалена" });
  } catch (err) {
    if (err.name === "CastError") {
      return next(new ValidationError("Не корректный ID карточки"));
    }
    return next(err);
  }
};

// Поставить лайк карточке
const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true }
    );
    if (!card) {
      throw new NotFoundError("Карточка с таким ID не найдена");
    }
    res.status(200).send(card);
  } catch (err) {
    if (err.name === "CastError") {
      return next(new ValidationError("Не корректный ID карточки"));
    }
    return next(err);
  }
};

// Убрать лайки с карточки
const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true }
    );
    if (!card) {
      throw new NotFoundError("Карточка с таким ID не найдена");
    }
    res.status(200).send(card);
  } catch (err) {
    if (err.name === "CastError") {
      return next(new ValidationError("Не корректный ID карточки"));
    }
    return next(err);
  }
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
