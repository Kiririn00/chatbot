-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 19, 2017 at 02:24 PM
-- Server version: 10.1.16-MariaDB
-- PHP Version: 5.5.38

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `linkdata`
--

-- --------------------------------------------------------

--
-- Table structure for table `article`
--

CREATE TABLE `article` (
  `article_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `label_id` int(11) DEFAULT NULL,
  `spot_id` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `article`
--

INSERT INTO `article` (`article_id`, `user_id`, `label_id`, `spot_id`, `createdAt`, `updatedAt`) VALUES
(1, 2, 93, 41, NULL, NULL),
(2, 1, 57, 40, NULL, NULL),
(3, 1, 64, 49, NULL, NULL),
(4, 2, 19, 1, NULL, NULL),
(5, 2, 91, 37, NULL, NULL),
(6, 2, 71, 30, NULL, NULL),
(7, 2, 24, 22, NULL, NULL),
(8, 2, 95, 53, NULL, NULL),
(9, 1, 30, 5, NULL, NULL),
(10, 1, 41, 54, NULL, NULL),
(11, 2, 56, 47, NULL, NULL),
(12, 2, 3, 28, NULL, NULL),
(13, 1, 82, 16, NULL, NULL),
(14, 1, 6, 55, NULL, NULL),
(15, 1, 68, 46, NULL, NULL),
(16, 2, 25, 56, NULL, NULL),
(17, 1, 58, 29, NULL, NULL),
(18, 2, 39, 57, NULL, NULL),
(19, 2, 77, 24, NULL, NULL),
(20, 2, 81, 21, NULL, NULL),
(21, 2, 60, 25, NULL, NULL),
(22, 2, 60, 37, NULL, NULL),
(23, 1, 99, 40, NULL, NULL),
(24, 2, 17, 3, NULL, NULL),
(25, 2, 15, 17, NULL, NULL),
(26, 2, 75, 33, NULL, NULL),
(27, 1, 92, 20, NULL, NULL),
(28, 2, 22, 21, NULL, NULL),
(29, 1, 41, 16, NULL, NULL),
(30, 2, 34, 40, NULL, NULL),
(31, 1, 19, 48, NULL, NULL),
(32, 2, 35, 32, NULL, NULL),
(33, 2, 34, 32, NULL, NULL),
(34, 2, 94, 7, NULL, NULL),
(35, 1, 98, 30, NULL, NULL),
(36, 1, 97, 45, NULL, NULL),
(37, 1, 39, 40, NULL, NULL),
(38, 2, 55, 24, NULL, NULL),
(39, 1, 13, 32, NULL, NULL),
(40, 2, 97, 12, NULL, NULL),
(41, 1, 88, 13, NULL, NULL),
(42, 1, 36, 13, NULL, NULL),
(43, 1, 6, 30, NULL, NULL),
(44, 2, 83, 58, NULL, NULL),
(45, 1, 21, 6, NULL, NULL),
(46, 2, 47, 59, NULL, NULL),
(47, 2, 60, 15, NULL, NULL),
(48, 1, 43, 8, NULL, NULL),
(49, 1, 37, 41, NULL, NULL),
(50, 1, 6, 40, NULL, NULL),
(51, 1, 72, 29, NULL, NULL),
(52, 1, 13, 26, NULL, NULL),
(53, 2, 101, 18, NULL, NULL),
(54, 1, 79, 51, NULL, NULL),
(55, 1, 51, 34, NULL, NULL),
(56, 1, 25, 48, NULL, NULL),
(57, 1, 8, 9, NULL, NULL),
(58, 2, 15, 44, NULL, NULL),
(59, 2, 3, 29, NULL, NULL),
(60, 2, 29, 5, NULL, NULL),
(61, 2, 11, 26, NULL, NULL),
(62, 2, 46, 46, NULL, NULL),
(63, 1, 26, 58, NULL, NULL),
(64, 2, 29, 29, NULL, NULL),
(65, 1, 33, 60, NULL, NULL),
(66, 2, 16, 44, NULL, NULL),
(67, 1, 17, 31, NULL, NULL),
(68, 2, 98, 22, NULL, NULL),
(69, 2, 11, 12, NULL, NULL),
(70, 2, 15, 38, NULL, NULL),
(71, 1, 50, 32, NULL, NULL),
(72, 1, 82, 18, NULL, NULL),
(73, 2, 32, 25, NULL, NULL),
(74, 1, 78, 33, NULL, NULL),
(75, 1, 13, 37, NULL, NULL),
(76, 2, 91, 61, NULL, NULL),
(77, 2, 20, 28, NULL, NULL),
(78, 2, 24, 27, NULL, NULL),
(79, 2, 39, 58, NULL, NULL),
(80, 1, 87, 58, NULL, NULL),
(81, 2, 44, 37, NULL, NULL),
(82, 1, 56, 40, NULL, NULL),
(83, 2, 25, 62, NULL, NULL),
(84, 2, 43, 12, NULL, NULL),
(85, 1, 59, 63, NULL, NULL),
(86, 2, 96, 12, NULL, NULL),
(87, 2, 25, 63, NULL, NULL),
(88, 2, 39, 47, NULL, NULL),
(89, 2, 97, 4, NULL, NULL),
(90, 2, 56, 49, NULL, NULL),
(91, 2, 78, 50, NULL, NULL),
(92, 1, 20, 59, NULL, NULL),
(93, 2, 98, 15, NULL, NULL),
(94, 2, 4, 36, NULL, NULL),
(95, 1, 25, 65, NULL, NULL),
(96, 2, 38, 11, NULL, NULL),
(97, 2, 20, 31, NULL, NULL),
(98, 1, 85, 13, NULL, NULL),
(99, 1, 57, 32, NULL, NULL),
(100, 1, 77, 21, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `article`
--
ALTER TABLE `article`
  ADD PRIMARY KEY (`article_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `article`
--
ALTER TABLE `article`
  MODIFY `article_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
