package main

import (
	"fmt"
	"net/http"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
type apiConfig struct {
	Port string
}

func main() {
	// This is the main entry point of the application.
	// You can initialize your application here.

	mux := http.NewServeMux()

	server := &http.Server{
		Addr:    ":8080",
		Handler: mux,
	}

	mux.Handle("/", http.FileServer(http.Dir(".")))

	mux.HandleFunc("/api/healthz", checkHealth)

	fmt.Println("Starting server on http://localhost:8080")

	if err := server.ListenAndServe(); err != nil {
		fmt.Println("Listen and Serve error:", err)
	}

}
