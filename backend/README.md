[![Tests](https://github.com/Shum-Ok/express-mesto-gha/actions/workflows/tests-13-sprint.yml/badge.svg)](https://github.com/Shum-Ok/express-mesto-gha/actions/workflows/tests-13-sprint.yml) [![Tests](https://github.com/Shum-Ok/express-mesto-gha/actions/workflows/tests-14-sprint.yml/badge.svg)](https://github.com/Shum-Ok/express-mesto-gha/actions/workflows/tests-14-sprint.yml)

# Проект Mesto - backend

## Описание

Проектная работа по реализации frontend и backend.
В данном приложении реализованна регистрация/авторизация пользователя. Так же реализованна система карточек у которых есть название(имя), адрес на картинку и изменяемое количество лайков.

## Роуты

### Пользователь

- `/signup` - регистрация пользователя

```json
{
  "email": "my@email.ru",
  "password": "secret-pass"
}
```

- `/signin` - авторизация пользователя

```json
{
  "email": "my@email.ru",
  "password": "secret-pass"
}
```

- `GET` `/users` - получение зарегистрированных пользователей
- `GET` `/users/me` - получение своих данных
- `PATCH` `/users/me` - изменение своих данных

```json
{
  "name": "New Name",
  "about": "New text about"
}
```

- `PATCH` `/users/me/avatar` - изменения url адреса на картинку аватара

```json
{
  "avatar": "https://newurl.ru/avatar.jpg"
}
```

### Карточки

- `GET` `/cards` - получение всех созданных карточек
- `POST` `/cards` - создание карточки

```json
{
  "name": "Название",
  "link": "https://site.ru/image.jpg"
}
```

- `POST` `/cards/:cardId` - удаление карточки по её id
- `PUT` `/cards/:cardId/likes` - поставить лайк карточке
- `DELETE` `/cards/:cardId/likes` - удалить лайк у карточки

## Технологии

Backend написан с технологиями и библиотеками npm

- MongoDB - для хранения данных о пользователе и карточках
- `mongoose` - для связи базы данных с приложением
- `express` - минималистичный веб-фреймворк для приложений Node.js
- `celebrate` - для валидации отправляемых данных с клиентской части
- `bcrypt` - для хеширования пароля пользователей
- `jsonwebtoken` - для создания токенов

## Директории

`/routes` — папка с файлами роутера
`/controllers` — папка с файлами контроллеров пользователя и карточки
`/models` — папка с файлами описания схем пользователя и карточки

Остальные директории вспомогательные, создаются при необходимости разработчиком

## Запуск проекта

`npm run start` — запускает сервер
`npm run dev` — запускает сервер с hot-reload
