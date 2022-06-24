class Api {
    constructor({ url, headers }) {  // передаем url API и заголовок
      this._url = url
      this._headers = headers
    }

    getAllData() {
      return Promise.all([this.getInitialCards(), this.getUser()])
    }

    _getHeaders() {
      const token = localStorage.getItem('token');
      return {
        'Authorization': `Bearer ${token}`,
        ...this._headers,
      };
    }

    getUser() { // загружаем имя пользователя
      return fetch(
        `${this._url}users/me`,
        {
          headers: this._getHeaders(),
        }
      )
        .then(onError)
    }

    setUserInfo(name, about) { // запрос на изменение данных пользователя метод PATCH
      return fetch(
        `${this._url}users/me`,
        {
          method: 'PATCH',
          headers: this._getHeaders(),
          body: JSON.stringify({
            name,
            about,
          })
        })
        .then(onError)
    }

    getInitialCards() { // получить карточки метотд GET
      return fetch(
        `${this._url}cards`,
        {
          headers: this._getHeaders(),
        }
      )
        .then(onError)
    }

    createCard(card) { // создать карточку метотд POST
      return fetch(
        `${this._url}cards`,
        {
          method: 'POST',
          headers: this._getHeaders(),
          body: JSON.stringify({
            name: card.name,
            link: card.link,
          })
        })
        .then(onError)
    }

    deleteCard(id) { // удалить карточку метотд DELETE
      return fetch(
        `${this._url}cards/${id}`,
        { 
          method: 'DELETE',
          headers: this._getHeaders(),
        })
        .then(onError)
    }

    changeLikeCardStatus(id, isLiked) { // добавить лайк метотд PUT
      return fetch(
        `${this._url}cards/${id}/likes`,
        {
          method: isLiked ? 'DELETE' : 'PUT',
          headers: this._getHeaders(),
        })
        .then(onError)
    }

    setUserAvatar(avatar) { // запрос на изменение аватара пользователя, метод PATCH
      return fetch(
        `${this._url}users/me/avatar`,
        {
          method: 'PATCH',
          headers: this._getHeaders(),
          body: JSON.stringify({
            avatar
          }),
        })
        .then(onError)
    }
}

const onError = res => {
  if (res.ok) {
    return res.json()
  }
  return Promise.reject(`Произошла ошибка ${res.status} ${res.statusText}`)
}

const api = new Api({
  url: 'https://api.zubkov.nomoredomains.xyz/',
  headers: {
    'Content-Type': 'application/json',
  }
})

export default api