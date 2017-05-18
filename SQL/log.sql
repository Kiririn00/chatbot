-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 23, 2017 at 11:50 AM
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
-- Table structure for table `log`
--

CREATE TABLE `log` (
  `conversation_id` int(10) UNSIGNED NOT NULL,
  `component_id` int(11) DEFAULT NULL,
  `message` varchar(500) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `log`
--

INSERT INTO `log` (`conversation_id`, `component_id`, `message`, `createdAt`, `updatedAt`) VALUES
(1, 2, 'start', '2017-02-23 17:01:28', '2017-02-23 17:01:28'),
(2, 1, 'Hello', '2017-02-23 17:32:28', '2017-02-23 17:32:28'),
(3, 2, 'start', '2017-02-23 17:56:20', '2017-02-23 17:56:20'),
(4, 0, 'EE', '2017-02-23 18:06:08', '2017-02-23 18:06:08'),
(5, 0, 'WW', '2017-02-23 18:06:09', '2017-02-23 18:06:09'),
(6, 3, 'end', '2017-02-24 04:00:00', '2017-02-24 00:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `log`
--
ALTER TABLE `log`
  ADD PRIMARY KEY (`conversation_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `log`
--
ALTER TABLE `log`
  MODIFY `conversation_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
