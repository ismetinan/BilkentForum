package main

import (
	"net/http"

	"github.com/ismetinan/BilkentForum/internal/auth"
)

func (cfg *apiConfig) handlerValidate(w http.ResponseWriter, r *http.Request) {
	token, err := auth.GetBearerToken(r.Header)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Missing token", err)
		return
	}

	_, err = auth.ValidateJWT(token, cfg.jwtSecret)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Invalid token", err)
		return
	}

	w.WriteHeader(http.StatusOK)
}
