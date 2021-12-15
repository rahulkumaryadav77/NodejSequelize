-- Creating new database
CREATE DATABASE FakeDatabase;

-- Using database
USE FakeDatabase;

-- Creating User table
CREATE TABLE User(
    id INT NOT NULL,
    userName VARCHAR(100) NOT NULL,
    userEmail VARCHAR(100) NOT NULL,
    userPassword VARCHAR(100) NOT NULL,
    totalOrder INT NOT NULL,
    userImage VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    last_logged_in TIMESTAMP,
    PRIMARY KEY(id) 
);
