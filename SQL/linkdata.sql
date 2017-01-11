-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jan 11, 2017 at 01:05 PM
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
-- Table structure for table `chat`
--

CREATE TABLE `chat` (
  `id` int(10) UNSIGNED NOT NULL,
  `text` varchar(300) DEFAULT NULL,
  `bot` varchar(300) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `debug`
--

CREATE TABLE `debug` (
  `id` int(10) UNSIGNED NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `log`
--

CREATE TABLE `log` (
  `id` int(10) UNSIGNED NOT NULL,
  `question` varchar(100) DEFAULT NULL,
  `answer` varchar(500) DEFAULT NULL,
  `component` varchar(200) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `log`
--

INSERT INTO `log` (`id`, `question`, `answer`, `component`, `createdAt`, `updatedAt`) VALUES
(1, 'Hello', 'Hi Welcome to chat bot Beta 0.0.3 if you don''t know what to do type ''Help me :)''', 'stop_sentence', NULL, NULL),
(2, 'Guide me to user register page', '<a href=''http://localhost:1337/User/Register''>Click Me</a>', 'stop_sentence', NULL, NULL),
(3, 'Guide me to login', 'Help system is still in close beta.', 'stop_sentence', NULL, NULL),
(4, 'Help me', 'Help system is still in close beta.', 'stop_sentence', NULL, NULL),
(5, 'What is poppular spot', 'Hikone-cho (Thi is just test data not come from recommend system)', 'stop_sentence', NULL, NULL),
(6, 'recommend spot', NULL, 'feedback', NULL, NULL),
(7, 'recommend spot in spring', NULL, 'feedback', NULL, NULL),
(8, 'recommend spot in summer', NULL, 'feedback', NULL, NULL),
(9, 'recommend spot in autumn', NULL, 'feedback', NULL, NULL),
(10, 'recommend spot in winter', NULL, 'feedback', NULL, NULL),
(11, 'No', NULL, 'feedback', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
  `id` int(10) UNSIGNED NOT NULL,
  `text` varchar(300) DEFAULT NULL,
  `bot` varchar(300) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `person`
--

CREATE TABLE `person` (
  `id` int(10) UNSIGNED NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `preference`
--

CREATE TABLE `preference` (
  `id` int(10) UNSIGNED NOT NULL,
  `preference_name` varchar(100) DEFAULT NULL,
  `preference_score` int(11) DEFAULT NULL,
  `preference_value` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `preference`
--

INSERT INTO `preference` (`id`, `preference_name`, `preference_score`, `preference_value`, `createdAt`, `updatedAt`) VALUES
(1, 'Ching', 3, 1, NULL, '2016-12-25 00:17:26'),
(2, 'El Zapotal del Norte', 5, 1, NULL, NULL),
(3, 'Pedro Leopoldo', 3, 0, NULL, NULL),
(4, 'Zhangxi', 2, 1, NULL, NULL),
(5, 'Qingfeng', 1, 0, NULL, NULL),
(6, 'Tertek', 10, 0, NULL, NULL),
(7, 'Huanchillas', 8, 0, NULL, NULL),
(8, 'Sidowayah Lor', 2, 1, NULL, NULL),
(9, 'Zhanghekou', 5, 1, NULL, NULL),
(10, 'Nanzhen', 7, 0, NULL, NULL),
(11, 'Khosta', 10, 0, NULL, NULL),
(12, 'Saint Paul', 9, 1, NULL, NULL),
(13, 'Meipu', 10, 0, NULL, NULL),
(14, 'Oslo', 5, 0, NULL, NULL),
(15, 'Góis', 2, 0, NULL, NULL),
(16, 'Schengen', 3, 0, NULL, NULL),
(17, 'Virginia Beach', 8, 0, NULL, NULL),
(18, 'Esil', 3, 1, NULL, NULL),
(19, 'Matangshan', 7, 0, NULL, NULL),
(20, 'Mabamba', 9, 1, NULL, NULL),
(21, 'Bujanovac', 3, 1, NULL, NULL),
(22, 'Novi Vinodolski', 2, 0, NULL, NULL),
(23, 'Ushiku', 9, 0, NULL, NULL),
(24, 'Piteå', 9, 1, NULL, NULL),
(25, 'Sabugo', 9, 1, NULL, NULL),
(26, 'Guanxi', 1, 1, NULL, NULL),
(27, 'Talalayivka', 3, 0, NULL, NULL),
(28, 'Suka Makmue', 5, 0, NULL, NULL),
(29, 'Cancas', 5, 1, NULL, NULL),
(30, 'Shiguai', 6, 0, NULL, NULL),
(31, 'Forninho', 8, 0, NULL, NULL),
(32, 'Tcholliré', 1, 0, NULL, NULL),
(33, 'Dajasongai', 7, 0, NULL, NULL),
(34, 'Veldhoven', 1, 0, NULL, NULL),
(35, 'Shiyuetian', 1, 0, NULL, NULL),
(36, 'Aleg', 1, 1, NULL, NULL),
(37, 'Zhizhong', 6, 0, NULL, NULL),
(38, 'Ural', 4, 0, NULL, NULL),
(39, 'Netvořice', 3, 1, NULL, NULL),
(40, 'Dongshe', 10, 0, NULL, NULL),
(41, 'Thiès Nones', 8, 0, NULL, NULL),
(42, 'Jipijapa', 2, 1, NULL, NULL),
(43, 'Lishu', 2, 0, NULL, NULL),
(44, 'Binitayan', 8, 1, NULL, NULL),
(45, 'Gaofeng', 1, 1, NULL, NULL),
(46, 'Unidad', 2, 0, NULL, NULL),
(47, 'Mujur Satu', 1, 1, NULL, NULL),
(48, 'Dolsk', 8, 1, NULL, NULL),
(49, 'Grujugan', 2, 0, NULL, NULL),
(50, 'Bartošovice', 9, 0, NULL, NULL),
(51, 'Khonj', 6, 1, NULL, NULL),
(52, 'Toulon', 9, 0, NULL, NULL),
(53, 'Dasol', 5, 0, NULL, NULL),
(54, 'Valença', 9, 1, NULL, NULL),
(55, 'Tutong', 3, 0, NULL, NULL),
(56, 'Mocímboa', 4, 0, NULL, NULL),
(57, 'Sintung Timur', 2, 0, NULL, NULL),
(58, 'Dampol', 10, 0, NULL, NULL),
(59, 'Qaram Qōl', 9, 0, NULL, NULL),
(60, 'Shihudang', 4, 1, NULL, NULL),
(61, 'Wonosari', 2, 1, NULL, NULL),
(62, 'Elaiochóri', 5, 0, NULL, NULL),
(63, 'Malaga', 3, 1, NULL, NULL),
(64, 'Tapacocha', 8, 1, NULL, NULL),
(65, 'Kaliska', 5, 0, NULL, NULL),
(66, 'Areia Branca', 10, 0, NULL, NULL),
(67, 'Barra', 7, 0, NULL, NULL),
(68, 'El Socorro', 2, 1, NULL, NULL),
(69, 'Lubowidz', 6, 1, NULL, NULL),
(70, 'Longcheng', 8, 1, NULL, NULL),
(71, 'Dulce Nombre', 10, 1, NULL, NULL),
(72, 'Tibati', 3, 0, NULL, NULL),
(73, 'Shilovo', 1, 0, NULL, NULL),
(74, 'Redinha', 7, 1, NULL, NULL),
(75, 'Tokombere', 4, 0, NULL, NULL),
(76, 'Trat', 5, 1, NULL, NULL),
(77, 'Chongwen', 6, 1, NULL, NULL),
(78, 'San Enrique', 1, 1, NULL, NULL),
(79, 'Ventersdorp', 5, 0, NULL, NULL),
(80, 'Kuantan', 8, 0, NULL, NULL),
(81, 'Oygon', 5, 0, NULL, NULL),
(82, 'Masons Bay', 5, 0, NULL, NULL),
(83, 'Mokil', 10, 1, NULL, NULL),
(84, 'Phoenix', 5, 1, NULL, NULL),
(85, 'Ban Phue', 8, 0, NULL, NULL),
(86, 'Santa Tecla', 9, 1, NULL, NULL),
(87, 'Mirny', 10, 0, NULL, NULL),
(88, 'Dobryatino', 1, 1, NULL, NULL),
(89, 'Chuzhou', 10, 0, NULL, NULL),
(90, 'Makale', 6, 1, NULL, NULL),
(91, 'Keffi', 1, 1, NULL, NULL),
(92, 'Skellefteå', 8, 0, NULL, NULL),
(93, 'Jiaogong', 9, 1, NULL, NULL),
(94, 'Prengtale', 8, 0, NULL, NULL),
(95, 'Hufeng', 10, 0, NULL, NULL),
(96, 'Fria', 7, 0, NULL, NULL),
(97, 'Belén Gualcho', 10, 1, NULL, NULL),
(98, 'Maoyang', 9, 1, NULL, NULL),
(99, 'Ngembel', 8, 1, NULL, NULL),
(100, 'Mlimba', 5, 0, NULL, NULL),
(101, 'Varits', NULL, NULL, '2016-12-24 19:40:45', '2016-12-24 19:40:45'),
(102, NULL, 0, 0, '2016-12-24 19:51:09', '2016-12-24 19:51:09'),
(103, 'Hi', 0, 0, '2016-12-24 19:52:48', '2016-12-24 19:52:48'),
(104, 'VaritT', 0, 0, '2016-12-24 20:35:12', '2016-12-24 20:35:12'),
(105, 'VaritSS', 0, 0, '2016-12-24 22:21:17', '2016-12-24 22:21:17'),
(106, 'ddd', 0, 0, '2016-12-24 22:21:28', '2016-12-24 22:21:28'),
(107, 'Varit', 0, 0, '2016-12-24 23:33:30', '2016-12-24 23:33:30'),
(108, 'temple', 0, 0, '2016-12-26 18:00:36', '2016-12-26 18:00:36');

-- --------------------------------------------------------

--
-- Table structure for table `preference_mock`
--

CREATE TABLE `preference_mock` (
  `id` int(10) UNSIGNED NOT NULL,
  `spot_name` varchar(100) DEFAULT NULL,
  `temple` int(11) DEFAULT NULL,
  `natural` int(11) DEFAULT NULL,
  `history` int(11) DEFAULT NULL,
  `lake` int(11) DEFAULT NULL,
  `castle` int(11) DEFAULT NULL,
  `museum` int(11) DEFAULT NULL,
  `market` int(11) DEFAULT NULL,
  `mountain` int(11) DEFAULT NULL,
  `train` int(11) DEFAULT NULL,
  `seichi` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `preference_mock`
--

INSERT INTO `preference_mock` (`id`, `spot_name`, `temple`, `natural`, `history`, `lake`, `castle`, `museum`, `market`, `mountain`, `train`, `seichi`, `createdAt`, `updatedAt`) VALUES
(1, 'mock_temple', 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL),
(2, 'mock_natural', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, '2016-01-11 18:19:06', '2016-09-28 17:31:45'),
(3, 'mock_history', 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, '2016-10-16 09:23:06', '2016-03-25 06:37:17'),
(4, 'mock_lake', 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, '2016-01-12 15:18:49', '2015-11-28 19:04:40'),
(5, 'mock_castle', 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, '2016-03-12 10:35:19', '2015-12-08 18:48:23'),
(6, 'mock_museum', 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, '2016-07-31 03:26:37', '2015-12-08 14:28:04'),
(7, 'mock_market', 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, '2016-08-30 09:42:07', '2016-05-20 02:23:45'),
(8, 'mock_mountain', 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, '2016-01-08 10:57:14', '2016-01-04 11:02:51'),
(9, 'mock_train', 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, NULL, NULL),
(10, 'mock_seichi', 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, NULL, NULL),
(11, 'Klina', 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, NULL, NULL),
(12, 'Peñaflor', 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, NULL, NULL),
(13, 'Yaotian', 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, NULL, NULL),
(14, 'Ząbkowice Śląskie', 0, 1, 0, 1, 1, 1, 0, 0, 1, 1, NULL, NULL),
(15, 'Lemery', 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, NULL, NULL),
(16, 'Junqueiro', 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, NULL, NULL),
(17, 'Meru', 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, NULL, NULL),
(18, 'Iguape', 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, NULL, NULL),
(19, 'Ngoc Hon Doc', 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, NULL, NULL),
(20, 'Guaíba', 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, NULL, NULL),
(21, 'Setanggor', 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, NULL, NULL),
(22, 'Lanci Satu', 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, NULL, NULL),
(23, 'Bocaiúva', 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, NULL, NULL),
(24, 'El Hamma', 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, NULL, NULL),
(25, 'Pio Duran', 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, NULL, NULL),
(26, 'Norrköping', 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, NULL, NULL),
(27, 'Retreat', 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, NULL, NULL),
(28, 'Petrodvorets', 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, NULL, NULL),
(29, 'Pasarnangka', 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, NULL, NULL),
(30, 'Zhitang', 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, NULL, NULL),
(31, 'Safonovo', 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, NULL, NULL),
(32, 'Changmaoling', 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, NULL, NULL),
(33, 'Pécs', 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, NULL, NULL),
(34, 'Ijuí', 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, NULL, NULL),
(35, 'Mufumbwe', 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, NULL, NULL),
(36, 'Zyuzino', 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, NULL, NULL),
(37, 'Kanye', 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, NULL, NULL),
(38, 'Taiping', 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, NULL, NULL),
(39, 'Nkongsamba', 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, NULL, NULL),
(40, 'Trostyanets’', 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, NULL, NULL),
(41, 'Zarzis', 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, NULL, NULL),
(42, 'Kebonjaya', 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, NULL, NULL),
(43, 'Dongshan', 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, NULL, NULL),
(44, 'Alannay', 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, NULL, NULL),
(45, 'Uttaradit', 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, NULL, NULL),
(46, 'San Jose', 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, NULL, NULL),
(47, 'San Andres', 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, NULL, NULL),
(48, 'Dukay', 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, NULL, NULL),
(49, 'Nova Friburgo', 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, NULL, NULL),
(50, 'Lipu', 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, NULL, NULL),
(51, 'Qingtong', 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, NULL, NULL),
(52, 'Hengli', 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, NULL, NULL),
(53, 'Parang', 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, NULL, NULL),
(54, 'Karak City', 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, NULL, NULL),
(55, 'L’govskiy', 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, NULL, NULL),
(56, 'Jagupit', 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, NULL, NULL),
(57, 'Goléré', 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, NULL, NULL),
(58, 'Sterlitamak', 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, NULL, NULL),
(59, 'Azeitão', 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, NULL, NULL),
(60, 'Barentu', 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, NULL, NULL),
(61, 'Bayt Yāshūţ', 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, NULL, NULL),
(62, 'Cirangga Kidul', 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, NULL, NULL),
(63, 'Yilan', 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, NULL, NULL),
(64, 'Tembladera', 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, NULL, NULL),
(65, 'Neuilly-sur-Marne', 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, NULL, NULL),
(66, 'Le Mans', 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, NULL, NULL),
(67, 'Kuala Lumpur', 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, NULL, NULL),
(68, 'Vrdy', 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, NULL, NULL),
(69, 'Corinto', 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, NULL, NULL),
(70, 'San Juan de Limay', 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, NULL, NULL),
(71, 'Twante', 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, NULL, NULL),
(72, 'Feilaixia', 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, NULL, NULL),
(73, 'Oropesa', 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, NULL, NULL),
(74, 'Staropyshminsk', 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, NULL, NULL),
(75, 'Vil’nyans’k', 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, NULL, NULL),
(76, 'Baolong', 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, NULL, NULL),
(77, 'Manalongon', 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, NULL, NULL),
(78, 'Baiyang', 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, NULL, NULL),
(79, 'Jiangya', 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, NULL, NULL),
(80, 'Muarasiau', 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, NULL, NULL),
(81, 'Ar Ruţbah', 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, NULL, NULL),
(82, 'Tegina', 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, NULL, NULL),
(83, 'Ntoke', 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, NULL, NULL),
(84, 'Duas Igrejas', 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, NULL, NULL),
(85, 'Amirdzhan', 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, NULL, NULL),
(86, 'Monkey Hill', 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, NULL, NULL),
(87, 'Nenotes', 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, NULL, NULL),
(88, 'Inčukalns', 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, NULL, NULL),
(89, 'Vitry-sur-Seine', 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, NULL, NULL),
(90, 'Xingtai', 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, NULL, NULL),
(91, 'Samagaltay', 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, NULL, NULL),
(92, 'Mitrópoli', 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, NULL, NULL),
(93, 'Pa Mok', 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, NULL, NULL),
(94, 'Néa Tríglia', 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, NULL, NULL),
(95, 'Przybyszówka', 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, NULL, NULL),
(96, 'Taiping', 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, NULL, NULL),
(97, 'Sundsvall', 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, NULL, NULL),
(98, 'Umbuldamar', 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, NULL, NULL),
(99, 'Ōkawa', 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, NULL, NULL),
(100, 'Nowy Korczyn', 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `rate`
--

CREATE TABLE `rate` (
  `id` int(10) UNSIGNED NOT NULL,
  `spot_name` varchar(100) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `tag` varchar(100) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `rate`
--

INSERT INTO `rate` (`id`, `spot_name`, `score`, `tag`, `createdAt`, `updatedAt`) VALUES
(1, 'enryaku_temple', 2, 'spring', NULL, '2016-09-27 15:00:46'),
(2, 'omi_shrine', 5, 'spring', NULL, '2016-09-27 15:00:46'),
(3, 'ishiyama_temple', 0, 'spring', NULL, '2016-09-27 15:00:46'),
(4, 'hikone', 7, 'spring', NULL, '2016-09-27 15:00:46');

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

CREATE TABLE `room` (
  `status` varchar(100) DEFAULT NULL,
  `id` int(10) UNSIGNED NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `test`
--

CREATE TABLE `test` (
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `id` int(10) UNSIGNED NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `text`
--

CREATE TABLE `text` (
  `id` int(10) UNSIGNED NOT NULL,
  `text` varchar(300) DEFAULT NULL,
  `bot` varchar(300) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `text`
--

INSERT INTO `text` (`id`, `text`, `bot`, `createdAt`, `updatedAt`) VALUES
(9, 'ss', 'not understand', '2016-06-27 21:56:12', '2016-06-27 21:56:12'),
(10, 'Hello', 'Good Morning', '2016-06-27 21:56:16', '2016-06-27 21:56:16');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(200) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `email`, `createdAt`, `updatedAt`) VALUES
(1, 'endopasmic', '00236263', 'chinghaha1@hotmail.com', '2016-10-13 15:32:55', '2016-10-13 15:32:55'),
(2, 'endopasmic', '00236263', 'chinghaha1@hotmail.com', '2016-10-13 15:33:36', '2016-10-13 15:33:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `debug`
--
ALTER TABLE `debug`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `log`
--
ALTER TABLE `log`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `person`
--
ALTER TABLE `person`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `preference`
--
ALTER TABLE `preference`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `preference_mock`
--
ALTER TABLE `preference_mock`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rate`
--
ALTER TABLE `rate`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `test`
--
ALTER TABLE `test`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `text`
--
ALTER TABLE `text`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chat`
--
ALTER TABLE `chat`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `debug`
--
ALTER TABLE `debug`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `log`
--
ALTER TABLE `log`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `message`
--
ALTER TABLE `message`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `person`
--
ALTER TABLE `person`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `preference`
--
ALTER TABLE `preference`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=109;
--
-- AUTO_INCREMENT for table `preference_mock`
--
ALTER TABLE `preference_mock`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;
--
-- AUTO_INCREMENT for table `rate`
--
ALTER TABLE `rate`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `room`
--
ALTER TABLE `room`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `test`
--
ALTER TABLE `test`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `text`
--
ALTER TABLE `text`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
