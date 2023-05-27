class Api {
  constructor(data) {
    this._baseUrl = data.serverUrl;
    this._headers = data.headers;
  }

  _requestResult(res) {
    if (res.ok) {
      return res.json();
    }

    return Promise.reject(`Ошибка: ${res.status}`);
  }

  async getInitialCards() {
    const res = await fetch(`${this._baseUrl}cards`, {
      headers: this._headers,
    });
    return this._requestResult(res);
  }

  async getInitialUser() {
    const res = await fetch(`${this._baseUrl}users/me`, {
      headers: this._headers,
    });
    return this._requestResult(res);
  }

  async editUser(data) {
    const res = await fetch(`${this._baseUrl}users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      }),
    });
    return this._requestResult(res);
  }

  async editUserAvatar(data) {
    const res = await fetch(`${this._baseUrl}users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    });
    return this._requestResult(res);
  }

  async postCard(data) {
    const res = await fetch(`${this._baseUrl}cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    });
    return this._requestResult(res);
  }

  async deleteCard(cardId) {
    const res = await fetch(`${this._baseUrl}cards/${cardId}`, {
      method: 'DELETE',
      headers: this._headers,
    });
    return this._requestResult(res);
  }

  async changeLikeCardStatus(cardId, isLiked) {
    if (isLiked) {
      const res = await fetch(`${this._baseUrl}cards/${cardId}/likes`, {
        method: 'PUT',
        headers: this._headers,
      });
      return this._requestResult(res);
    } else {
      const res = await fetch(`${this._baseUrl}cards/${cardId}/likes`, {
        method: 'DELETE',
        headers: this._headers,
      });
      return this._requestResult(res);
    }
  }
}

export const api = new Api({
  serverUrl: 'https://mesto.nomoreparties.co/v1/cohort-60/',
  headers: {
    authorization: '6a189007-b75f-4743-b5a0-635bc162974c',
    'Content-Type': 'application/json',
  },
});
