-- ============================================================
-- E-COMMERCE PLATFORM — MySQL Database Scripts
-- Clothing / Fashion Retail Company
-- Run each section separately for each microservice DB
-- ============================================================


-- ============================================================
-- 1. AUTH SERVICE DATABASE
-- ============================================================

CREATE DATABASE IF NOT EXISTS auth_service_db;
USE auth_service_db;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    user_id        VARCHAR(36)  NOT NULL DEFAULT (UUID()),
    user_name      VARCHAR(50)  NOT NULL,
    email          VARCHAR(150) NOT NULL,
    phone_number   VARCHAR(15)  NULL,
    password_hash  TEXT         NOT NULL,
    status         VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE'
                   CHECK (status IN ('ACTIVE','LOCKED','DISABLED','PASSWORD_PENDING')),
    created_at     TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMP    NOT NULL DEFAULT NOW() ON UPDATE NOW(),

    PRIMARY KEY (user_id),
    UNIQUE KEY uq_users_email      (email),
    UNIQUE KEY uq_users_username   (user_name),
    UNIQUE KEY uq_users_phone      (phone_number)
);

-- Table: roles
CREATE TABLE IF NOT EXISTS roles (
    role_id    VARCHAR(36)  NOT NULL DEFAULT (UUID()),
    role_name  VARCHAR(30)  NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW(),

    PRIMARY KEY (role_id),
    UNIQUE KEY uq_roles_name (role_name)
);

-- Table: user_roles
CREATE TABLE IF NOT EXISTS user_roles (
    user_id     VARCHAR(36) NOT NULL,
    role_id     VARCHAR(36) NOT NULL,
    assigned_at TIMESTAMP   NOT NULL DEFAULT NOW(),

    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
);

-- Table: addresses
CREATE TABLE IF NOT EXISTS addresses (
    address_id VARCHAR(36)  NOT NULL DEFAULT (UUID()),
    user_id    VARCHAR(36)  NOT NULL,
    street     VARCHAR(255) NOT NULL,
    city       VARCHAR(100) NOT NULL,
    state      VARCHAR(100) NOT NULL,
    pincode    VARCHAR(10)  NOT NULL,
    country    VARCHAR(100) NOT NULL DEFAULT 'India',
    is_default BOOLEAN      NOT NULL DEFAULT FALSE,

    PRIMARY KEY (address_id),
    CONSTRAINT fk_addr_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Seed default roles
INSERT IGNORE INTO roles (role_id, role_name) VALUES
    (UUID(), 'CUSTOMER'),
    (UUID(), 'ADMIN');

-- ============================================================
-- 2. PRODUCT SERVICE DATABASE
-- ============================================================

CREATE DATABASE IF NOT EXISTS product_service_db;
USE product_service_db;

-- Table: categories
-- Organised by gender: MEN, WOMEN, OTHERS
CREATE TABLE IF NOT EXISTS categories (
    category_id VARCHAR(36)  NOT NULL DEFAULT (UUID()),
    name        VARCHAR(100) NOT NULL,
    gender      VARCHAR(10)  NOT NULL
                CHECK (gender IN ('MEN','WOMEN','KIDS')),
    description VARCHAR(255) NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),

    PRIMARY KEY (category_id),
    UNIQUE KEY uq_category_name_gender (name, gender)
);

-- Table: products
-- stock_qty is directly on the product — no variants table
CREATE TABLE IF NOT EXISTS products (
    product_id  VARCHAR(36)   NOT NULL DEFAULT (UUID()),
    category_id VARCHAR(36)   NOT NULL,
    name        VARCHAR(200)  NOT NULL,
    brand       VARCHAR(100)  NULL,
    description TEXT          NULL,
    price       DECIMAL(10,2) NOT NULL CHECK (price > 0),
    stock_qty   INT           NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
    material    VARCHAR(100)  NULL,
    image_url   VARCHAR(500)  NULL,
    is_active   BOOLEAN       NOT NULL DEFAULT TRUE,

    PRIMARY KEY (product_id),
    CONSTRAINT fk_prod_category FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- Seed categories — organised by MEN, WOMEN, KIDS
INSERT IGNORE INTO categories (category_id, name, gender, description) VALUES
    -- MEN
    (UUID(), 'Shirts',          'MEN',   'Formal and casual shirts for men'),
    (UUID(), 'T-Shirts',        'MEN',   'Casual t-shirts for men'),
    (UUID(), 'Formal Trousers', 'MEN',   'Formal trousers for men'),
    (UUID(), 'Jeans',           'MEN',   'Denim jeans for men'),
    (UUID(), 'Kurta & Pyjama',  'MEN',   'Traditional kurta and pyjama sets for men'),
    (UUID(), 'Suits & Blazers', 'MEN',   'Suits and blazers for men'),
    (UUID(), 'Ethnic Wear',     'MEN',   'Sherwanis and ethnic wear for men'),
    -- WOMEN
    (UUID(), 'Sarees',          'WOMEN', 'Silk, cotton and designer sarees for women'),
    (UUID(), 'Kurtis',          'WOMEN', 'Straight, A-line and anarkali kurtis for women'),
    (UUID(), 'Salwar Sets',     'WOMEN', 'Punjabi suits and salwar kameez sets for women'),
    (UUID(), 'Lehenga',         'WOMEN', 'Bridal and party lehengas for women'),
    (UUID(), 'Tops & Blouses',  'WOMEN', 'Crop tops, blouses and casual tops for women'),
    (UUID(), 'Western Dresses', 'WOMEN', 'Casual and party western dresses for women'),
    (UUID(), 'Jeans & Trousers','WOMEN', 'Denim jeans and trousers for women'),
    (UUID(), 'Ethnic Wear',     'WOMEN', 'Chaniya choli and festive ethnic wear for women'),
    -- KIDS
    (UUID(), 'Boys Shirts',     'KIDS',  'Shirts for boys'),
    (UUID(), 'Boys T-Shirts',   'KIDS',  'Casual t-shirts for boys'),
    (UUID(), 'Girls Frocks',    'KIDS',  'Frocks and dresses for girls'),
    (UUID(), 'Girls Ethnic',    'KIDS',  'Ethnic wear for girls'),
    (UUID(), 'Kids Casual',     'KIDS',  'Casual everyday wear for kids'),
    (UUID(), 'Kids Ethnic',     'KIDS',  'Traditional ethnic wear for kids');

-- ============================================================
-- 3. ORDER SERVICE DATABASE
-- ============================================================

CREATE DATABASE IF NOT EXISTS order_service_db;
USE order_service_db;

-- Table: orders
CREATE TABLE IF NOT EXISTS orders (
    order_id     VARCHAR(36)   NOT NULL DEFAULT (UUID()),
    user_id      VARCHAR(36)   NOT NULL,
    address_id   VARCHAR(36)   NOT NULL,
    status       VARCHAR(20)   NOT NULL DEFAULT 'PENDING'
                 CHECK (status IN ('PENDING','CONFIRMED','PAYMENT_FAILED',
                                   'PROCESSING','DELIVERED','CANCELLED')),
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount > 0),
    created_at   TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP     NOT NULL DEFAULT NOW() ON UPDATE NOW(),

    PRIMARY KEY (order_id)
);

-- Table: order_items
CREATE TABLE IF NOT EXISTS order_items (
    item_id      VARCHAR(36)   NOT NULL DEFAULT (UUID()),
    order_id     VARCHAR(36)   NOT NULL,
    product_id   VARCHAR(36)   NOT NULL,
    product_name VARCHAR(200)  NOT NULL,
    quantity     INT           NOT NULL CHECK (quantity > 0),
    unit_price   DECIMAL(10,2) NOT NULL CHECK (unit_price > 0),
    subtotal     DECIMAL(10,2) NOT NULL,

    PRIMARY KEY (item_id),
    CONSTRAINT fk_oi_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- ============================================================
-- 4. PAYMENT SERVICE DATABASE
-- ============================================================

CREATE DATABASE IF NOT EXISTS payment_service_db;
USE payment_service_db;

-- Table: wallets
CREATE TABLE IF NOT EXISTS wallets (
    wallet_id  VARCHAR(36)   NOT NULL DEFAULT (UUID()),
    user_id    VARCHAR(36)   NOT NULL,
    balance    DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
    created_at TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP     NOT NULL DEFAULT NOW() ON UPDATE NOW(),

    PRIMARY KEY (wallet_id),
    UNIQUE KEY uq_wallet_user (user_id)
);

-- Table: payment_transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
    transaction_id VARCHAR(36)   NOT NULL DEFAULT (UUID()),
    wallet_id      VARCHAR(36)   NOT NULL,
    order_id       VARCHAR(36)   NULL,
    type           VARCHAR(10)   NOT NULL
                   CHECK (type IN ('CREDIT','DEBIT')),
    amount         DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    description    VARCHAR(255)  NOT NULL,
    created_at     TIMESTAMP     NOT NULL DEFAULT NOW(),

    PRIMARY KEY (transaction_id),
    CONSTRAINT fk_pt_wallet FOREIGN KEY (wallet_id) REFERENCES wallets(wallet_id)
);
