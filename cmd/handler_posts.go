package main

import (
	"context"
	"database/sql"
	"fmt"
	"mime/multipart"
	"net/http"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
	"github.com/google/uuid"
	"github.com/ismetinan/BilkentForum/internal/database"
)

func (cfg *apiConfig) uploadToS3(file multipart.File, filename, contentType string) (string, error) {
	_, err := cfg.s3Client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket:      aws.String(cfg.S3BucketName),
		Key:         aws.String(filename),
		Body:        file,
		ContentType: aws.String(contentType),
		ACL:         types.ObjectCannedACLPrivate,
	})
	if err != nil {
		return "", err
	}

	// Private olduğunda direkt URL çalışmaz, ama presigned için kullanılabilir
	url := fmt.Sprintf("https://%s.s3.amazonaws.com/%s", cfg.S3BucketName, filename)
	return url, nil
}

func (cfg *apiConfig) handlerPostsCreate(w http.ResponseWriter, r *http.Request) {
	// Multipart form parse
	if err := r.ParseMultipartForm(20 << 20); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid form data", err)
		return
	}

	courseID := r.FormValue("course_id")
	topic := r.FormValue("topic")
	authorID := r.Context().Value("user_id").(uuid.UUID)

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

	attachments := []database.Attachment{}

	files := r.MultipartForm.File["attachments"]
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
