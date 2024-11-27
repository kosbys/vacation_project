CREATE DATABASE IF NOT EXISTS vacation_app;

USE vacation_app;

CREATE TABLE IF NOT EXISTS vacations (
  `id` INT NOT NULL AUTO_INCREMENT,
  `destination` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `price` INT UNSIGNED NOT NULL,
  `image_name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS users (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` CHAR(60) NOT NULL,
  `role` ENUM('admin', 'user') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
);

CREATE TABLE IF NOT EXISTS follows (
  `user_id` INT NOT NULL,
  `vacation_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `vacation_id`),
  KEY `vacation_id` (`vacation_id`),
  CONSTRAINT `follows_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `follows_ibfk_2` FOREIGN KEY (`vacation_id`) REFERENCES `vacations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);