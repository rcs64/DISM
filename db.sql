-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         5.0.67-community-nt - MySQL Community Edition (GPL)
-- SO del servidor:              Win32
-- HeidiSQL Versión:             9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Volcando estructura de base de datos para dism
CREATE DATABASE IF NOT EXISTS `dism` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `dism`;

-- Volcando estructura para tabla dism.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `identificador` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `usuario` varchar(50) default NULL,
  `clave` varchar(50) default NULL,
  `isAdmin` int(1) default 0,
  PRIMARY KEY  (`identificador`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `fichajes` (
  `identificador` int NOT NULL auto_increment,
  `fechaHoraEntrada` datetime default NULL,
  `fechaHoraSalida` datetime default NULL,
  `horasTrabajadas` int default NULL,
  `idTrabajo` int default NULL,
  `idUsuario` int default NULL,
  `geoLat` float default NULL,
  `geoLong` float default NULL,
  PRIMARY KEY  (`identificador`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `trabajos` (
  `identificador` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  PRIMARY KEY  (`identificador`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `apikey` (
  `identificador` int NOT NULL auto_increment,
  `key` varchar(50) NOT NULL,
  PRIMARY KEY  (`identificador`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla dism.usuarios: 2 rows
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
/* INSERT INTO `usuarios` (`identificador`, `nombre`, `apellidos`, `clave`) VALUES
	(1, 'Hugo', 'S', '1'),
	(2, 'Estela', 'S', '2'); */
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
