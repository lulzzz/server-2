-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema ANIECA
-- -----------------------------------------------------
-- Database that stores all data regarding ANIECA management system.

-- -----------------------------------------------------
-- Schema ANIECA
--
-- Database that stores all data regarding ANIECA management system.
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `ANIECA` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin ;
USE `ANIECA` ;

-- -----------------------------------------------------
-- Table `ANIECA`.`T_identification`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`T_identification` (
  `idT_identification` INT NOT NULL,
  `Identification` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idT_identification`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Student`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Student` (
  `idStudent` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(50) NOT NULL,
  `Birth_date` DATE NOT NULL,
  `Identification_number` INT NOT NULL,
  `Identification_expire_date` DATE NOT NULL,
  `Tax_number` INT NULL,
  `Drive_license_number` INT NULL,
  `Obs` VARCHAR(255) NULL,
  `T_identification_idT_identification` INT NOT NULL,
  `Number` VARCHAR(45) NULL,
  `Last_Name` VARCHAR(45) NULL,
  PRIMARY KEY (`idStudent`, `T_identification_idT_identification`),
  UNIQUE INDEX `idAluno_UNIQUE` (`idStudent` ASC),
  INDEX `fk_Student_T_identification1_idx` (`T_identification_idT_identification` ASC),
  CONSTRAINT `fk_Student_T_identification1`
    FOREIGN KEY (`T_identification_idT_identification`)
    REFERENCES `ANIECA`.`T_identification` (`idT_identification`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Exam_center`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Exam_center` (
  `idExam_center` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL,
  `Address` VARCHAR(255) NOT NULL,
  `Center_number` TINYINT(3) NULL,
  `Center_code` TINYINT(4) NULL,
  `Entity` VARCHAR(255) NULL,
  `Entity_owner` VARCHAR(255) NULL,
  `Tax_number` INT NULL,
  `Zip_code` VARCHAR(45) NULL,
  `Telephone1` INT(11) NULL,
  `Telephone2` INT(11) NULL,
  `Fax1` INT(11) NULL,
  `Fax2` INT(11) NULL,
  `Email1` VARCHAR(255) NULL,
  `Email2` VARCHAR(255) NULL,
  PRIMARY KEY (`idExam_center`),
  UNIQUE INDEX `idC_Exames_UNIQUE` (`idExam_center` ASC),
  UNIQUE INDEX `Num_centro_UNIQUE` (`Center_number` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Invoice_info`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Invoice_info` (
  `idInvoice_info` INT NOT NULL AUTO_INCREMENT,
  `Invoice_name` VARCHAR(255) NOT NULL,
  `Invoice_address` VARCHAR(255) NOT NULL,
  `Invoice_location` VARCHAR(255) NOT NULL,
  `Invoice_zip_code` VARCHAR(45) NOT NULL,
  `Invoice_tax_number` INT NOT NULL,
  `Invoice_email` VARCHAR(255) NULL,
  `Send_invoice_email` TINYINT(1) NULL,
  PRIMARY KEY (`idInvoice_info`),
  UNIQUE INDEX `idInvoice_info_UNIQUE` (`idInvoice_info` ASC),
  UNIQUE INDEX `Invoice_tax_number_UNIQUE` (`Invoice_tax_number` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`School`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`School` (
  `idSchool` INT NOT NULL AUTO_INCREMENT,
  `Permit` INT NOT NULL,
  `Associate_num` INT NULL,
  `Name` VARCHAR(45) NOT NULL,
  `Address` VARCHAR(255) NOT NULL,
  `Tax_num` INT NOT NULL,
  `School_block` TINYINT(1) ZEROFILL NULL,
  `Password` VARCHAR(45) NULL,
  `Zip_code` VARCHAR(45) NULL,
  `Location` VARCHAR(45) NULL,
  `Obs` VARCHAR(255) NULL,
  `Telephone1` INT(11) NULL,
  `Telephone2` INT(11) NULL,
  `Fax1` INT(11) NULL,
  `Fax2` INT(11) NULL,
  `Email1` VARCHAR(255) NULL,
  `Email2` VARCHAR(255) NULL,
  `Exam_center_idExam_center` INT NOT NULL,
  `Invoice_info_idInvoice_info` INT NOT NULL,
  PRIMARY KEY (`idSchool`),
  UNIQUE INDEX `Alvará_UNIQUE` (`Permit` ASC),
  UNIQUE INDEX `idEscola_UNIQUE` (`idSchool` ASC),
  INDEX `fk_School_Exam_center1_idx` (`Exam_center_idExam_center` ASC),
  INDEX `fk_School_Invoice_info1_idx` (`Invoice_info_idInvoice_info` ASC),
  UNIQUE INDEX `Associate_num_UNIQUE` (`Associate_num` ASC),
  CONSTRAINT `fk_School_Exam_center1`
    FOREIGN KEY (`Exam_center_idExam_center`)
    REFERENCES `ANIECA`.`Exam_center` (`idExam_center`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_School_Invoice_info1`
    FOREIGN KEY (`Invoice_info_idInvoice_info`)
    REFERENCES `ANIECA`.`Invoice_info` (`idInvoice_info`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Exam_route`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Exam_route` (
  `idExam_route` INT NOT NULL AUTO_INCREMENT,
  `Route` VARCHAR(255) NULL,
  `Active` TINYINT(1) NULL,
  `Code` TINYINT(5) NULL,
  `High_way` TINYINT(1) NULL,
  `Conditioned_route` TINYINT(1) NULL,
  `Exam_center_idExam_center` INT NOT NULL,
  PRIMARY KEY (`idExam_route`),
  UNIQUE INDEX `idPercurso_exame_UNIQUE` (`idExam_route` ASC),
  INDEX `fk_Exam_route_Exam_center1_idx` (`Exam_center_idExam_center` ASC),
  CONSTRAINT `fk_Exam_route_Exam_center1`
    FOREIGN KEY (`Exam_center_idExam_center`)
    REFERENCES `ANIECA`.`Exam_center` (`idExam_center`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Staff`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Staff` (
  `idStaff` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(50) NOT NULL,
  `Key` VARCHAR(50) NOT NULL,
  `In_session` TINYINT(1) NULL,
  `Active` TINYINT(1) NULL,
  `Hidden` TINYINT(1) NULL,
  `Acesses` VARCHAR(255) NULL,
  `Obs` VARCHAR(255) NULL,
  `Exam_center_idExam_center` INT NOT NULL,
  PRIMARY KEY (`idStaff`),
  UNIQUE INDEX `idOperadores_UNIQUE` (`idStaff` ASC),
  INDEX `fk_Staff_Exam_center1_idx` (`Exam_center_idExam_center` ASC),
  CONSTRAINT `fk_Staff_Exam_center1`
    FOREIGN KEY (`Exam_center_idExam_center`)
    REFERENCES `ANIECA`.`Exam_center` (`idExam_center`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Results`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Results` (
  `idResults` INT NOT NULL AUTO_INCREMENT,
  `Date` DATE NULL,
  `Result` TINYINT(1) NULL COMMENT 'Aprovado;\nReprovado;\nFaltou;\nSuspenso;',
  `Assign_examiner_manual` TINYINT(1) NULL,
  `Timestamp` TIMESTAMP NULL,
  `Room` TINYINT(2) NULL,
  `Number` INT NULL,
  `Operadores_idOperadores` INT NOT NULL,
  `Exam_route_idExam_route` INT NOT NULL,
  `Staff_idStaff` INT NOT NULL,
  `Tipo_exame_idTipo_exame` INT NOT NULL,
  PRIMARY KEY (`idResults`, `Operadores_idOperadores`, `Staff_idStaff`, `Tipo_exame_idTipo_exame`),
  UNIQUE INDEX `idPautas_UNIQUE` (`idResults` ASC),
  INDEX `fk_Results_Exam_route1_idx` (`Exam_route_idExam_route` ASC),
  INDEX `fk_Results_Staff1_idx` (`Staff_idStaff` ASC),
  CONSTRAINT `fk_Results_Exam_route1`
    FOREIGN KEY (`Exam_route_idExam_route`)
    REFERENCES `ANIECA`.`Exam_route` (`idExam_route`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Results_Staff1`
    FOREIGN KEY (`Staff_idStaff`)
    REFERENCES `ANIECA`.`Staff` (`idStaff`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`T_exam_status`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`T_exam_status` (
  `idexam_status` INT NOT NULL AUTO_INCREMENT,
  `Status` VARCHAR(45) NOT NULL COMMENT 'Pendente; Disponivel;\nMarcado; Anulado;\nEfectuado; Sem Continuidade;\nReservado; Reserva cancelada;',
  PRIMARY KEY (`idexam_status`),
  UNIQUE INDEX `idStatus_UNIQUE` (`idexam_status` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`T_exam_results`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`T_exam_results` (
  `idT_exam_results` INT NOT NULL AUTO_INCREMENT,
  `Result` VARCHAR(45) NOT NULL COMMENT 'Aprovado;\nReprovado;\nFaltou;\nSuspenso;',
  `Code` VARCHAR(3) NOT NULL,
  PRIMARY KEY (`idT_exam_results`),
  UNIQUE INDEX `idResultado_UNIQUE` (`idT_exam_results` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Student_license`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Student_license` (
  `idStudent_license` INT NOT NULL,
  `Student_license` VARCHAR(45) NULL,
  `Expiration_date` DATE NULL,
  `Active` TINYINT(1) NULL,
  `Student_idStudent` INT NOT NULL,
  `School_idSchool` INT NOT NULL,
  PRIMARY KEY (`idStudent_license`, `Student_idStudent`, `School_idSchool`),
  INDEX `fk_Student_license_Student1_idx` (`Student_idStudent` ASC),
  INDEX `fk_Student_license_School1_idx` (`School_idSchool` ASC),
  CONSTRAINT `fk_Student_license_Student1`
    FOREIGN KEY (`Student_idStudent`)
    REFERENCES `ANIECA`.`Student` (`idStudent`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Student_license_School1`
    FOREIGN KEY (`School_idSchool`)
    REFERENCES `ANIECA`.`School` (`idSchool`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Examiner`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Examiner` (
  `idExaminer` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(50) NOT NULL,
  `Number` TINYINT(4) NULL,
  `License_number` VARCHAR(45) NULL,
  `License_expiration` DATE NULL,
  `Active` TINYINT(1) NULL,
  `Obs` VARCHAR(255) NULL,
  `C_Exames_idC_Exames` INT NOT NULL,
  PRIMARY KEY (`idExaminer`, `C_Exames_idC_Exames`),
  INDEX `fk_Examinador_C_Exames1_idx` (`C_Exames_idC_Exames` ASC),
  CONSTRAINT `fk_Examinador_C_Exames1`
    FOREIGN KEY (`C_Exames_idC_Exames`)
    REFERENCES `ANIECA`.`Exam_center` (`idExam_center`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Exam_price`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Exam_price` (
  `idExam_price` INT NOT NULL AUTO_INCREMENT,
  `Price` DOUBLE NULL,
  `Price_no_associated` DOUBLE NULL,
  `Tax` DOUBLE NULL,
  `Tax_emit_drive_license` DOUBLE NULL,
  PRIMARY KEY (`idExam_price`),
  UNIQUE INDEX `idPreçário_UNIQUE` (`idExam_price` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Type_category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Type_category` (
  `idType_category` INT NOT NULL AUTO_INCREMENT,
  `Category` VARCHAR(45) NULL COMMENT 'AL; B; C; D; AP; AL,P;.....',
  PRIMARY KEY (`idType_category`),
  UNIQUE INDEX `idCategorias_UNIQUE` (`idType_category` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Exam_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Exam_type` (
  `idExam_type` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(50) NOT NULL,
  `Short` VARCHAR(45) NULL,
  `Description` VARCHAR(45) NULL,
  `Has_route` TINYINT(1) NULL,
  `Num_examiners` TINYINT(2) NULL,
  `Num_students` TINYINT(2) NULL,
  `Duration` TIME NULL,
  `Multiple_schools` TINYINT(1) NULL,
  `Minimun_age` TINYINT(2) NULL,
  `Has_license` TINYINT(1) NULL,
  `Has_Pair` TINYINT(1) NULL,
  `Final_exam` TINYINT(1) NULL,
  `Code` VARCHAR(3) NULL,
  `Has_high_way` TINYINT(1) NULL,
  `Has_condicioned_route` TINYINT(1) NULL,
  `C_Exames_idC_Exames` INT NOT NULL,
  `Exam_price_idExam_price` INT NOT NULL,
  `Type_category_idType_category` INT NOT NULL,
  PRIMARY KEY (`idExam_type`, `Type_category_idType_category`),
  UNIQUE INDEX `idTipo_exame_UNIQUE` (`idExam_type` ASC),
  UNIQUE INDEX `Tipo_exame_UNIQUE` (`Name` ASC),
  INDEX `fk_Tipo_exame_C_Exames1_idx` (`C_Exames_idC_Exames` ASC),
  INDEX `fk_Exam_type_Exam_price1_idx` (`Exam_price_idExam_price` ASC),
  INDEX `fk_Exam_type_Type_category1_idx` (`Type_category_idType_category` ASC),
  CONSTRAINT `fk_Tipo_exame_C_Exames1`
    FOREIGN KEY (`C_Exames_idC_Exames`)
    REFERENCES `ANIECA`.`Exam_center` (`idExam_center`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Exam_type_Exam_price1`
    FOREIGN KEY (`Exam_price_idExam_price`)
    REFERENCES `ANIECA`.`Exam_price` (`idExam_price`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Exam_type_Type_category1`
    FOREIGN KEY (`Type_category_idType_category`)
    REFERENCES `ANIECA`.`Type_category` (`idType_category`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Examiner_qualifications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Examiner_qualifications` (
  `idExaminer_qualifications` INT NOT NULL AUTO_INCREMENT,
  `Examiner_C_Exames_idC_Exames` INT NOT NULL,
  `Exam_type_idExam_type` INT NOT NULL,
  PRIMARY KEY (`idExaminer_qualifications`, `Examiner_C_Exames_idC_Exames`, `Exam_type_idExam_type`),
  INDEX `fk_Examiner_Type_exam_Examiner1_idx` (`Examiner_C_Exames_idC_Exames` ASC),
  INDEX `fk_Examiner_Type_exam_Exam_type1_idx` (`Exam_type_idExam_type` ASC),
  UNIQUE INDEX `idExaminer_qualificationscol_UNIQUE` (`idExaminer_qualifications` ASC),
  CONSTRAINT `fk_Examiner_Type_exam_Examiner1`
    FOREIGN KEY (`Examiner_C_Exames_idC_Exames`)
    REFERENCES `ANIECA`.`Examiner` (`C_Exames_idC_Exames`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Examiner_Type_exam_Exam_type1`
    FOREIGN KEY (`Exam_type_idExam_type`)
    REFERENCES `ANIECA`.`Exam_type` (`idExam_type`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Reservations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Reservations` (
  `idReservations` INT NOT NULL AUTO_INCREMENT,
  `Exam_date` DATETIME NOT NULL,
  `Reservation_date` TIMESTAMP NOT NULL,
  `Obs` VARCHAR(255) NULL,
  `Exam_center_idExam_center` INT NOT NULL,
  `Examiner_qualifications_idExaminer_qualifications` INT NOT NULL,
  `Student_license_idStudent_license` INT NOT NULL,
  `Staff_idStaff` INT NOT NULL,
  PRIMARY KEY (`idReservations`, `Exam_center_idExam_center`, `Examiner_qualifications_idExaminer_qualifications`, `Student_license_idStudent_license`, `Staff_idStaff`),
  UNIQUE INDEX `idReservations_UNIQUE` (`idReservations` ASC),
  INDEX `fk_Reservations_Exam_center1_idx` (`Exam_center_idExam_center` ASC),
  INDEX `fk_Reservations_Examiner_qualifications1_idx` (`Examiner_qualifications_idExaminer_qualifications` ASC),
  INDEX `fk_Reservations_Student_license1_idx` (`Student_license_idStudent_license` ASC),
  INDEX `fk_Reservations_Staff1_idx` (`Staff_idStaff` ASC),
  CONSTRAINT `fk_Reservations_Exam_center1`
    FOREIGN KEY (`Exam_center_idExam_center`)
    REFERENCES `ANIECA`.`Exam_center` (`idExam_center`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Reservations_Examiner_qualifications1`
    FOREIGN KEY (`Examiner_qualifications_idExaminer_qualifications`)
    REFERENCES `ANIECA`.`Examiner_qualifications` (`idExaminer_qualifications`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Reservations_Student_license1`
    FOREIGN KEY (`Student_license_idStudent_license`)
    REFERENCES `ANIECA`.`Student_license` (`idStudent_license`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Reservations_Staff1`
    FOREIGN KEY (`Staff_idStaff`)
    REFERENCES `ANIECA`.`Staff` (`idStaff`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Exam`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Exam` (
  `idExame` INT NOT NULL AUTO_INCREMENT,
  `Reception_date` TIMESTAMP NOT NULL,
  `Exam_date` DATETIME NULL,
  `Exam_duration` TIME NULL,
  `Payment` TINYINT(1) NULL,
  `Tax` FLOAT NULL,
  `Tax_payment_date` DATETIME NULL,
  `Drive_license_req` DATETIME NULL,
  `Car_plate` VARCHAR(8) NULL,
  `Revision` TINYINT(1) NULL,
  `Complain` TINYINT(1) NULL,
  `Delay` TINYINT(4) NULL,
  `Par` INT NULL,
  `SEM` TINYINT(1) NULL,
  `Results_idResults` INT NOT NULL,
  `T_exam_status_idexam_status` INT NOT NULL,
  `T_exam_results_idT_exam_results` INT NOT NULL,
  `Examiner_Type_exam_idExaminer_Type_exam` INT NOT NULL,
  `Student_license_idStudent_license` INT NOT NULL,
  `Reservations_idReservations` INT NOT NULL,
  PRIMARY KEY (`idExame`, `T_exam_status_idexam_status`, `Examiner_Type_exam_idExaminer_Type_exam`, `Student_license_idStudent_license`),
  UNIQUE INDEX `idExame_UNIQUE` (`idExame` ASC),
  INDEX `fk_Exam_Results1_idx` (`Results_idResults` ASC),
  INDEX `fk_Exam_T_exam_status1_idx` (`T_exam_status_idexam_status` ASC),
  INDEX `fk_Exam_T_exam_results1_idx` (`T_exam_results_idT_exam_results` ASC),
  INDEX `fk_Exam_Student_license1_idx` (`Student_license_idStudent_license` ASC),
  INDEX `fk_Exam_Reservations1_idx` (`Reservations_idReservations` ASC),
  CONSTRAINT `fk_Exam_Results1`
    FOREIGN KEY (`Results_idResults`)
    REFERENCES `ANIECA`.`Results` (`idResults`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Exam_T_exam_status1`
    FOREIGN KEY (`T_exam_status_idexam_status`)
    REFERENCES `ANIECA`.`T_exam_status` (`idexam_status`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Exam_T_exam_results1`
    FOREIGN KEY (`T_exam_results_idT_exam_results`)
    REFERENCES `ANIECA`.`T_exam_results` (`idT_exam_results`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Exam_Student_license1`
    FOREIGN KEY (`Student_license_idStudent_license`)
    REFERENCES `ANIECA`.`Student_license` (`idStudent_license`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Exam_Reservations1`
    FOREIGN KEY (`Reservations_idReservations`)
    REFERENCES `ANIECA`.`Reservations` (`idReservations`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Work_hours`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Work_hours` (
  `idWork_hours` INT NOT NULL AUTO_INCREMENT,
  `Week_day` INT NULL,
  `Start_hour` TIME NULL,
  `End_hour` TIME NULL,
  `Obs` VARCHAR(255) NULL,
  `Exam_center_idExam_center` INT NOT NULL,
  PRIMARY KEY (`idWork_hours`),
  UNIQUE INDEX `idHorario_exame_UNIQUE` (`idWork_hours` ASC),
  INDEX `fk_Exam_center_schedule_Exam_center1_idx` (`Exam_center_idExam_center` ASC),
  CONSTRAINT `fk_Exam_center_schedule_Exam_center1`
    FOREIGN KEY (`Exam_center_idExam_center`)
    REFERENCES `ANIECA`.`Exam_center` (`idExam_center`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`T_Status_bank_check`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`T_Status_bank_check` (
  `idT_Status_bank_check` INT NOT NULL AUTO_INCREMENT,
  `Status` VARCHAR(45) NOT NULL COMMENT 'Por Depositar;\nDepositado;\nPendente;\nCrédito;\nOferta;',
  PRIMARY KEY (`idT_Status_bank_check`),
  UNIQUE INDEX `idStatus_cheque_UNIQUE` (`idT_Status_bank_check` ASC),
  UNIQUE INDEX `Status_UNIQUE` (`Status` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`T_Bank`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`T_Bank` (
  `idT_Bank` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idT_Bank`),
  UNIQUE INDEX `idBancos_UNIQUE` (`idT_Bank` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`T_Payment_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`T_Payment_type` (
  `idT_Payment_type` INT NOT NULL AUTO_INCREMENT,
  `Payment_type` VARCHAR(45) NOT NULL COMMENT 'Numerario; Ref MB; Transfencia; Misto;\nCheque; Cartão MB; Cartão Credito; Credito\nVales Oferta\nANIECA\n',
  PRIMARY KEY (`idT_Payment_type`),
  UNIQUE INDEX `idModo_pagamento_UNIQUE` (`idT_Payment_type` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Pendent_payments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Pendent_payments` (
  `idPayments` INT NOT NULL AUTO_INCREMENT,
  `Date` TIMESTAMP NOT NULL,
  `Exam_price` DOUBLE NOT NULL,
  `Tax_price` INT NULL,
  `Tax_paid` TINYINT(1) NULL,
  `School_idSchool` INT NOT NULL,
  `Exam_idExame` INT NOT NULL,
  PRIMARY KEY (`idPayments`),
  UNIQUE INDEX `idPagamentos_UNIQUE` (`idPayments` ASC),
  INDEX `fk_Payments_School1_idx` (`School_idSchool` ASC),
  INDEX `fk_Payments_Exam1_idx` (`Exam_idExame` ASC),
  CONSTRAINT `fk_Payments_School1`
    FOREIGN KEY (`School_idSchool`)
    REFERENCES `ANIECA`.`School` (`idSchool`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Payments_Exam1`
    FOREIGN KEY (`Exam_idExame`)
    REFERENCES `ANIECA`.`Exam` (`idExame`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Transactions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Transactions` (
  `idTransactions` INT NOT NULL AUTO_INCREMENT,
  `Value` DOUBLE NULL,
  `Transation_date` DATETIME NULL,
  `T_Payment_type_idT_Payment_type` INT NOT NULL,
  `Payments_idPayments` INT NOT NULL,
  PRIMARY KEY (`idTransactions`, `T_Payment_type_idT_Payment_type`),
  UNIQUE INDEX `idTransactions_UNIQUE` (`idTransactions` ASC),
  INDEX `fk_Transactions_T_Payment_type1_idx` (`T_Payment_type_idT_Payment_type` ASC),
  INDEX `fk_Transactions_Payments1_idx` (`Payments_idPayments` ASC),
  CONSTRAINT `fk_Transactions_T_Payment_type1`
    FOREIGN KEY (`T_Payment_type_idT_Payment_type`)
    REFERENCES `ANIECA`.`T_Payment_type` (`idT_Payment_type`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Transactions_Payments1`
    FOREIGN KEY (`Payments_idPayments`)
    REFERENCES `ANIECA`.`Pendent_payments` (`idPayments`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Bank_check`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Bank_check` (
  `idBank_check` INT NOT NULL AUTO_INCREMENT,
  `Reception_date` DATE NOT NULL,
  `Register_Date` DATE NOT NULL,
  `Value` DOUBLE NULL,
  `T_Status_bank_check_idT_Status_bank_check` INT NOT NULL,
  `T_Bank_idT_Bank` INT NOT NULL,
  `Transactions_idTransactions` INT NOT NULL,
  PRIMARY KEY (`idBank_check`, `T_Status_bank_check_idT_Status_bank_check`, `T_Bank_idT_Bank`),
  UNIQUE INDEX `idCheques_UNIQUE` (`idBank_check` ASC),
  INDEX `fk_Bank_check_T_Status_bank_check1_idx` (`T_Status_bank_check_idT_Status_bank_check` ASC),
  INDEX `fk_Bank_check_T_Bank1_idx` (`T_Bank_idT_Bank` ASC),
  INDEX `fk_Bank_check_Transactions1_idx` (`Transactions_idTransactions` ASC),
  CONSTRAINT `fk_Bank_check_T_Status_bank_check1`
    FOREIGN KEY (`T_Status_bank_check_idT_Status_bank_check`)
    REFERENCES `ANIECA`.`T_Status_bank_check` (`idT_Status_bank_check`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Bank_check_T_Bank1`
    FOREIGN KEY (`T_Bank_idT_Bank`)
    REFERENCES `ANIECA`.`T_Bank` (`idT_Bank`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Bank_check_Transactions1`
    FOREIGN KEY (`Transactions_idTransactions`)
    REFERENCES `ANIECA`.`Transactions` (`idTransactions`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`T_Tax_value`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`T_Tax_value` (
  `idT_Tax_value` INT NOT NULL AUTO_INCREMENT,
  `Value` DOUBLE NOT NULL,
  PRIMARY KEY (`idT_Tax_value`),
  UNIQUE INDEX `idIVA_UNIQUE` (`idT_Tax_value` ASC),
  UNIQUE INDEX `Valor_UNIQUE` (`Value` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Blocked_schools`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Blocked_schools` (
  `idBlocked_schools` INT NOT NULL AUTO_INCREMENT,
  `Examiner_idExaminer` INT NOT NULL,
  `Examiner_C_Exames_idC_Exames` INT NOT NULL,
  `School_idSchool` INT NOT NULL,
  PRIMARY KEY (`idBlocked_schools`),
  UNIQUE INDEX `idBlocked_schools_UNIQUE` (`idBlocked_schools` ASC),
  INDEX `fk_Blocked_schools_Examiner1_idx` (`Examiner_idExaminer` ASC, `Examiner_C_Exames_idC_Exames` ASC),
  INDEX `fk_Blocked_schools_School1_idx` (`School_idSchool` ASC),
  CONSTRAINT `fk_Blocked_schools_Examiner1`
    FOREIGN KEY (`Examiner_idExaminer` , `Examiner_C_Exames_idC_Exames`)
    REFERENCES `ANIECA`.`Examiner` (`idExaminer` , `C_Exames_idC_Exames`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Blocked_schools_School1`
    FOREIGN KEY (`School_idSchool`)
    REFERENCES `ANIECA`.`School` (`idSchool`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`ATM`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`ATM` (
  `idATM_Ref` INT NOT NULL AUTO_INCREMENT,
  `Reference` INT NULL,
  `Card` INT NULL,
  `Transfer` INT NULL,
  `Expiration_date` DATE NULL,
  `Transactions_idTransactions` INT NOT NULL,
  `T_Bank_idT_Bank` INT NOT NULL,
  PRIMARY KEY (`idATM_Ref`, `T_Bank_idT_Bank`),
  UNIQUE INDEX `idATM_Ref_UNIQUE` (`idATM_Ref` ASC),
  INDEX `fk_ATM_Ref_Transactions1_idx` (`Transactions_idTransactions` ASC),
  INDEX `fk_ATM_Ref_T_Bank1_idx` (`T_Bank_idT_Bank` ASC),
  CONSTRAINT `fk_ATM_Ref_Transactions1`
    FOREIGN KEY (`Transactions_idTransactions`)
    REFERENCES `ANIECA`.`Transactions` (`idTransactions`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_ATM_Ref_T_Bank1`
    FOREIGN KEY (`T_Bank_idT_Bank`)
    REFERENCES `ANIECA`.`T_Bank` (`idT_Bank`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ANIECA`.`Ticket_offer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ANIECA`.`Ticket_offer` (
  `idTicket_offer` INT NOT NULL AUTO_INCREMENT,
  `Transactions_idTransactions` INT NOT NULL,
  PRIMARY KEY (`idTicket_offer`),
  UNIQUE INDEX `idTicket_offer_UNIQUE` (`idTicket_offer` ASC),
  INDEX `fk_Ticket_offer_Transactions1_idx` (`Transactions_idTransactions` ASC),
  CONSTRAINT `fk_Ticket_offer_Transactions1`
    FOREIGN KEY (`Transactions_idTransactions`)
    REFERENCES `ANIECA`.`Transactions` (`idTransactions`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
