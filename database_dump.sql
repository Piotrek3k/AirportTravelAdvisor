-- MySQL dump 10.13  Distrib 8.0.39, for Linux (x86_64)
--
-- Host: localhost    Database: airport_advisor_system_db
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `airports`
--

DROP TABLE IF EXISTS `airports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `airports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(3) NOT NULL,
  `name` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `airports`
--

LOCK TABLES `airports` WRITE;
/*!40000 ALTER TABLE `airports` DISABLE KEYS */;
INSERT INTO `airports` VALUES (1,'LAX','Los Angeles International Airport','Los Angeles','United States'),(2,'JFK','John F. Kennedy International Airport','New York','United States'),(3,'LHR','Heathrow Airport','London','United Kingdom'),(4,'CDG','Charles de Gaulle Airport','Paris','France'),(5,'HND','Haneda Airport','Tokyo','Japan'),(6,'SYD','Sydney Kingsford Smith Airport','Sydney','Australia'),(7,'DXB','Dubai International Airport','Dubai','United Arab Emirates'),(8,'SIN','Changi Airport','Singapore','Singapore'),(9,'GRU','So Paulo-Guarulhos International Airport','So Paulo','Brazil'),(10,'JNB','O.R. Tambo International Airport','Johannesburg','South Africa');
/*!40000 ALTER TABLE `airports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flights`
--

DROP TABLE IF EXISTS `flights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flights` (
  `id` int NOT NULL AUTO_INCREMENT,
  `flight_number` varchar(20) NOT NULL,
  `airline` varchar(255) NOT NULL,
  `departure_airport_id` int DEFAULT NULL,
  `arrival_airport_id` int DEFAULT NULL,
  `cost` decimal(10,2) DEFAULT NULL,
  `departure_time` datetime DEFAULT NULL,
  `arrival_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `flight_number` (`flight_number`),
  KEY `departure_airport_id` (`departure_airport_id`),
  KEY `arrival_airport_id` (`arrival_airport_id`),
  CONSTRAINT `flights_ibfk_1` FOREIGN KEY (`departure_airport_id`) REFERENCES `airports` (`id`),
  CONSTRAINT `flights_ibfk_2` FOREIGN KEY (`arrival_airport_id`) REFERENCES `airports` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flights`
--

LOCK TABLES `flights` WRITE;
/*!40000 ALTER TABLE `flights` DISABLE KEYS */;
INSERT INTO `flights` VALUES (1,'AA1001','American Airlines',1,2,350.00,'2024-09-02 06:00:00','2024-09-02 08:00:00'),(2,'BA2020','British Airways',3,4,500.00,'2024-09-02 07:30:00','2024-09-02 10:00:00'),(3,'JL5005','Japan Airlines',5,6,1200.00,'2024-09-02 09:00:00','2024-09-02 12:00:00'),(4,'QF4040','Qantas',6,1,1400.00,'2024-09-02 10:30:00','2024-09-02 13:30:00'),(5,'EK3030','Emirates',7,2,800.00,'2024-09-02 12:00:00','2024-09-02 14:30:00'),(6,'SQ1234','Singapore Airlines',8,3,750.00,'2024-09-02 13:30:00','2024-09-02 15:30:00'),(7,'UA7890','United Airlines',2,9,950.00,'2024-09-02 15:00:00','2024-09-02 19:00:00'),(8,'AF6789','Air France',4,10,700.00,'2024-09-02 16:30:00','2024-09-02 20:00:00'),(9,'SA9012','South African Airways',10,7,600.00,'2024-09-02 18:00:00','2024-09-02 22:00:00'),(10,'CX3456','Cathay Pacific',9,8,900.00,'2024-09-02 19:30:00','2024-09-03 00:00:00'),(11,'AA1002','American Airlines',2,3,400.00,'2024-09-02 07:00:00','2024-09-02 09:30:00'),(12,'BA2021','British Airways',4,1,500.00,'2024-09-02 08:00:00','2024-09-02 10:00:00'),(13,'JL5006','Japan Airlines',5,7,1300.00,'2024-09-02 09:30:00','2024-09-02 11:30:00'),(14,'QF4041','Qantas',6,2,1200.00,'2024-09-02 11:00:00','2024-09-02 13:00:00'),(15,'EK3031','Emirates',7,9,1000.00,'2024-09-02 12:30:00','2024-09-02 15:00:00'),(16,'SQ1235','Singapore Airlines',8,1,950.00,'2024-09-02 14:00:00','2024-09-02 16:30:00'),(17,'UA7891','United Airlines',3,4,500.00,'2024-09-02 15:30:00','2024-09-02 17:00:00'),(18,'AF6790','Air France',4,5,650.00,'2024-09-02 17:00:00','2024-09-02 19:30:00'),(19,'SA9013','South African Airways',10,6,1100.00,'2024-09-02 18:30:00','2024-09-02 22:00:00'),(20,'CX3457','Cathay Pacific',9,10,850.00,'2024-09-02 20:00:00','2024-09-03 01:00:00'),(21,'AA1003','American Airlines',1,9,1000.00,'2024-09-02 08:00:00','2024-09-02 12:30:00'),(22,'BA2022','British Airways',3,7,700.00,'2024-09-02 09:30:00','2024-09-02 12:00:00'),(23,'JL5007','Japan Airlines',5,8,1250.00,'2024-09-02 11:00:00','2024-09-02 14:00:00'),(24,'QF4042','Qantas',6,4,1300.00,'2024-09-02 12:30:00','2024-09-02 15:00:00'),(25,'EK3032','Emirates',7,10,950.00,'2024-09-02 14:00:00','2024-09-02 17:00:00'),(26,'SQ1236','Singapore Airlines',8,2,1050.00,'2024-09-02 15:30:00','2024-09-02 18:00:00'),(27,'UA7892','United Airlines',2,5,850.00,'2024-09-02 16:00:00','2024-09-02 19:30:00'),(28,'AF6791','Air France',4,9,1000.00,'2024-09-02 17:30:00','2024-09-02 21:00:00'),(29,'SA9014','South African Airways',10,8,1300.00,'2024-09-02 19:00:00','2024-09-03 00:00:00'),(30,'CX3458','Cathay Pacific',9,3,850.00,'2024-09-02 20:30:00','2024-09-03 00:00:00'),(31,'AA1004','American Airlines',1,10,1100.00,'2024-09-02 06:30:00','2024-09-02 09:00:00'),(32,'BA2023','British Airways',2,4,450.00,'2024-09-02 07:00:00','2024-09-02 09:00:00'),(33,'JL5008','Japan Airlines',5,6,1400.00,'2024-09-02 08:30:00','2024-09-02 11:00:00'),(34,'QF4043','Qantas',6,7,1250.00,'2024-09-02 10:00:00','2024-09-02 12:30:00'),(35,'EK3033','Emirates',7,8,1050.00,'2024-09-02 11:30:00','2024-09-02 14:00:00'),(36,'SQ1237','Singapore Airlines',8,9,950.00,'2024-09-02 13:00:00','2024-09-02 15:30:00'),(37,'UA7893','United Airlines',3,5,900.00,'2024-09-02 14:30:00','2024-09-02 17:00:00'),(38,'AF6792','Air France',4,10,1050.00,'2024-09-02 16:00:00','2024-09-02 18:30:00'),(39,'SA9015','South African Airways',10,1,1200.00,'2024-09-02 17:30:00','2024-09-02 21:00:00'),(40,'CX3459','Cathay Pacific',9,7,1300.00,'2024-09-02 20:00:00','2024-09-02 23:00:00'),(41,'AA1005','American Airlines',1,3,400.00,'2024-09-02 07:30:00','2024-09-02 10:00:00'),(42,'BA2024','British Airways',3,6,700.00,'2024-09-02 08:30:00','2024-09-02 10:00:00'),(43,'JL5009','Japan Airlines',5,4,850.00,'2024-09-02 09:30:00','2024-09-02 12:00:00'),(44,'QF4044','Qantas',6,8,1200.00,'2024-09-02 10:30:00','2024-09-02 12:30:00'),(45,'EK3034','Emirates',7,5,1150.00,'2024-09-02 12:00:00','2024-09-02 14:30:00'),(46,'SQ1238','Singapore Airlines',8,10,1050.00,'2024-09-02 13:30:00','2024-09-02 16:00:00'),(47,'UA7894','United Airlines',2,1,850.00,'2024-09-02 15:00:00','2024-09-02 17:00:00'),(48,'AF6793','Air France',4,7,1250.00,'2024-09-02 16:30:00','2024-09-02 19:00:00'),(49,'SA9016','South African Airways',10,9,1350.00,'2024-09-02 18:00:00','2024-09-02 22:00:00'),(50,'CX3460','Cathay Pacific',9,2,950.00,'2024-09-02 20:00:00','2024-09-02 23:00:00'),(51,'AA1006','American Airlines',1,5,850.00,'2024-09-02 08:00:00','2024-09-02 10:30:00'),(52,'BA2025','British Airways',3,8,900.00,'2024-09-02 09:00:00','2024-09-02 11:30:00'),(53,'JL5010','Japan Airlines',5,10,1200.00,'2024-09-02 10:00:00','2024-09-02 12:30:00'),(54,'QF4045','Qantas',6,9,1150.00,'2024-09-02 11:30:00','2024-09-02 13:30:00'),(55,'EK3035','Emirates',7,4,1300.00,'2024-09-02 12:00:00','2024-09-02 14:30:00'),(56,'SQ1239','Singapore Airlines',8,6,1000.00,'2024-09-02 13:00:00','2024-09-02 16:00:00'),(57,'UA7895','United Airlines',2,7,950.00,'2024-09-02 15:00:00','2024-09-02 18:00:00'),(58,'AF6794','Air France',4,1,1050.00,'2024-09-02 16:30:00','2024-09-02 19:00:00'),(59,'SA9017','South African Airways',10,3,950.00,'2024-09-02 18:00:00','2024-09-02 21:00:00'),(60,'CX3461','Cathay Pacific',9,5,1100.00,'2024-09-02 20:00:00','2024-09-02 22:30:00'),(61,'AA1007','American Airlines',1,6,950.00,'2024-09-02 08:30:00','2024-09-02 11:00:00'),(62,'BA2026','British Airways',3,9,1150.00,'2024-09-02 09:00:00','2024-09-02 12:00:00'),(63,'JL5011','Japan Airlines',5,7,1250.00,'2024-09-02 10:30:00','2024-09-02 12:30:00'),(64,'QF4046','Qantas',6,10,1350.00,'2024-09-02 11:30:00','2024-09-02 14:00:00'),(65,'EK3036','Emirates',7,1,1100.00,'2024-09-02 12:00:00','2024-09-02 14:00:00'),(66,'SQ1240','Singapore Airlines',8,4,950.00,'2024-09-02 13:00:00','2024-09-02 15:30:00'),(67,'UA7896','United Airlines',2,10,1050.00,'2024-09-02 14:30:00','2024-09-02 17:00:00'),(68,'AF6795','Air France',4,2,600.00,'2024-09-02 16:00:00','2024-09-02 18:00:00'),(69,'SA9018','South African Airways',10,4,1150.00,'2024-09-02 18:30:00','2024-09-02 21:00:00'),(70,'CX3462','Cathay Pacific',9,6,1050.00,'2024-09-02 20:00:00','2024-09-02 22:30:00'),(71,'AA1008','American Airlines',1,7,1150.00,'2024-09-02 08:00:00','2024-09-02 10:30:00'),(72,'BA2027','British Airways',3,10,1350.00,'2024-09-02 09:00:00','2024-09-02 11:30:00'),(73,'JL5012','Japan Airlines',5,9,1150.00,'2024-09-02 10:00:00','2024-09-02 12:00:00'),(74,'QF4047','Qantas',6,3,800.00,'2024-09-02 11:30:00','2024-09-02 13:30:00'),(75,'EK3037','Emirates',7,5,1150.00,'2024-09-02 12:00:00','2024-09-02 14:30:00'),(76,'SQ1241','Singapore Airlines',8,2,1050.00,'2024-09-02 13:00:00','2024-09-02 15:00:00'),(77,'UA7897','United Airlines',2,6,850.00,'2024-09-02 14:00:00','2024-09-02 16:30:00'),(78,'AF6796','Air France',4,9,1000.00,'2024-09-02 16:30:00','2024-09-02 19:00:00'),(79,'SA9019','South African Airways',10,5,1300.00,'2024-09-02 18:00:00','2024-09-02 20:30:00'),(80,'CX3463','Cathay Pacific',9,10,1250.00,'2024-09-02 20:00:00','2024-09-02 23:00:00');
/*!40000 ALTER TABLE `flights` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'testuser','test@example.com','$2b$10$xyfirW0WVPMyWx9XOo2HFut2XsUxEXDKwynCORw0AgJUFk8EHtuFC','2024-09-04 21:13:43','2024-09-04 21:13:43');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-04 21:17:57
