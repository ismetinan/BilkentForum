package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/ismetinan/BilkentForum/internal/database"
	"github.com/ismetinan/BilkentForum/internal/email"
)

type VerificationRequest struct {
	Email string `json:"email"`
}

type VerificationResponse struct {
	Message string `json:"message"`
}

type VerifyCodeRequest struct {
	Email string `json:"email"`
	Code  string `json:"code"`
}

func IsAllowedEmail(email string) bool {
	allowedDomains := []string{"ug.bilkent.edu.tr"}
	for _, domain := range allowedDomains {
		if strings.HasSuffix(strings.ToLower(email), "@"+domain) {
			return true
		}
	}
	return false
}

func (cfg *apiConfig) handlerVerification(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req VerificationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Email == "" {
		http.Error(w, "Email is required", http.StatusBadRequest)
		return
	}

	if !IsAllowedEmail(req.Email) {
		http.Error(w, "Only Bilkent emails are allowed", http.StatusForbidden)
		return
	}

	code, err := email.SendVerificationEmail(req.Email)
	if err != nil {
		http.Error(w, "Failed to send verification email", http.StatusInternalServerError)
		return
	}

	ctx := r.Context()
	err = cfg.DatabaseQueries.InsertVerificationCode(ctx, database.InsertVerificationCodeParams{
		Email: req.Email,
		Code:  code,
	})
	if err != nil {
		http.Error(w, "Failed to store verification code", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "Verification email sent successfully"})
	log.Printf("Verification email sent to %s", req.Email)
}

func (cfg *apiConfig) handlerVerifyCode(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req VerifyCodeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	ctx := r.Context()
	storedCode, err := cfg.DatabaseQueries.GetVerificationCode(ctx, req.Email)
	if err != nil {
		http.Error(w, "No verification request found", http.StatusNotFound)
		return
	}

	if storedCode != req.Code {
		http.Error(w, "Invalid verification code", http.StatusUnauthorized)
		return
	}

	err = cfg.DatabaseQueries.MarkEmailVerified(ctx, req.Email)
	if err != nil {
		http.Error(w, "Failed to update verification status", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "Email verified successfully"})
}
