export const BASE_URL = 'https://auth.nomoreparties.co';

function requestResult(res) {
  if (res.ok) {
    return res.json();
  }

  return Promise.reject(`${res.status}`);
}

export const register = async (password, email) => {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password, email }),
  });
  return requestResult(res);
};

export const authorize = async (password, email) => {
  const res = await fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password, email }),
  });

  return requestResult(res).then((data) => {
    if (data) {
      localStorage.setItem('jwt', data.token);
      return data;
    }
  });
};

export const checkToken = async (token) => {
  const res = await fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return requestResult(res);
};
