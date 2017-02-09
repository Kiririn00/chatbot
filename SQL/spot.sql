-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 08, 2017 at 05:16 PM
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
-- Table structure for table `spot`
--

CREATE TABLE `spot` (
  `spot_id` int(10) UNSIGNED NOT NULL,
  `spot_name` varchar(100) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `spot`
--

INSERT INTO `spot` (`spot_id`, `spot_name`, `createdAt`, `updatedAt`) VALUES
(1, 'ミシガンクルーズ', NULL, NULL),
(2, '草津宿本陣', NULL, NULL),
(3, '水茎焼陶芸の里', NULL, NULL),
(4, '忍術村', NULL, NULL),
(5, 'びわこ花噴水', NULL, NULL),
(6, '安土城跡', NULL, NULL),
(7, '近江八幡和船観光協同組合', NULL, NULL),
(8, '石山寺', NULL, NULL),
(9, '安土城天主 信長の館', NULL, NULL),
(10, '醒井宿', NULL, NULL),
(11, '彦根城', NULL, NULL),
(12, 'MIHO MUSEUM', NULL, NULL),
(13, '黒壁スクエア', NULL, NULL),
(14, '比叡山延暦寺', NULL, NULL),
(15, '琵琶湖', NULL, NULL),
(16, '竹生島', NULL, NULL),
(17, '園城寺', NULL, NULL),
(18, '水口城', NULL, NULL),
(19, '八幡堀', NULL, NULL),
(20, '豊公園', NULL, NULL),
(21, '八幡山城', NULL, NULL),
(22, '箱館山スキー場', NULL, NULL),
(23, '奥伊吹スキー場', NULL, NULL),
(24, '矢橋帰帆島公園', NULL, NULL),
(25, 'メタセコイア並木', NULL, NULL),
(26, '海洋堂フィギュアミュージアム黒壁', NULL, NULL),
(27, '宝厳寺', NULL, NULL),
(28, '滋賀県希望が丘文化公園', NULL, NULL),
(29, '瀬田の唐橋', NULL, NULL),
(30, '比叡山ドライブウェイ', NULL, NULL),
(31, '矢橋帰帆島公園', NULL, NULL),
(32, 'イオンモール草津', NULL, NULL),
(33, 'びわ湖バレイ', NULL, NULL),
(34, 'たぬき村', NULL, NULL),
(35, '豊郷小学校', NULL, NULL),
(36, '金剛輪寺', NULL, NULL),
(37, 'キリンビール(株)滋賀工場', NULL, NULL),
(38, 'ひこねスカイアドベンチャー', NULL, NULL),
(39, '長浜城', NULL, NULL),
(40, 'ヤンマーミュージアム', NULL, NULL),
(41, '琵琶湖博物館', NULL, NULL),
(42, '木之本地蔵院', NULL, NULL),
(43, '伊吹山ドライブウェイ', NULL, NULL),
(44, '賤ヶ岳古戦場', NULL, NULL),
(45, '立木神社', NULL, NULL),
(46, '水生植物公園みずの森', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `spot`
--
ALTER TABLE `spot`
  ADD PRIMARY KEY (`spot_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `spot`
--
ALTER TABLE `spot`
  MODIFY `spot_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
