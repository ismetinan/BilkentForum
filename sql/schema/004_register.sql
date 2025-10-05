-- +goose up
ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN verification_code VARCHAR(6);
ALTER TABLE users ADD COLUMN verification_expires TIMESTAMP;

-- +goose down
ALTER TABLE users DROP COLUMN verification_expires;
ALTER TABLE users DROP COLUMN verification_code;
ALTER TABLE users DROP COLUMN is_verified;