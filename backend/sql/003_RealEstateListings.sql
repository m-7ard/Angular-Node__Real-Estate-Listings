CREATE TABLE real_estate_listings (
    bathroom_number INT,
    bedroom_number INT,
    city VARCHAR(100),
    client_id VARCHAR(255),
    country VARCHAR(100),
    date_created DATETIME NOT NULL,
    description VARCHAR(4096),
    flooring_type VARCHAR(100),
    id VARCHAR(255) PRIMARY KEY,
    price DECIMAL(15, 2),
    square_meters INT,
    state VARCHAR(100),
    street VARCHAR(255),
    title VARCHAR(255),
    type VARCHAR(100),
    year_built INT,
    zip VARCHAR(20),
    images JSON,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);