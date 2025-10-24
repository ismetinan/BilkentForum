
-- +goose Up
CREATE TABLE verification_codes (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    code TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    verified BOOLEAN DEFAULT FALSE
);

-- +goose down
DROP TABLE verification_codes;