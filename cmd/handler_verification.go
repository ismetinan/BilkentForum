package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/ismetinan/BilkentForum/internal/email"
)

type VerificationRequest struct {
	Email string `json:"email"`
}

type VerificationResponse struct {
	Message string `json:"message"`
}

func (cfg *apiConfig) handlerVerification(w http.ResponseWriter, r *http.Request) {
	// Only allow POST
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

	// Send the verification email
	_, err := email.SendVerificationEmail(req.Email)
	if err != nil {
		http.Error(w, "Failed to send verification email", http.StatusInternalServerError)
		return
	}

	// Respond to client
	resp := VerificationResponse{
		Message: "Verification email sent successfully",
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)

	log.Printf("Verification email sent to %s", req.Email)
}
