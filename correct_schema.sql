-- Правильная структура таблиц на основе сущностей

CREATE TABLE `User` (
  `userId` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `phone` VARCHAR(50),
  `passwordHash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'USER'
);

CREATE TABLE `GovService` (
  `serviceId` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `serviceName` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `category` VARCHAR(100),
  `estimatedDuration` INT,
  `termsUrl` TEXT
);

CREATE TABLE `ServiceCentre` (
  `centreId` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `centreName` VARCHAR(255) NOT NULL,
  `address` VARCHAR(500) NOT NULL,
  `eircode` VARCHAR(10),
  `serviceId` BIGINT NOT NULL,
  FOREIGN KEY (`serviceId`) REFERENCES `GovService`(`serviceId`)
);

CREATE TABLE `TimeSlot` (
  `slotId` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `startTime` DATETIME NOT NULL,
  `endTime` DATETIME NOT NULL,
  `status` ENUM('AVAILABLE', 'BOOKED') DEFAULT 'AVAILABLE',
  `centreId` BIGINT NOT NULL,
  FOREIGN KEY (`centreId`) REFERENCES `ServiceCentre`(`centreId`)
);

CREATE TABLE `Appointment` (
  `appointmentId` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `userId` BIGINT NOT NULL,
  `serviceId` BIGINT NOT NULL,
  `centreId` BIGINT NOT NULL,
  `slotId` BIGINT NOT NULL UNIQUE,
  `status` ENUM('BOOKED', 'CANCELLED', 'RESCHEDULED') DEFAULT 'BOOKED',
  `dateOfBirth` DATE,
  `ppsn` VARCHAR(20),
  `address` VARCHAR(500),
  `eircode` VARCHAR(10),
  `accessibilityNeeds` VARCHAR(255),
  `notes` TEXT,
  `documentNames` TEXT,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `User`(`userId`),
  FOREIGN KEY (`serviceId`) REFERENCES `GovService`(`serviceId`),
  FOREIGN KEY (`centreId`) REFERENCES `ServiceCentre`(`centreId`),
  FOREIGN KEY (`slotId`) REFERENCES `TimeSlot`(`slotId`)
);

CREATE TABLE `Notification` (
  `notificationId` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `userId` BIGINT NOT NULL,
  `appointmentId` BIGINT,
  `message` TEXT NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `readStatus` BOOLEAN DEFAULT FALSE,
  `sentAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `User`(`userId`),
  FOREIGN KEY (`appointmentId`) REFERENCES `Appointment`(`appointmentId`)
);
