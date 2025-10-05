package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"time"

	"github.com/ismetinan/BilkentForum/internal/auth"
	"github.com/ismetinan/BilkentForum/internal/database"
)

func (cfg *apiConfig) handlerUsersCreate(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Password string `json:"password"`
		Email    string `json:"email"`
	}
	type response struct {
		database.User
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Couldn't decode parameters", err)
		return
	}

	// şifreyi hashle
	hashedPassword, err := auth.HashPassword(params.Password)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't hash password", err)
		return
	}

	// rastgele 6 haneli doğrulama kodu üret
	verificationCode := fmt.Sprintf("%06d", rand.Intn(1000000))
	expiry := time.Now().Add(15 * time.Minute)

	// veritabanına kaydet
	user, err := cfg.DatabaseQueries.CreateUser(r.Context(), database.CreateUserParams{
		Email:               params.Email,
		HashedPassword:      hashedPassword,
		VerificationCode:    sql.NullString{String: verificationCode, Valid: true},
		VerificationExpires: sql.NullTime{Time: expiry, Valid: true},
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't create user", err)
		return
	}

	respondWithJSON(w, http.StatusCreated, response{
		User: database.User{
			ID:        user.ID,
			CreatedAt: user.CreatedAt,
			UpdatedAt: user.UpdatedAt,
			Email:     user.Email,
			// güvenlik için verification_code’u dönme
		},
	})
	fmt.Println("User created:", user.Email, "code:", verificationCode)
}
