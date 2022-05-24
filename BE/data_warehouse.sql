SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE data_warehouse;

use data_warehouse;

CREATE TABLE `channels` (
  `channel_id` int(3) NOT NULL,
  `channel_name` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `channels` (`channel_id`, `channel_name`) VALUES
(1, 'Teléfono'),
(2, 'Whatsapp'),
(3, 'Instagram'),
(4, 'Facebook'),
(5, 'Linkedin');


CREATE TABLE `cities` (
  `city_id` int(5) NOT NULL,
  `country_id` int(3) NOT NULL,
  `city_name` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `cities` (`city_id`, `country_id`, `city_name`) VALUES
(1, 1, 'Buenos Aires'),
(2, 1, 'Córdoba'),
(3, 1, 'Rosario'),
(4, 2, 'Bogotá'),
(5, 2, 'Cúcuta'),
(6, 2, 'Medellín'),
(7, 3, 'Atacama'),
(8, 3, 'Santiago'),
(9, 3, 'Valparaíso'),
(10, 4, 'Canelones'),
(11, 4, 'Maldonado'),
(12, 4, 'Montevideo'),
(13, 5, 'Ciudad de México'),
(14, 5, 'Tijuana'),
(15, 6, 'Florida'),
(16, 6, 'Texas');


CREATE TABLE `companies` (
  `company_id` int(3) NOT NULL,
  `company_name` varchar(64) NOT NULL,
  `city_id` int(3) NOT NULL,
  `address` varchar(64) NOT NULL,
  `email` varchar(64) DEFAULT NULL,
  `telephone` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `companies` (`company_id`, `company_name`, `city_id`, `address`, `email`, `telephone`) VALUES
(1, 'Acámica', 1, 'Humboldt 1967', 'hola@acamica.com', '540112345678'),
(2, 'Globant', 3, 'Av. Madres Plaza de Mayo 3020', 'hi@globant.com', '540341234567'),
(3, 'Gryffindor', 2, 'Sarmiento 1234', 'gryffindor@gmail.com', '540351456789'),
(4, 'Slytherin ', 4, 'Pasco 123', 'slytherin@yahoo.com', '57123456789'),
(5, 'Ravenclaw', 16, 'Pedernera 4567', 'ravenclaw@gmail.com', '1830123456789'),
(6, 'Hufflepuff ', 12, 'Pellegrini 3456', 'hufflepuff@gmail.com', '598234567890');


CREATE TABLE `contacts` (
  `contact_id` int(3) NOT NULL,
  `firstname` varchar(64) NOT NULL,
  `lastname` varchar(64) NOT NULL,
  `email` varchar(64) NOT NULL,
  `city_id` int(5) NOT NULL,
  `company_id` int(3) NOT NULL,
  `position` varchar(32) NOT NULL,
  `interest` int(3) NOT NULL,
  `address` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `contacts` (`contact_id`, `firstname`, `lastname`, `email`, `city_id`, `company_id`, `position`, `interest`, `address`) VALUES
(1, 'Severus', 'Snape', 'severussnape@gmail.com', 14, 4, 'Dark Arts', 100, 'Mitre 3355'),
(2, 'Hermione', 'Granger', 'hermionegranger@yahoo.com', 13, 3, 'Witch', 100, 'San Martín 456'),
(3, 'Harry', 'Potter', 'harrypotter@gmail.com', 8, 3, 'Wizard', 50, 'España 7768'),
(4, 'Ronald', 'Weasley', 'ronaldweasley@gmail.com', 1, 3, 'Wizard', 50, 'Italia 2367'),
(5, 'Albus', 'Dumbledore', 'albusdumbledore@yahoo.com', 12, 3, 'Headmaster', 75, 'Balcarce 567'),
(6, 'Cedric', 'Diggory', 'cedricdiggory@gmail.com', 2, 6, 'Wizard', 25, 'Moreno 980'),
(7, 'Luna', 'Lovegood', 'lunalovegood@gmail.com', 3, 5, 'Witch', 75, 'Maipú 2136'),
(8, 'Bellatrix', 'Lestrange', 'bellatrixlestrange@gmail.com', 1, 4, 'Witch', 0, 'Pasco 3245'),
(9, 'Draco', 'Malfoy', 'dmalfoy@acamica.com', 6, 1, 'Wizard', 0, 'Ayacucho 1987'),
(10, 'Lord', 'Voldemort', 'lordvoldemort@globant.com', 16, 2, 'Wizard', 25, 'Cochabamba 1531'),
(11, 'Rubeus', 'Hagrid', 'hagrid@globant.com', 2, 2, 'Wizard', 100, 'Montevideo 2654'),
(12, 'Minerva', 'McGonagall', 'minervamcgonagall@acamica.com', 7, 1, 'Transfiguration', 75, 'Mendoza 2105'),
(13, 'Neville', 'Longbottom', 'nevillelongbottom@gryffindor.com', 11, 3, 'Wizard', 75, 'Entre Ríos 1920'),
(14, 'Sirius', 'Black', 'siriusblack@acamica.com', 6, 1, 'Wizard', 75, 'Pescio 2106'),
(15, 'Dolores', 'Umbridge', 'doloresumbridge@slytherin.com', 14, 4, 'Witch', 50, 'La Paz'),
(16, 'Narcissa', 'Malfoy', 'narcissamalfoy@slytherin.com', 15, 4, 'Witch', 0, 'Córdoba 1453');


CREATE TABLE `contacts_channels` (
  `contact_id` int(3) NOT NULL,
  `channel_id` int(3) NOT NULL,
  `user_account` varchar(64) NOT NULL,
  `preference` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `contacts_channels` (`contact_id`, `channel_id`, `user_account`, `preference`) VALUES
(0, 0, '', NULL),
(2, 1, '52554567777', 'Canal favorito'),
(3, 3, '@harrypotter', 'No molestar'),
(3, 5, 'https://www.linkedin.com/in/harrypotter', 'Canal favorito'),
(4, 1, '54114563336', 'Canal favorito'),
(4, 4, 'https://www.facebook.com/ronweasley', 'Sin preferencia'),
(5, 1, '598234567655', 'Canal favorito'),
(6, 2, '543515678457', 'No molestar'),
(7, 1, '543415567433', 'Canal favorito'),
(8, 1, '54115654766', 'No molestar'),
(8, 3, '@bellatrixlestrange', 'Sin preferencia'),
(9, 1, '57123456789', 'Canal favorito'),
(10, 3, '@lordvoldemort', 'Canal favorito'),
(11, 1, '54351432334', 'Sin preferencia'),
(11, 2, '543515678435', 'Canal favorito'),
(12, 3, '@minervamcgonagall', 'No molestar'),
(12, 5, 'https://www.linkedin.com/in/harrypotter', 'Canal favorito'),
(13, 3, '@nevillelongbottom', 'No molestar'),
(13, 5, 'https://www.linkedin.com/in/nevillelongbottom', 'Canal favorito'),
(14, 2, '5724567435', 'Canal favorito'),
(14, 3, '@siriusblack', 'Sin preferencia'),
(15, 1, '5255568964', 'No molestar'),
(15, 2, '5255345343', 'No molestar'),
(15, 3, '@doloresumbridge', 'No molestar'),
(15, 4, 'https://www.facebook.com/doloresumbridge', 'No molestar'),
(15, 5, 'https://www.linkedin.com/in/doloresumbridge', 'No molestar'),
(16, 3, '@narcissamalfoy', 'No molestar');


CREATE TABLE `countries` (
  `country_id` int(3) NOT NULL,
  `region_id` int(3) NOT NULL,
  `country_name` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `countries` (`country_id`, `region_id`, `country_name`) VALUES
(1, 1, 'Argentina'),
(2, 1, 'Colombia'),
(3, 1, 'Chile'),
(4, 1, 'Uruguay'),
(5, 2, 'México'),
(6, 2, 'Estados Unidos');


CREATE TABLE `regions` (
  `region_id` int(3) NOT NULL,
  `region_name` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `regions` (`region_id`, `region_name`) VALUES
(1, 'Sudamérica'),
(2, 'Norteamérica');


CREATE TABLE `users` (
  `user_id` int(3) NOT NULL,
  `firstname` varchar(64) NOT NULL,
  `lastname` varchar(64) NOT NULL,
  `email` varchar(65) NOT NULL,
  `perfil` enum('Admin','Básico') NOT NULL DEFAULT 'Básico',
  `password` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `users` (`user_id`, `firstname`, `lastname`, `email`, `perfil`, `password`) VALUES
(1, 'Daniel', 'Betancur', 'danielbetancur@ingenieros.com', 'Admin', '1234'),
(2, 'Olivia', 'Dichiara', 'olivia@hotmail.com', 'Básico', '5678'),
(3, 'Gustavo ', 'Elias', 'gaelias@yahoo.com', 'Básico', '123a'),
(4, 'Alejandro', 'Trobianni', 'aletrobbiani@hotmail.com', 'Básico', '123a');

ALTER TABLE `channels`
  ADD PRIMARY KEY (`channel_id`);

ALTER TABLE `cities`
  ADD PRIMARY KEY (`city_id`),
  ADD KEY `cities_ibfk_1` (`country_id`);

ALTER TABLE `companies`
  ADD PRIMARY KEY (`company_id`),
  ADD KEY `city_id` (`city_id`);

ALTER TABLE `contacts`
  ADD PRIMARY KEY (`contact_id`),
  ADD KEY `city_id` (`city_id`),
  ADD KEY `company_id` (`company_id`);

ALTER TABLE `contacts_channels`
  ADD PRIMARY KEY (`contact_id`,`channel_id`),
  ADD KEY `channel_id` (`channel_id`);

ALTER TABLE `countries`
  ADD PRIMARY KEY (`country_id`),
  ADD KEY `countries_ibfk_1` (`region_id`);

ALTER TABLE `regions`
  ADD PRIMARY KEY (`region_id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

ALTER TABLE `channels`
  MODIFY `channel_id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `cities`
  MODIFY `city_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

ALTER TABLE `companies`
  MODIFY `company_id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

ALTER TABLE `contacts`
  MODIFY `contact_id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

ALTER TABLE `countries`
  MODIFY `country_id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

ALTER TABLE `regions`
  MODIFY `region_id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `users`
  MODIFY `user_id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;
