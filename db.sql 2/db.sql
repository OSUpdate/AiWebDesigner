create database aws;
use aws;
create table userinfo(
	id varchar(50) not null primary key,
	password varchar(300) not null,
	email varchar(50) not null
);
CREATE TABLE IF NOT EXISTS `aws`.`logged` (
    `token` VARCHAR(100) NULL,
    `uid` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`uid`)
)  ENGINE=INNODB;
CREATE TABLE IF NOT EXISTS `aws`.`add` (
  `num` INT NOT NULL,
  `classnum` INT NOT NULL,
  `date` INT NOT NULL,
  PRIMARY KEY (`num`))
ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `aws`.`file` (
  `num` INT NOT NULL,
  `location` VARCHAR(50) NOT NULL,
  `image` VARCHAR(50) NOT NULL,
  `filename` VARCHAR(50) NOT NULL,
  `count` INT NOT NULL,
  PRIMARY KEY (`num`))
ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `aws`.`history` (
  `num` INT NOT NULL,
  `filename` VARCHAR(45) NOT NULL,
  `date` INT NOT NULL,
  `classnum` INT NOT NULL,
  `uid` VARCHAR(45) NOT NULL,
  `logged_uid` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`num`, `logged_uid`),
  INDEX `fk_history_logged1_idx` (`logged_uid` ASC) VISIBLE,
  CONSTRAINT `fk_history_logged1`
    FOREIGN KEY (`logged_uid`)
    REFERENCES `aws`.`logged` (`uid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `aws`.`category` (
  `num` INT NOT NULL,
  `filename` VARCHAR(45) NOT NULL,
  `classnum` INT NOT NULL,
  `history_num` INT NOT NULL,
  `file_num` INT NOT NULL,
  `add_num` INT NOT NULL,
  PRIMARY KEY (`num`, `history_num`, `file_num`, `add_num`),
  INDEX `fk_category_history_idx` (`history_num` ASC) VISIBLE,
  INDEX `fk_category_file1_idx` (`file_num` ASC) VISIBLE,
  INDEX `fk_category_add1_idx` (`add_num` ASC) VISIBLE,
  CONSTRAINT `fk_category_history`
    FOREIGN KEY (`history_num`)
    REFERENCES `aws`.`history` (`num`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_category_file1`
    FOREIGN KEY (`file_num`)
    REFERENCES `aws`.`file` (`num`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_category_add1`
    FOREIGN KEY (`add_num`)
    REFERENCES `aws`.`add` (`num`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;