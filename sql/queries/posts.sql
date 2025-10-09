-- name: CreatePost :one
INSERT INTO posts (author_id, course_id, topic)
VALUES ($1, $2, $3)
RETURNING id, author_id, course_id, topic, created_at, updated_at;


-- name: GetPostByID :one
SELECT * FROM posts
WHERE id = $1;

-- name: ListPosts :many
SELECT id, author_id, course_id, topic, created_at, updated_at
FROM posts
WHERE course_id = $1
ORDER BY created_at DESC;

-- name: DeletePost :exec
DELETE FROM posts WHERE id = $1;
