-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 02, 2024 at 02:30 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vacation_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `follows`
--

CREATE TABLE `follows` (
  `user_id` int(11) NOT NULL,
  `vacation_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `follows`
--

INSERT INTO `follows` (`user_id`, `vacation_id`) VALUES
(22, 30),
(22, 32),
(22, 37),
(22, 40),
(22, 41),
(23, 31),
(23, 33),
(23, 37),
(23, 40),
(23, 41),
(24, 31),
(24, 34),
(24, 35),
(24, 38),
(24, 39),
(24, 40),
(24, 41);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` char(60) NOT NULL,
  `role` enum('admin','user') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `role`) VALUES
(21, 'admin', 'admin', 'admin@admin.com', '$2a$10$.9adFfxjD9wV7Nv5PPIDtuZQa47y0hT7bf1qT5RU48V7RoOLaf.be', 'admin'),
(22, 'Test', 'User', 'test@user.com', '$2a$10$SGcfLTX1sHwiFx5R00UF6e3iSrf5sCF8rHXJm129YsfOc0bleYU2K', 'user'),
(23, 'John', 'Johnson', 'john@john.com', '$2a$10$CPDg5IScJPYzDjp0wmQtXetQuYxkgSTmALzlGUoP1eCF9vLth/rhq', 'user'),
(24, 'Cohen', 'Cohen', 'cohen@cohen.cohen', '$2a$10$GEWBGRb1pwKxw1l5E6JJjOhrMeRtetRKwjNw08MTnTE90sCx5EC8O', 'user');

-- --------------------------------------------------------

--
-- Table structure for table `vacations`
--

CREATE TABLE `vacations` (
  `id` int(11) NOT NULL,
  `destination` varchar(255) NOT NULL,
  `description` varchar(2056) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `price` int(10) UNSIGNED NOT NULL,
  `image_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vacations`
--

INSERT INTO `vacations` (`id`, `destination`, `description`, `start_date`, `end_date`, `price`, `image_name`) VALUES
(30, 'Paris', 'Paris ipsum odor amet, consectetuer adipiscing elit. Libero sociosqu eu neque posuere lacinia maximus. Sociosqu tempus ad habitasse mauris non sit. Risus fames penatibus ridiculus elit; finibus ex luctus. Platea quis montes cursus habitant posuere proin varius sollicitudin efficitur. Laoreet venenatis interdum ullamcorper semper elit facilisis leo tempor. Commodo sollicitudin posuere consequat id, bibendum maecenas nullam. Hac hendrerit nullam metus per fames.', '2024-12-01', '2024-12-20', 6500, 'db27f9799304aa911724fa301.usnews.jpg'),
(31, 'Tokyo', 'Tokyo etiam nostra eros luctus mollis fames nostra. Class dignissim class scelerisque iaculis enim malesuada tristique. Cras phasellus ullamcorper morbi porttitor nisl justo sagittis nullam. Aliquet luctus nullam ante ac fermentum imperdiet dui. Velit natoque quam curae venenatis pretium nibh platea. Cras tellus potenti arcu senectus, fusce lacinia suscipit.', '2026-11-30', '2026-12-30', 8000, 'db27f9799304aa911724fa302.usnews.jpg'),
(32, 'Costa Rica ', 'Costa Rica commodo ad sit et egestas nisl inceptos tellus senectus. Ac aenean nam nibh maximus vulputate fusce etiam. Fames congue magna pellentesque torquent cubilia imperdiet urna. Justo nec sagittis ante ornare scelerisque class quis. Viverra quam est ac et parturient. Sed volutpat dictum gravida nullam dapibus vehicula mattis vel. Primis condimentum ornare cubilia sit cubilia lectus volutpat.', '2025-03-10', '2025-03-31', 4000, 'db27f9799304aa911724fa303.usnews.jpg'),
(33, 'Taihiti', 'Taihiti nisl cubilia sem nascetur inceptos sit. Amet pellentesque risus nisl nisl nam ultricies. Mattis ut viverra primis eros vulputate pulvinar hendrerit massa porttitor. Alitora arcu id cubilia, in dui. Velit pulvinar molestie ligula consequat mollis pellentesque venenatis ligula nullam. Platea purus mauris integer arcu dictum aenean arcu enim. Elit facilisi auctor semper, mi cubilia est.', '2025-06-30', '2025-07-06', 3200, 'db27f9799304aa911724fa304.usnews.jpg'),
(34, 'Sydney', 'Sydney congue pharetra cursus placerat primis sollicitudin dignissim. Iaculis id mi cubilia turpis hendrerit interdum habitant primis. Praesent curabitur risus; feugiat habitasse ante lobortis nunc sociosqu. At senectus dictum ullamcorper; interdum urna enim himenaeos vivamus felis. Nascetur malesuada tempus habitasse lectus dui; inceptos penatibus elementum class? Montes aptent feugiat mattis ridiculus velit fusce quis eros. Vel orci mi sociosqu dapibus feugiat rutrum nibh aliquet.', '2025-02-02', '2025-02-25', 7000, 'db27f9799304aa911724fa305.usnews.jpg'),
(35, 'New York', 'New York nisl mollis finibus arcu dictum. Mi cras magna vehicula nullam fames orci bibendum. Tortor potenti condimentum placerat congue efficitur nibh. Vitae aliquam pharetra condimentum ultricies at, elit luctus. Congue libero lectus tempor; sapien congue etiam? Scelerisque erat consequat dolor ullamcorper vel ante tortor ullamcorper. Sagittis fermentum commodo quis pharetra, sagittis duis amet.', '2024-12-24', '2024-12-30', 9000, 'db27f9799304aa911724fa306.usnews.jpg'),
(36, 'Hawaii', 'Hawaii ridiculus cursus cras hendrerit orci nunc nostra mauris. Sagittis ullamcorper nulla vitae pharetra ridiculus ut. Interdum augue posuere aliquam convallis cursus dignissim. Et nec netus risus varius ante parturient. Venenatis orci scelerisque condimentum sagittis congue vivamus erat vel. Lectus morbi lacinia nullam ultricies imperdiet; hac luctus euismod. Montes porta in nascetur massa nunc condimentum integer. Felis molestie placerat cursus, consectetur ultrices efficitur etiam arcu.', '2024-12-27', '2024-12-30', 9500, 'db27f9799304aa911724fa307.jpg'),
(37, 'Maldives', 'Maldives habitasse ornare penatibus adipiscing iaculis ultricies. Donec proin elit platea dictum non magnis. Cras vulputate accumsan aenean accumsan in himenaeos quam. Commodo maecenas ante mi ultrices, lacinia himenaeos ut libero. Elementum lacinia luctus vel, sapien volutpat mi semper cubilia. Diam purus justo odio bibendum senectus class, auctor auctor gravida. Hac pulvinar interdum morbi eget diam at. Dictum inceptos eleifend eget eleifend conubia laoreet morbi dolor.', '2025-04-29', '2025-06-25', 4700, 'db27f9799304aa911724fa308.jpg'),
(38, 'Jerusalem', 'Jerusalem sed praesent auctor dui aliquet aptent semper sodales maximus. Viverra ultrices dictumst venenatis ante hendrerit sagittis curabitur elit. Hendrerit massa nostra auctor praesent orci varius lacinia. Arcu litora vivamus ridiculus vel et nec. Congue in maecenas eu in blandit dolor. Nec sociosqu tristique pulvinar dapibus cubilia tincidunt, donec consectetur magnis. Suspendisse platea per habitant tristique nisi; ridiculus egestas. Vel rutrum sapien netus quam a.', '2025-02-11', '2025-05-20', 2000, 'db27f9799304aa911724fa309.jpg'),
(39, 'Haifa', 'Please visit Haifa', '2024-12-23', '2025-01-08', 1, 'db27f9799304aa911724fa30a.jpg'),
(40, 'Barcelona', 'Barcelona amet porta neque aliquam consectetur ligula. Ipsum leo consectetur magnis, quis per nascetur suscipit taciti mollis. Leo suscipit curae habitant etiam eleifend. Volutpat nunc nam lacus potenti eros nec platea? Eget ligula vestibulum laoreet nulla egestas pretium. Aptent quis inceptos ultrices bibendum bibendum. Mi eleifend eleifend ridiculus facilisis tristique morbi blandit; ut dolor. Senectus fringilla bibendum parturient bibendum porttitor finibus.', '2024-12-01', '2025-06-24', 5500, 'db27f9799304aa911724fa30b.jpg'),
(41, 'Rome', 'Roma quisque nisi tortor lectus ipsum. Fusce pretium parturient dapibus mauris aliquet praesent fermentum. Gravida lacinia posuere praesent vel iaculis sagittis augue euismod. Donec rutrum consectetur consequat nam in lectus. Facilisis feugiat elit a fames dapibus, nullam eu mi. Curabitur vitae rhoncus adipiscing finibus in maximus donec consectetur habitant.', '2024-12-10', '2025-11-11', 10000, 'db27f9799304aa911724fa30c.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `follows`
--
ALTER TABLE `follows`
  ADD PRIMARY KEY (`user_id`,`vacation_id`),
  ADD KEY `vacation_id` (`vacation_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `vacations`
--
ALTER TABLE `vacations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `vacations`
--
ALTER TABLE `vacations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `follows`
--
ALTER TABLE `follows`
  ADD CONSTRAINT `follows_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `follows_ibfk_2` FOREIGN KEY (`vacation_id`) REFERENCES `vacations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
