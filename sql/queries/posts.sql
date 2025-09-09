-- name: CreatePost :one
INSERT INTO posts (id, author_id, course_id, topic, created_at, updated_at)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, author_id, course_id, topic, created_at, updated_at;
