package main

import (
	"fmt"
	"net/http"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func main() {
	// This is the main entry point of the application.
	// You can initialize your application here.

	mux := http.NewServeMux()

	server := &http.Server{
		Addr:    ":8080",
		Handler: mux,
	}

	mux.HandleFunc("/api/healthz", checkHealth)

	fmt.Println("Starting server on http://localhost:8080")

	if err := server.ListenAndServe(); err != nil {
		fmt.Println("Listen and Serve error:", err)
	}

}

func checkHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Forum is safe and clear\n"))

	fmt.Println("Health check endpoint hit")
	fmt.Println("Server is healthy")

}
