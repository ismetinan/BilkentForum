package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/google/uuid"
)

type deleteResponse struct {
	Message string `json:"message"`
}

// ✅ User silme (sadece admin)
func (cfg *apiConfig) handlerDeleteUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	// header’dan admin kontrolü (örnek, istersen JWT içinden kontrol et)
	isAdmin := r.Header.Get("X-Admin")
	if isAdmin != "true" {
		http.Error(w, "Unauthorized: admin required", http.StatusUnauthorized)
		return
	}

	userID := r.URL.Query().Get("id")
	if userID == "" {
		http.Error(w, "missing user id", http.StatusBadRequest)
		return
	}

	uid, err := uuid.Parse(userID)
	if err != nil {
		http.Error(w, "invalid user id", http.StatusBadRequest)
		return
	}

	err = cfg.DatabaseQueries.DeleteUser(r.Context(), uid)
	if err != nil {
		log.Println("DB error:", err)
		http.Error(w, "could not delete user", http.StatusInternalServerError)
		return
	}

	resp := deleteResponse{Message: "User deleted successfully"}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// ✅ Post silme (admin veya post sahibi)
func (cfg *apiConfig) handlerDeletePost(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	postID := r.URL.Query().Get("id")
	if postID == "" {
		http.Error(w, "missing post id", http.StatusBadRequest)
		return
	}

	pid, err := uuid.Parse(postID)
	if err != nil {
		http.Error(w, "invalid post id", http.StatusBadRequest)
		return
	}

	// TODO: Burada JWT’den userID çek, ya da header’dan (örnek)
	userID := r.Header.Get("X-User-ID")
	isAdmin := r.Header.Get("X-Admin")

	// Post sahibi mi veya admin mi?
	post, err := cfg.DatabaseQueries.GetPostByID(r.Context(), pid)
	if err != nil {
		http.Error(w, "post not found", http.StatusNotFound)
		return
	}

	if post.AuthorID.String() != userID && isAdmin != "true" {
		http.Error(w, "not authorized to delete this post", http.StatusUnauthorized)
		return
	}

	err = cfg.DatabaseQueries.DeletePost(r.Context(), pid)
	if err != nil {
		log.Println("DB error:", err)
		http.Error(w, "could not delete post", http.StatusInternalServerError)
		return
	}

	resp := deleteResponse{Message: "Post deleted successfully"}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
