-- Tabel Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 0,
    profile_image VARCHAR(255)
);

-- Tabel Transaksi
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,  -- TopUp, Payment
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Payment (contoh transaksi pembayaran)
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    type VARCHAR(50), -- Pulsa, Voucher Game, dll.
    amount DECIMAL(10, 2),
    status VARCHAR(50), -- Pending, Success, Failed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);