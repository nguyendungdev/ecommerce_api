DROP DATABASE IF EXISTS ecommerce;

-- CREATE DATABASE
CREATE DATABASE ecommerce;

--DROP TABLE IF EXISTS
DROP TABLE IF EXISTS order_item;
DROP TABLE IF EXISTS invoice;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS category_product;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS "order";
DROP TABLE IF EXISTS users;

-- CREATE TYPE
DROP TYPE IF EXISTS user_roles;
DROP TYPE IF EXISTS users_roles_enum;

CREATE TYPE user_roles AS ENUM('User', 'Admin');
DROP TYPE IF EXISTS payment_methods;
CREATE TYPE payment_methods AS ENUM('VISA', 'PAYPAL','CASH_ON_DELIVERY','MASTERCARD','PURCHASE_ORDER');
DROP TYPE IF EXISTS order_stats;
CREATE TYPE order_stats AS ENUM ('PROCESSED', 'SHIPPED', 'DELIVERED');

-- CREATE TABLE
CREATE TABLE users
(
    id uuid PRIMARY KEY default gen_random_uuid(),
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50),
    salt VARCHAR(50),
    roles user_roles [] NOT NULL,
    create_at TIMESTAMP NOT NULL default NOW(),
    update_at TIMESTAMP,
    delete_at TIMESTAMP,
    is_confirmed BOOLEAN NOT NULL DEFAULT false
);
create table category
(
    id uuid primary key default gen_random_uuid(),
    name varchar(50) unique not null ,
    description varchar(50),
    create_at timestamp not null default NOW(),
    update_at timestamp,
    delete_at timestamp
);
create table product
(
    id uuid primary key default gen_random_uuid(),
    name varchar(50) not null ,
    img_url varchar(50) not null,
    base_price numeric not null,
    discount_percentage numeric not null,
    description varchar(50) not null,
    stock integer not null,
    total_review integer not null default 0,
    create_at timestamp not null default NOW(),
    update_at timestamp,
    delete_at timestamp
);
create table category_product(
    id uuid primary key ,
    category_id uuid references category(id) on delete cascade,
    product_id uuid references product(id) on delete cascade
);
create table payment
(
    id uuid primary key default gen_random_uuid(),
    provider varchar(50) not null,
    acount_no varchar(50) not null,
    expiry date not null ,
    user_id uuid references users(id) on delete cascade,
    payment_method payment_methods not null,
    create_at timestamp not null default NOW(),
    update_at timestamp,
    delete_at timestamp
);

create table "order"
(
    id uuid primary key default gen_random_uuid(),
    order_date date not null ,
    status order_stats default 'PROCESSED',
    shipment_date timestamp,
    comment varchar(255),
    shipped_to varchar(255) not null,
    user_id uuid references users(id) on delete cascade ,
    create_at timestamp not null default NOW(),
    update_at timestamp,
    delete_at timestamp
);
create table invoice
(
    id uuid primary key default gen_random_uuid(),
    number varchar(255) not null ,
    invoice_total numeric not null ,
    invoice_date date not null ,
    due_date date not null ,
    payment_date timestamp not null ,
    payment_id uuid references payment(id) on delete cascade ,
    order_id uuid references "order"(id) on delete cascade ,
    create_at timestamp not null default NOW(),
    update_at timestamp,
    delete_at timestamp
);

create table order_item
(
    id uuid primary key default gen_random_uuid(),
    quanity int not null ,
    total_price numeric not null ,
    product_id uuid references product(id) on delete cascade ,
    order_id uuid references "order"(id) on delete cascade ,
    create_at timestamp not null default NOW(),
    update_at timestamp,
    delete_at timestamp
);

create table ratings
(
    id uuid primary key default gen_random_uuid(),
    rating_point integer not null,
    create_at timestamp not null default NOW(),
    update_at timestamp,
    delete_at timestamp
);

create table reviews
(
    id uuid primary key default gen_random_uuid(),
    ratings_id uuid references ratings(id)  on delete cascade ,
    user_id uuid references users(id) on delete cascade,
    product_id uuid references  product(id) on delete cascade,
    comment text,
    create_at timestamp not null default NOW(),
    update_at timestamp,
    delete_at timestamp
);



