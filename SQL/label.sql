-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 07, 2017 at 03:42 PM
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
-- Table structure for table `label`
--

CREATE TABLE `label` (
  `label_id` int(10) UNSIGNED NOT NULL,
  `label_name` varchar(100) DEFAULT NULL,
  `label_score` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `label`
--

INSERT INTO `label` (`label_id`, `label_name`, `label_score`, `createdAt`, `updatedAt`) VALUES
(1, 'town', 52, NULL, NULL),
(2, 'moutain', 83, NULL, NULL),
(3, 'slient', 64, NULL, NULL),
(4, 'temple', 96, NULL, NULL),
(5, 'katana', 8, NULL, NULL),
(6, 'shinkansen', 50, NULL, NULL),
(7, 'clean', 56, NULL, NULL),
(8, 'friend', 8, NULL, NULL),
(9, 'sushi', 25, NULL, NULL),
(10, 'playground', 25, NULL, NULL),
(11, 'white day', 58, NULL, NULL),
(12, 'department', 96, NULL, NULL),
(13, 'technology', 14, NULL, NULL),
(14, 'outdoor', 54, NULL, NULL),
(15, 'oni', 31, NULL, NULL),
(16, 'weapon', 76, NULL, NULL),
(17, 'night', 73, NULL, NULL),
(18, 'nuke', 75, NULL, NULL),
(19, 'boat', 7, NULL, NULL),
(20, 'park', 93, NULL, NULL),
(21, 'walking', 85, NULL, NULL),
(22, 'natural', 89, NULL, NULL),
(23, 'war', 76, NULL, NULL),
(24, 'snow', 27, NULL, NULL),
(25, 'sea', 90, NULL, NULL),
(26, 'school', 3, NULL, NULL),
(27, 'yakuza', 42, NULL, NULL),
(28, 'robot', 18, NULL, NULL),
(29, 'flower', 98, NULL, NULL),
(30, 'lake', 99, NULL, NULL),
(31, 'bike', 50, NULL, NULL),
(32, 'stand', 61, NULL, NULL),
(33, 'farm', 45, NULL, NULL),
(34, 'movie', 2, NULL, NULL),
(35, 'indoor', 55, NULL, NULL),
(36, 'noisy', 64, NULL, NULL),
(37, 'biologic', 22, NULL, NULL),
(38, 'festival', 57, NULL, NULL),
(39, 'opera', 78, NULL, NULL),
(40, 'fruit', 9, NULL, NULL),
(41, 'gundam', 16, NULL, NULL),
(42, 'colorfull', 74, NULL, NULL),
(43, 'religion', 18, NULL, NULL),
(44, 'math', 21, NULL, NULL),
(45, 'tanabata', 58, NULL, NULL),
(46, 'zoo', 80, NULL, NULL),
(47, 'apple', 9, NULL, NULL),
(48, 'history', 76, NULL, NULL),
(49, 'sunshine', 71, NULL, NULL),
(50, 'party', 35, NULL, NULL),
(51, 'dango', 22, NULL, NULL),
(52, 'winter', 81, NULL, NULL),
(53, 'label_id', 51, NULL, NULL),
(54, 'airplane', 46, NULL, NULL),
(55, 'love', 59, NULL, NULL),
(56, 'music', 86, NULL, NULL),
(57, 'illumination', 72, NULL, NULL),
(58, 'alien', 62, NULL, NULL),
(59, 'bar', 85, NULL, NULL),
(60, 'drive', 85, NULL, NULL),
(61, 'castle', 97, NULL, NULL),
(62, 'family', 83, NULL, NULL),
(63, 'calture', 88, NULL, NULL),
(64, 'seichi', 90, NULL, NULL),
(65, 'expensive', 80, NULL, NULL),
(66, 'date', 84, NULL, NULL),
(67, 'dish', 29, NULL, NULL),
(68, 'romantic', 31, NULL, NULL),
(69, 'station', 97, NULL, NULL),
(70, 'tv', 3, NULL, NULL),
(71, 'pokemon go', 19, NULL, NULL),
(72, 'cheap', 90, NULL, NULL),
(73, 'ramen', 24, NULL, NULL),
(74, 'okonomiyaki', 40, NULL, NULL),
(75, 'summer', 82, NULL, NULL),
(76, 'Oregairu', 72, NULL, NULL),
(77, 'mafia', 41, NULL, NULL),
(78, 'battle ship', 45, NULL, NULL),
(79, 'onsen', 92, NULL, NULL),
(80, 'clamping', 55, NULL, NULL),
(81, 'label_id', 12, NULL, NULL),
(82, 'altium', 81, NULL, NULL),
(83, 'university', 6, NULL, NULL),
(84, 'spring', 83, NULL, NULL),
(85, 'mascot', 23, NULL, NULL),
(86, 'label_id', 52, NULL, NULL),
(87, 'snow', 38, NULL, NULL),
(88, 'alone', 30, NULL, NULL),
(89, 'singer', 14, NULL, NULL),
(90, 'sleepy', 66, NULL, NULL),
(91, 'science', 22, NULL, NULL),
(92, 'art', 97, NULL, NULL),
(93, 'science', 77, NULL, NULL),
(94, 'office', 79, NULL, NULL),
(95, 'idol', 15, NULL, NULL),
(96, 'label_id', 52, NULL, NULL),
(97, 'not go any more', 69, NULL, NULL),
(98, 'car', 51, NULL, NULL),
(99, 'museum', 98, NULL, NULL),
(100, 'single', 15, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `label`
--
ALTER TABLE `label`
  ADD PRIMARY KEY (`label_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `label`
--
ALTER TABLE `label`
  MODIFY `label_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
