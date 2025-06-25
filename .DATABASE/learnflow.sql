/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP DATABASE IF EXISTS `learnflow`;
CREATE DATABASE IF NOT EXISTS `learnflow` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `learnflow`;

DROP TABLE IF EXISTS `admin`;
CREATE TABLE IF NOT EXISTS `admin` (
  `admin_id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `admin`;
INSERT INTO `admin` (`admin_id`, `username`, `password`) VALUES
	(1, 'test', 'DAEF4953B9783365CAD6615223720506CC46C5167CD16AB500FA597AA08FF964EB24FB19687F34D7665F778FCB6C5358FC0A5B81E1662CF90F73A2671C53F991');

DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `category_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `category`;
INSERT INTO `category` (`category_id`, `name`) VALUES
	(1, 'category 1'),
	(2, 'edited category');

DROP TABLE IF EXISTS `comment`;
CREATE TABLE IF NOT EXISTS `comment` (
  `comment_id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `course_id` int unsigned NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT (now()),
  PRIMARY KEY (`comment_id`),
  KEY `fk_comment_user_id` (`user_id`),
  KEY `fk_comment_course_id` (`course_id`),
  CONSTRAINT `fk_comment_course_id` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_comment_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `comment`;

DROP TABLE IF EXISTS `course`;
CREATE TABLE IF NOT EXISTS `course` (
  `course_id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `short_description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) unsigned NOT NULL,
  `category_id` int unsigned NOT NULL,
  `user_id` int unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT (now()),
  `thumbnail_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`course_id`),
  KEY `fk_course_category_id` (`category_id`),
  KEY `fk_course_user_id` (`user_id`),
  KEY `fk_course_thumbnail_id` (`thumbnail_id`),
  CONSTRAINT `fk_course_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_course_thumbnail_id` FOREIGN KEY (`thumbnail_id`) REFERENCES `thumbnail` (`thumbnail_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_course_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `course`;
INSERT INTO `course` (`course_id`, `title`, `short_description`, `description`, `price`, `category_id`, `user_id`, `created_at`, `thumbnail_id`) VALUES
	(1, 'Izmenjen Uvod u JavaScript', 'Ovo je izmenjen kurs.', 'U ovom kursu ćemo detaljno obraditi osnove JavaScript jezika, uključujući promenljive, petlje, funkcije i manipulaciju DOM-om.', 19.99, 1, 1, '2025-04-19 16:03:49', NULL),
	(2, 'Kurs korisnika 2', 'Naučite osnove.', 'U ovom kursu ćemo detaljno obraditi osnove kursa korisnika 2', 8.99, 1, 2, '2025-05-02 16:06:44', NULL),
	(3, 'Izmenjen Uvod u JavaScript', 'Ovo je izmenjen kurs.', 'U ovom kursu ćemo detaljno obraditi osnove JavaScript jezika, uključujući promenljive, petlje, funkcije i manipulaciju DOM-om.', 19.99, 2, 3, '2025-05-02 16:07:54', 3),
	(4, 'Izmenjen Uvod u kurs 4', 'Ovo je izmenjen kurs broj 4.', 'U ovom kursu ćemo detaljno obraditi osnove kursa broj 4.', 19.99, 2, 3, '2025-05-03 19:42:53', 4),
	(5, 'Kurs korisnika 5', 'Naučite osnove kursa 5 korisnika.', 'U ovom kursu ćemo detaljno obraditi osnove kursa korisnika 5', 27.99, 2, 2, '2025-05-03 20:45:33', NULL);

DROP TABLE IF EXISTS `lesson`;
CREATE TABLE IF NOT EXISTS `lesson` (
  `lesson_id` int unsigned NOT NULL,
  `course_id` int unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `video_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_number` int NOT NULL,
  PRIMARY KEY (`lesson_id`),
  KEY `fk_lesson_course_id` (`course_id`),
  CONSTRAINT `fk_lesson_course_id` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `lesson`;

DROP TABLE IF EXISTS `purchase`;
CREATE TABLE IF NOT EXISTS `purchase` (
  `purchase_id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `course_id` int unsigned NOT NULL,
  `purchased_at` datetime NOT NULL DEFAULT (now()),
  PRIMARY KEY (`purchase_id`),
  KEY `fk_purchase_user_id` (`user_id`),
  KEY `fk_purchase_course_id` (`course_id`),
  CONSTRAINT `fk_purchase_course_id` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_purchase_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `purchase`;

DROP TABLE IF EXISTS `thumbnail`;
CREATE TABLE IF NOT EXISTS `thumbnail` (
  `thumbnail_id` int unsigned NOT NULL AUTO_INCREMENT,
  `image_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_id` int unsigned NOT NULL,
  PRIMARY KEY (`thumbnail_id`),
  KEY `fk_thumbnail_course_id` (`course_id`),
  CONSTRAINT `fk_thumbnail_course_id` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `thumbnail`;
INSERT INTO `thumbnail` (`thumbnail_id`, `image_path`, `course_id`) VALUES
	(3, '202553-7476513068-screenshot-2025-04-28-093907.png', 3),
	(4, '2025620-5342068057-screenshot-2025-04-02-131416.png', 4);

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `user`;
INSERT INTO `user` (`user_id`, `name`, `email`, `password`, `surname`, `phone`) VALUES
	(1, 'admin', 'admin@gmail.com', 'admin', '', ''),
	(2, 'postman', 'postman@gmail.com', '49C631F8FCA4C2E8F2352BAF29C7559E6FE488E557671DC80BB7546CDFF044C13C558208ECA9DB40B9C0A924D7756DA71F4EA0430154D22728AC23AFC4205377', '', ''),
	(3, 'user', 'user@gmail.com', 'B14361404C078FFD549C03DB443C3FEDE2F3E534D73F78F77301ED97D4A436A9FD9DB05EE8B325C0AD36438B43FEC8510C204FC1C1EDB21D0941C00E9E2C1CE2', '', '');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
