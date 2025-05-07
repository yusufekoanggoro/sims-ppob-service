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

-- Tabel Banners
CREATE TABLE banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    banner_name VARCHAR(255) NOT NULL,
    banner_image VARCHAR(255) NOT NULL,
    description TEXT
);

INSERT INTO banners (banner_name, banner_image, description) VALUES
('Banner 1', 'uploads/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 2', 'uploads/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 3', 'uploads/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 4', 'uploads/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 5', 'uploads/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 6', 'uploads/dummy.jpg', 'Lerem Ipsum Dolor sit amet');

-- Tabel Services
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_code VARCHAR(50) NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    service_icon VARCHAR(255) NOT NULL,
    service_tariff INT NOT NULL
);

INSERT INTO services (service_code, service_name, service_icon, service_tariff) VALUES
('PAJAK', 'Pajak PBB', 'uploads/dummy.jpg', 40000),
('PLN', 'Listrik', 'uploads/dummy.jpg', 10000),
('PDAM', 'PDAM Berlangganan', 'uploads/dummy.jpg', 40000),
('PULSA', 'Pulsa', 'uploads/dummy.jpg', 40000),
('PGN', 'PGN Berlangganan', 'uploads/dummy.jpg', 50000),
('MUSIK', 'Musik Berlangganan', 'uploads/dummy.jpg', 50000),
('TV', 'TV Berlangganan', 'uploads/dummy.jpg', 50000),
('PAKET_DATA', 'Paket data', 'uploads/dummy.jpg', 50000),
('VOUCHER_GAME', 'Voucher Game', 'uploads/dummy.jpg', 100000),
('VOUCHER_MAKANAN', 'Voucher Makanan', 'uploads/dummy.jpg', 100000),
('QURBAN', 'Qurban', 'uploads/dummy.jpg', 200000),
('ZAKAT', 'Zakat', 'uploads/dummy.jpg', 300000);

-- Tabel Transactions
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