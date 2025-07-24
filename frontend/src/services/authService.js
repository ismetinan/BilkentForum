const API_URL = 'http://localhost:8080';

export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // send cookies
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error('Login failed');
  return res.json();
};

export const register = async (email, password) => {
  const res = await fetch(`${API_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error('Register failed');
  return res.json();
};

export const refresh = async () => {
  const res = await fetch(`${API_URL}/api/refresh`, {
    method: 'POST',
    credentials: 'include', // send cookies
  });

  if (!res.ok) throw new Error('Refresh failed');
  return res.json();
};

export const logout = async () => {
  const res = await fetch(`${API_URL}/api/revoke`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Logout failed');
};
