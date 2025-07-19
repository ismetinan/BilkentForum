package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"

	"github.com/ismetinan/BilkentForum/internal/database"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
type apiConfig struct {
	DatabaseQueries *database.Queries
}

func main() {
	// This is the main entry point of the application.
	// You can initialize your application here.
	godotenv.Load()
	dbURL := os.Getenv("DB_URL")

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		fmt.Println("Error opening database:", err)
		return
	}
	defer db.Close()
	apiConfig := &apiConfig{
		DatabaseQueries: database.New(db),
	}
	fmt.Println("Database connection established")
	fmt.Println("Starting the Bilkent Forum API...")
	fmt.Println(apiConfig.DatabaseQueries)
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
