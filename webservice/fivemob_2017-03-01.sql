# ************************************************************
# Sequel Pro SQL dump
# Versão 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.6.28)
# Base de Dados: fivemob
# Tempo de Geração: 2017-03-01 17:22:12 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump da tabela formats
# ------------------------------------------------------------

DROP TABLE IF EXISTS `formats`;

CREATE TABLE `formats` (
  `id_format` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `slug` varchar(100) DEFAULT NULL,
  `status` tinyint(2) DEFAULT '1',
  PRIMARY KEY (`id_format`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `formats` WRITE;
/*!40000 ALTER TABLE `formats` DISABLE KEYS */;

INSERT INTO `formats` (`id_format`, `name`, `slug`, `status`)
VALUES
	(1,'Locação','locacao',1),
	(2,'Venda','venda',1),
	(3,'Comercial','comercial',1),
	(4,'Residencial','residencial',1);

/*!40000 ALTER TABLE `formats` ENABLE KEYS */;
UNLOCK TABLES;


# Dump da tabela properties
# ------------------------------------------------------------

DROP TABLE IF EXISTS `properties`;

CREATE TABLE `properties` (
  `id_propertie` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `id_user` int(11) DEFAULT NULL,
  `client_name` varchar(250) DEFAULT '',
  `client_email` varchar(100) DEFAULT NULL,
  `client_phone` varchar(50) DEFAULT NULL,
  `hide_client` tinyint(2) DEFAULT NULL,
  `title` varchar(250) DEFAULT '',
  `description` text,
  `street` varchar(250) DEFAULT '',
  `number` varchar(50) DEFAULT NULL,
  `complement` varchar(150) DEFAULT NULL,
  `neighborhood` varchar(250) DEFAULT NULL,
  `city` varchar(250) DEFAULT NULL,
  `state` varchar(250) DEFAULT NULL,
  `zipcode` varchar(10) DEFAULT NULL,
  `format` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `m_util` varchar(100) DEFAULT NULL,
  `m_total` varchar(100) DEFAULT NULL,
  `bedrooms` int(11) DEFAULT NULL,
  `rooms` int(11) DEFAULT NULL,
  `kitchens` int(11) DEFAULT NULL,
  `bathrooms` int(11) DEFAULT NULL,
  `suites` int(11) DEFAULT NULL,
  `vacancies` int(11) DEFAULT NULL,
  `washbasins` int(11) DEFAULT NULL,
  `services_areas` int(11) DEFAULT NULL,
  `housekeepers` int(11) DEFAULT NULL,
  `offices` int(11) DEFAULT NULL,
  `grills` int(11) DEFAULT NULL,
  `backyards` int(11) DEFAULT NULL,
  `closets` int(11) DEFAULT NULL,
  `furnitures` int(11) DEFAULT NULL,
  `edicules` int(11) DEFAULT NULL,
  `rental_value` varchar(100) DEFAULT NULL,
  `sale_value` varchar(100) DEFAULT NULL,
  `iptu_value` varchar(100) DEFAULT NULL,
  `subway` tinyint(2) DEFAULT NULL,
  `schools` tinyint(2) DEFAULT NULL,
  `bus_stations` tinyint(2) DEFAULT NULL,
  `hospitals` tinyint(2) DEFAULT NULL,
  `markets` tinyint(2) DEFAULT NULL,
  `backeries` tinyint(2) DEFAULT NULL,
  `airports` tinyint(2) DEFAULT NULL,
  `roads` tinyint(2) DEFAULT NULL,
  `shoppings` tinyint(2) DEFAULT NULL,
  `condominium_name` varchar(250) DEFAULT NULL,
  `recreation_area` tinyint(2) DEFAULT NULL,
  `party_room` tinyint(2) DEFAULT NULL,
  `sport_court` tinyint(2) DEFAULT NULL,
  `gym` tinyint(2) DEFAULT NULL,
  `concierge` tinyint(2) DEFAULT NULL,
  `steam_room` tinyint(2) DEFAULT NULL,
  `garden` tinyint(2) DEFAULT NULL,
  `laundry` tinyint(2) DEFAULT NULL,
  `balcony` tinyint(2) DEFAULT NULL,
  `pool` tinyint(2) DEFAULT NULL,
  `gourmet` tinyint(2) DEFAULT NULL,
  `cold_floor` tinyint(2) DEFAULT NULL,
  `laminate_floor` tinyint(2) DEFAULT NULL,
  `porcelain_floor` tinyint(2) DEFAULT NULL,
  `wood_floor` tinyint(2) DEFAULT NULL,
  `large_airy` tinyint(2) DEFAULT NULL,
  `great_location` tinyint(2) DEFAULT NULL,
  `big_comfy` tinyint(2) DEFAULT NULL,
  `new` tinyint(2) DEFAULT NULL,
  `good_lighting` tinyint(2) DEFAULT NULL,
  `publish_imovelweb` tinyint(2) DEFAULT NULL,
  `publish_olx` tinyint(2) DEFAULT NULL,
  `publish_topcasas` tinyint(2) DEFAULT NULL,
  `publish_bomnegocio` tinyint(2) DEFAULT NULL,
  `publish_webcasas` tinyint(2) DEFAULT NULL,
  `publish_zapimoveis` tinyint(2) DEFAULT NULL,
  `publish_vivareal` tinyint(2) DEFAULT NULL,
  `status` tinyint(2) DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id_propertie`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump da tabela sessions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `sessions`;

CREATE TABLE `sessions` (
  `id_session` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `id_user` int(11) DEFAULT NULL,
  `token` text,
  `login_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id_session`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump da tabela types
# ------------------------------------------------------------

DROP TABLE IF EXISTS `types`;

CREATE TABLE `types` (
  `id_type` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `slug` varchar(100) DEFAULT NULL,
  `status` tinyint(2) DEFAULT '1',
  PRIMARY KEY (`id_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `types` WRITE;
/*!40000 ALTER TABLE `types` DISABLE KEYS */;

INSERT INTO `types` (`id_type`, `name`, `slug`, `status`)
VALUES
	(1,'Casa Térrea','terrea',1),
	(2,'Sobrado','sobrado',1),
	(3,'Apartamento','apartamento',1),
	(4,'Sala Comercial','sala',1),
	(5,'Galpão','galpao',1);

/*!40000 ALTER TABLE `types` ENABLE KEYS */;
UNLOCK TABLES;


# Dump da tabela users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id_user` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` text,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `admin` tinyint(2) DEFAULT '0',
  `realtor` tinyint(2) DEFAULT '0',
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id_user`, `name`, `email`, `password`, `created_at`, `admin`, `realtor`)
VALUES
	(1,'Alamo Saravali','alamo@alamoweb.com.br','94960ae736625be974796f53c43c3d2caea1783e','2017-01-01 00:00:00',1,1);

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
