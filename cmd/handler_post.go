package main

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/ismetinan/BilkentForum/internal/database"
)

type CreatePostRequest struct {
	CourseID string `json:"course_id"`
	Topic    string `json:"topic"`
}

// inside apiConfig.go or wherever you keep your handlers
func (cfg *apiConfig) handlerCreatePost(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		CourseID string `json:"course_id"`
		Topic    string `json:"topic"`
	}

	var params parameters
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if params.CourseID == "" || params.Topic == "" {
		http.Error(w, "course_id and topic required", http.StatusBadRequest)
		return
	}

	authorID := uuid.New().String() // TODO: extract from JWT
	postID := uuid.New().String()
	now := time.Now()

	post, err := cfg.DatabaseQueries.CreatePost(r.Context(), database.CreatePostParams{
		ID:        postID,
		AuthorID:  authorID,
		CourseID:  params.CourseID,
		Topic:     params.Topic,
		CreatedAt: now,
		UpdatedAt: now,
	})
	if err != nil {
		http.Error(w, "database error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(post)
}
