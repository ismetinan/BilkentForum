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

type Post struct {
	ID        string    `json:"id"`
	AuthorID  string    `json:"author_id"`
	CourseID  string    `json:"course_id"`
	Topic     string    `json:"topic"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
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

	// apiConfigin bulundurduğu DatabaseQueries bize direkt olarak database'e sorgu göndermeye ve yanıt almaya yarar

	fmt.Println("Database connection established")
	fmt.Println("Starting the Bilkent Forum API...")

	mux := http.NewServeMux()
	server := &http.Server{
		Addr:    ":8080",
		Handler: withCORS(mux),
	}

	mux.Handle("/", http.FileServer(http.Dir(".")))

	mux.HandleFunc("GET /api/healthz", checkHealth)
	mux.HandleFunc("POST /api/users", apiConfig.handlerUsersCreate)
	mux.HandleFunc("POST /api/login", apiConfig.handlerLogin)
	//mux.HandleFunc("POST /api/refresh", apiConfig.handlerRefresh)
	//mux.HandleFunc("POST /api/revoke", apiConfig.handlerRevoke)
	mux.HandleFunc("GET /api/validate", apiConfig.handlerValidate)

	fmt.Println("Starting server on http://localhost:8080")

	if err := server.ListenAndServe(); err != nil {
		fmt.Println("Listen and Serve error:", err)
	}

}
