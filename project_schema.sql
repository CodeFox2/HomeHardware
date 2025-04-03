CREATE SCHEMA `hardware` ;

CREATE TABLE `hardware`.`accounts` (
  `account_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
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
ADD COLUMN `account_id` INT NOT NULL AFTER `item_quantity`,
ADD INDEX `account_id_idx` (`account_id` ASC) VISIBLE;
;
ALTER TABLE `hardware`.`cart` 
ADD CONSTRAINT `account_id`
  FOREIGN KEY (`account_id`)
  REFERENCES `hardware`.`accounts` (`account_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
ALTER TABLE accounts AUTO_INCREMENT=1001;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'atthelastsecond';

INSERT INTO accounts (name, address, password, points)
VALUES ('Shirley Perr', 'email@gmail.com', 'iLovePowerTools', 25);
