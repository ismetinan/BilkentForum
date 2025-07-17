package cmd

import (
	"fmt"
	"net/http"
)

func checkHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Forum is safe and clear\n"))

	fmt.Println("Health check endpoint hit")
	fmt.Println("Server is healthy")

}
