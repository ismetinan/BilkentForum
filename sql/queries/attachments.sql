-- name: CreateAttachment :one
INSERT INTO attachments (post_id, file_url, file_name, mime_type, file_size)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;
