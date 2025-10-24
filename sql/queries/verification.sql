-- name: InsertVerificationCode :exec
INSERT INTO verification_codes (email, code)
VALUES ($1, $2)
ON CONFLICT (email)
DO UPDATE SET code = EXCLUDED.code, verified = FALSE, created_at = NOW();

-- name: GetVerificationCode :one
SELECT code FROM verification_codes WHERE email = $1;

-- name: MarkEmailVerified :exec
UPDATE verification_codes SET verified = TRUE WHERE email = $1;