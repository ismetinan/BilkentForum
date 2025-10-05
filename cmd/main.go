package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
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
	S3BucketName    string
	s3Client        *s3.Client
	jwtSecret       string
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

	cfgAWS, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion("eu-central-1"))
	if err != nil {
		log.Fatal(err)
	}

	s3Client := s3.NewFromConfig(cfgAWS)

	apiConfig := &apiConfig{
		DatabaseQueries: database.New(db),
		jwtSecret:       jwtSecret,
		S3BucketName:    os.Getenv("BUCKET_NAME"),
		s3Client:        s3Client,
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
	mux.HandleFunc("GET /api/validate", apiConfig.handlerValidate)
	mux.Handle("/api/posts/list", apiConfig.jwtMiddleware(http.HandlerFunc(apiConfig.handlerListPosts)))
	mux.Handle("/api/posts", apiConfig.jwtMiddleware(http.HandlerFunc(apiConfig.handlerPostsCreate)))

	//mux.HandleFunc("POST /api/refresh", apiConfig.handlerRefresh)
	//mux.HandleFunc("POST /api/revoke", apiConfig.handlerRevoke)

	fmt.Println("Starting server on http://localhost:8080")

	if err := server.ListenAndServe(); err != nil {
		fmt.Println("Listen and Serve error:", err)
	}

}
