CREATE TABLE IF NOT EXISTS champions (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL, -- Prevents duplicate signups
    phone VARCHAR(15) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    target_state VARCHAR(100) NOT NULL, -- The state they want to champion
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
