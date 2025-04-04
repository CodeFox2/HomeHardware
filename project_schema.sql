CREATE SCHEMA `hardware` ;

CREATE TABLE `hardware`.`accounts` (
  `account_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `points` INT NULL,
  PRIMARY KEY (`account_id`));

CREATE TABLE `hardware`.`cart` (
  `item_id` INT NOT NULL AUTO_INCREMENT,
  `item_name` VARCHAR(255) NOT NULL,
  `item_price` DECIMAL(20,2) NOT NULL,
  `item_quantity` INT NOT NULL,
  PRIMARY KEY (`item_id`));
ALTER TABLE `hardware`.`cart` 
ALTER TABLE accounts AUTO_INCREMENT=1001;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'atthelastsecond';

INSERT INTO accounts (name, email, password, points)
VALUES ('Shirley Perr', 'email@gmail.com', 'iLovePowerTools', 25);
