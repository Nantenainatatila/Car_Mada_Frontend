// Toutes les communications avec le backend passent par ce fichier.
// Exemple : api.get('/cars')  ->  GET http://localhost:5000/api/cars

const TOKEN_KEY = 'token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

async function request(method, url, body) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let contenu;
  if (body instanceof FormData) {
    contenu = body; // formulaire avec image : le navigateur gère l'en-tête tout seul
  } else if (body) {
    headers['Content-Type'] = 'application/json';
    contenu = JSON.stringify(body);
  }

  const reponse = await fetch(`/api${url}`, { method, headers, body: contenu });
  const data = await reponse.json().catch(() => ({}));

  if (!reponse.ok) {
    throw new Error(data.message || 'Une erreur est survenue');
  }
  return data;
}

export const api = {
  get: (url) => request('GET', url),
  post: (url, body) => request('POST', url, body),
  put: (url, body) => request('PUT', url, body),
  patch: (url, body) => request('PATCH', url, body),
  del: (url) => request('DELETE', url),
};
