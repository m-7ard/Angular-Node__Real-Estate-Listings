CREATE TABLE real_estate_listings (
    id VARCHAR(255) PRIMARY KEY,
    type VARCHAR(100),
    price DECIMAL(15, 2),
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip VARCHAR(20),
    country VARCHAR(100),
    client_id VARCHAR(255),
    date_created DATETIME NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);