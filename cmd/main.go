package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/google/uuid"
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
	jwtSecret       string
}
type User struct {
	ID             uuid.UUID
	CreatedAt      time.Time
	UpdatedAt      time.Time
	Email          string
	HashedPassword string
}

func main() {
	// This is the main entry point of the application.
	// You can initialize your application here.
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dbURL := os.Getenv("DB_URL")
	fmt.Println()
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("JWT_SECRET environment variable is not set")
	}
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		fmt.Println("Error opening database:", err)
		return
	}
	defer db.Close()
	apiConfig := &apiConfig{
		DatabaseQueries: database.New(db),
		jwtSecret:       jwtSecret,
	}
	fmt.Println("Database connection established")
	fmt.Println("Starting the Bilkent Forum API...")
	fmt.Println(apiConfig.DatabaseQueries)
	mux := http.NewServeMux()
	server := &http.Server{
		Addr:    ":8080",
		Handler: withCORS(mux),
	}

	mux.Handle("/", http.FileServer(http.Dir(".")))

	mux.HandleFunc("GET /api/healthz", checkHealth)
	mux.HandleFunc("POST /api/users", apiConfig.handlerUsersCreate)
	mux.HandleFunc("POST /api/login", apiConfig.handlerLogin)
	mux.HandleFunc("POST /api/refresh", apiConfig.handlerRefresh)
	mux.HandleFunc("POST /api/revoke", apiConfig.handlerRevoke)

	fmt.Println("Starting server on http://localhost:8080")

	if err := server.ListenAndServe(); err != nil {
		fmt.Println("Listen and Serve error:", err)
	}

}
