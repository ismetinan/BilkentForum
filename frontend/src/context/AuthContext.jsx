import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("accessToken", newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("accessToken");
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");
    if (!savedToken) {
      setLoading(false);
      return;
    }

    // ✅ önce validate et
    fetch("http://localhost:8080/api/validate", {
      headers: { Authorization: `Bearer ${savedToken}` },
    })
      .then((res) => {
        if (res.ok) {
          setToken(savedToken); // token geçerli
        } else {
          // ✅ geçersizse refresh dene
          return fetch("http://localhost:8080/api/refresh", {
            method: "POST",
            credentials: "include", // refresh cookie gönderilir
          })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
              if (data?.token) {
                login(data.token);
              } else {
                logout();
              }
            });
        }
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
