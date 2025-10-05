package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"mime/multipart"
	"net/http"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
	"github.com/google/uuid"
	"github.com/ismetinan/BilkentForum/internal/database"
)

type respAttachment struct {
	ID       uuid.UUID `json:"id"`
	FileUrl  string    `json:"url"`
	FileName string    `json:"file_name"`
	MimeType string    `json:"mime_type"`
	FileSize int64     `json:"file_size"`
}

type response struct {
	ID          uuid.UUID        `json:"id"`
	AuthorID    string           `json:"author_id"`
	CourseID    string           `json:"course_id"`
	Topic       string           `json:"topic"`
	CreatedAt   time.Time        `json:"created_at"`
	UpdatedAt   time.Time        `json:"updated_at"`
	Attachments []respAttachment `json:"attachments"`
}

func (cfg *apiConfig) uploadToS3(file multipart.File, key, contentType string) (string, error) {
	_, err := cfg.s3Client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket:      aws.String(cfg.S3BucketName),
		Key:         aws.String(key),
		Body:        file,
		ContentType: aws.String(contentType),
		ACL:         types.ObjectCannedACLPrivate,
	})
	if err != nil {
		return "", err
	}

	// public URL sadece test için, ACL PublicRead değilse erişim token gerekir
	url := fmt.Sprintf("https://%s.s3.amazonaws.com/%s", cfg.S3BucketName, key)
	fmt.Println("Uploaded to S3:", url)
	return url, nil
}

func (cfg *apiConfig) handlerListPosts(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	courseID := r.URL.Query().Get("course_id")
	if courseID == "" {
		http.Error(w, "missing course_id", http.StatusBadRequest)
		return
	}

	posts, err := cfg.DatabaseQueries.ListPostsByCourse(r.Context(), courseID)
	if err != nil {
		log.Println("DB error:", err)
		http.Error(w, "could not fetch posts", http.StatusInternalServerError)
		return
	}
	if posts == nil {
		posts = []database.ListPostsByCourseRow{}
	}

	var respPosts []response
	for _, post := range posts {
		var attachments []respAttachment
		if post.Attachments != nil {
			data, ok := post.Attachments.([]byte) // JSONB aslında []byte gelir
			if !ok {
				log.Println("Attachments type assertion failed")
			} else {
				if err := json.Unmarshal(data, &attachments); err != nil {
					log.Println("Failed to unmarshal attachments:", err)
				}
			}
		}

		respPosts = append(respPosts, response{
			ID:          post.ID,
			AuthorID:    post.AuthorID.String(),
			CourseID:    post.CourseID,
			Topic:       post.Topic,
			CreatedAt:   post.CreatedAt.Time,
			UpdatedAt:   post.UpdatedAt.Time,
			Attachments: attachments,
		})
	}

	// JSON yanıtı oluştur ve gönder
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(respPosts); err != nil {
		log.Println("JSON encode error:", err)
		http.Error(w, "failed to encode posts", http.StatusInternalServerError)
		return
	}
}

func (cfg *apiConfig) handlerPostsCreate(w http.ResponseWriter, r *http.Request) {
	// Multipart form parse
	if err := r.ParseMultipartForm(20 << 20); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid form data", err)
		return
	}

	courseID := r.FormValue("course_id")
	topic := r.FormValue("topic")
	authorID, ok := r.Context().Value(userIDKey).(uuid.UUID)
	if !ok {
		respondWithError(w, http.StatusUnauthorized, "user not found in context", nil)
		return
	}

	if courseID == "" || topic == "" {
		respondWithError(w, http.StatusBadRequest, "Missing course_id or topic", nil)
		return
	}

	// Post DB insert
	post, err := cfg.DatabaseQueries.CreatePost(r.Context(), database.CreatePostParams{
		AuthorID: authorID,
		CourseID: courseID,
		Topic:    topic,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't create post", err)
		return
	}
	// Parse form, maxMemory ile sınır koy
	if err := r.ParseMultipartForm(32 << 20); err != nil { // 32 MB
		http.Error(w, "failed to parse multipart form", http.StatusBadRequest)
		return
	}

	attachments := []database.Attachment{}
	files := r.MultipartForm.File["attachments[]"]
	for _, fh := range files {
		file, err := fh.Open()
		if err != nil {
			continue
		}
		defer file.Close()

		mimeType := fh.Header.Get("Content-Type")
		if mimeType != "application/pdf" {
			continue
		}

		key := fmt.Sprintf("%s/%s/%s", courseID, post.ID.String(), fh.Filename)
		url, err := cfg.uploadToS3(file, key, mimeType)
		if err != nil {
			continue
		}

		att, err := cfg.DatabaseQueries.CreateAttachment(r.Context(), database.CreateAttachmentParams{
			PostID:   post.ID,
			FileUrl:  url,
			FileName: sql.NullString{String: fh.Filename, Valid: true},
			MimeType: sql.NullString{String: mimeType, Valid: true},
			FileSize: sql.NullInt64{Int64: fh.Size, Valid: true},
		})
		if err == nil {
			attachments = append(attachments, database.Attachment{
				ID:        att.ID,
				FileUrl:   att.FileUrl,
				FileName:  att.FileName,
				MimeType:  att.MimeType,
				FileSize:  att.FileSize,
				CreatedAt: att.CreatedAt,
				PostID:    att.PostID,
			})
		}
	}

	type respAttachment struct {
		ID       uuid.UUID `json:"id"`
		FileUrl  string    `json:"url"`
		FileName string    `json:"file_name"`
		MimeType string    `json:"mime_type"`
		FileSize int64     `json:"file_size"`
	}

	respAttachments := []respAttachment{}
	for _, a := range attachments {
		respAttachments = append(respAttachments, respAttachment{
			ID:       a.ID,
			FileUrl:  a.FileUrl,
			FileName: a.FileName.String,
			MimeType: a.MimeType.String,
			FileSize: a.FileSize.Int64,
		})
	}

	type response struct {
		ID          uuid.UUID        `json:"id"`
		AuthorID    string           `json:"author_id"`
		CourseID    string           `json:"course_id"`
		Topic       string           `json:"topic"`
		CreatedAt   time.Time        `json:"created_at"`
		UpdatedAt   time.Time        `json:"updated_at"`
		Attachments []respAttachment `json:"attachments"`
	}

	resp := response{
		ID:          post.ID,
		AuthorID:    post.AuthorID.String(),
		CourseID:    post.CourseID,
		Topic:       post.Topic,
		CreatedAt:   post.CreatedAt.Time,
		UpdatedAt:   post.UpdatedAt.Time,
		Attachments: respAttachments,
	}

	respondWithJSON(w, http.StatusCreated, resp)
}
