-- name: CreateUser :one
INSERT INTO users (id, created_at, updated_at, email, hashed_password, is_verified, verification_code, verification_expires)
VALUES (
    gen_random_uuid(),
    NOW(),
    NOW(),
    $1, -- email
    $2, -- hashed_password
    FALSE, -- default unverified
    $3, -- verification_code
    $4  -- verification_expires
)
RETURNING id, created_at, updated_at, email, hashed_password, is_verified, verification_code, verification_expires;


-- name: GetUserByEmail :one
SELECT * FROM users
WHERE email = $1;

-- name: DeleteUser :exec
DELETE FROM users WHERE id = $1;

