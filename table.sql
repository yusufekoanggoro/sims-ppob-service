-- Tabel Users
CREATE TABLE users (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    balance INTEGER DEFAULT 0,
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
    service_code VARCHAR(50) PRIMARY KEY,
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
    invoice_number VARCHAR(50) PRIMARY KEY,
    user_id INTEGER NOT NULL, 
    service_code VARCHAR(50),
    transaction_type VARCHAR(20) NOT NULL,
    total_amount BIGINT NOT NULL,
    description VARCHAR(50),
    created_on TIMESTAMP NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_code) REFERENCES services(service_code)
);
