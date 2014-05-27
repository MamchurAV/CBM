CREATE DATABASE  IF NOT EXISTS `cbm` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `cbm`;
-- MySQL dump 10.13  Distrib 5.6.13, for Win32 (x86)
--
-- Host: 127.0.0.1    Database: cbm
-- ------------------------------------------------------
-- Server version	5.5.5-10.0.10-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `actor`
--

DROP TABLE IF EXISTS `actor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `actor` (
  `ID` bigint(20) NOT NULL,
  `WhoIsID` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actor`
--

LOCK TABLES `actor` WRITE;
/*!40000 ALTER TABLE `actor` DISABLE KEYS */;
/*!40000 ALTER TABLE `actor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `actorrole`
--

DROP TABLE IF EXISTS `actorrole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `actorrole` (
  `ID` bigint(20) NOT NULL,
  `ActorID` bigint(20) DEFAULT NULL,
  `RoleID` bigint(20) DEFAULT NULL,
  `Beg` date DEFAULT NULL,
  `End` date DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actorrole`
--

LOCK TABLES `actorrole` WRITE;
/*!40000 ALTER TABLE `actorrole` DISABLE KEYS */;
/*!40000 ALTER TABLE `actorrole` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `anykind`
--

DROP TABLE IF EXISTS `anykind`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `anykind` (
  `ID` bigint(20) NOT NULL,
  `SysCode` varchar(200) DEFAULT NULL,
  `Del` char(1) DEFAULT '0',
  `Concept` bigint(20) DEFAULT NULL,
  `Source` bigint(20) DEFAULT NULL,
  `Parent` bigint(20) DEFAULT NULL,
  `HierCode` varchar(1000) DEFAULT '',
  `Code` varchar(1000) DEFAULT NULL,
  `Description` varchar(2000) DEFAULT NULL,
  `Actual` char(1) DEFAULT '1',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `anykind`
--

LOCK TABLES `anykind` WRITE;
/*!40000 ALTER TABLE `anykind` DISABLE KEYS */;
INSERT INTO `anykind` VALUES (7,'Abstraction','0',1232,17,NULL,'','Abstraction','Abstraction - Information, Knowledge','1'),(9,'PrgComponent','0',116,17,7,'7,','PrgComponent','Programm Component type','1'),(10,'PrgClass','0',14,17,9,'7,9,','PrgClass','Program Class ','1'),(11,'PrgAttribute','0',62,17,9,'7,9,','PrgAttribute','Program Class Attribute','1'),(12,'PrgMenu','0',108,17,9,'7,9,','PrgMenu','Program Menu','1'),(13,'PrgMenuItem','0',109,17,9,'7,9,','PrgMenuItem','Menu Items','1'),(16,'PrgInstallation','0',NULL,17,6872,'6872,','PrgInstallation','PrgInstallation','1'),(6872,'Object','0',1194,17,NULL,'','Object','Solid Object','1'),(6873,'Structure','0',1227,17,NULL,'','Structure','Structural object','1'),(8854,'PrgApplication','0',NULL,17,9,'7,9,','PrgApplication','Application - Single module or even IS','1');
/*!40000 ALTER TABLE `anykind` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `anytemplate`
--

DROP TABLE IF EXISTS `anytemplate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `anytemplate` (
  `ID` bigint(20) NOT NULL,
  `ForKind` bigint(20) DEFAULT NULL,
  `Template` varchar(8000) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='Templates of any kind';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `anytemplate`
--

LOCK TABLES `anytemplate` WRITE;
/*!40000 ALTER TABLE `anytemplate` DISABLE KEYS */;
/*!40000 ALTER TABLE `anytemplate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `basetable_innodb`
--

DROP TABLE IF EXISTS `basetable_innodb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `basetable_innodb` (
  `ID` bigint(20) NOT NULL,
  `UID` char(36) DEFAULT NULL,
  `SysCode` varchar(200) DEFAULT NULL,
  `DEL` char(1) DEFAULT '0',
  `InstallationID` bigint(20) DEFAULT NULL,
  `AnyTypeID` bigint(20) DEFAULT NULL,
  `PrgClassID` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `basetable_innodb`
--

LOCK TABLES `basetable_innodb` WRITE;
/*!40000 ALTER TABLE `basetable_innodb` DISABLE KEYS */;
/*!40000 ALTER TABLE `basetable_innodb` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `basetable_myisam`
--

DROP TABLE IF EXISTS `basetable_myisam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `basetable_myisam` (
  `ID` bigint(20) NOT NULL,
  `UID` char(36) DEFAULT NULL,
  `SysCode` varchar(200) DEFAULT NULL,
  `DEL` char(1) DEFAULT '0',
  `InstallationID` bigint(20) DEFAULT NULL,
  `AnyTypeID` bigint(20) DEFAULT NULL,
  `PrgClassID` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `basetable_myisam`
--

LOCK TABLES `basetable_myisam` WRITE;
/*!40000 ALTER TABLE `basetable_myisam` DISABLE KEYS */;
/*!40000 ALTER TABLE `basetable_myisam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `changekind`
--

DROP TABLE IF EXISTS `changekind`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `changekind` (
  `ID` bigint(20) NOT NULL,
  `SysCode` varchar(200) DEFAULT NULL,
  `Del` char(1) DEFAULT '0',
  `Concept` bigint(20) DEFAULT NULL,
  `Installation` bigint(20) DEFAULT NULL,
  `Parent` bigint(20) DEFAULT NULL,
  `Code` varchar(1000) DEFAULT NULL,
  `Description` varchar(2000) NOT NULL,
  `Actual` char(1) DEFAULT '1',
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `changekind`
--

LOCK TABLES `changekind` WRITE;
/*!40000 ALTER TABLE `changekind` DISABLE KEYS */;
/*!40000 ALTER TABLE `changekind` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `changetype`
--

DROP TABLE IF EXISTS `changetype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `changetype` (
  `ID` bigint(20) NOT NULL,
  `UID` char(36) DEFAULT NULL,
  `SYSCODE` varchar(200) DEFAULT NULL,
  `DEL` char(1) DEFAULT '0',
  `PRGCLASSID` bigint(20) DEFAULT NULL,
  `INSTALLATIONID` bigint(20) DEFAULT NULL,
  `PARENTID` bigint(20) DEFAULT NULL,
  `CODE` varchar(1000) DEFAULT NULL,
  `NAME` varchar(2000) NOT NULL,
  `ACTUAL` char(1) DEFAULT '1',
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `changetype`
--

LOCK TABLES `changetype` WRITE;
/*!40000 ALTER TABLE `changetype` DISABLE KEYS */;
/*!40000 ALTER TABLE `changetype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `concept`
--

DROP TABLE IF EXISTS `concept`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `concept` (
  `ID` bigint(20) NOT NULL,
  `Del` char(1) DEFAULT '0',
  `SysCode` varchar(200) DEFAULT NULL,
  `Concept` bigint(20) DEFAULT '14',
  `BaseConcept` bigint(20) DEFAULT NULL,
  `HierCode` varchar(1000) DEFAULT NULL,
  `Description` varchar(400) DEFAULT NULL,
  `Notes` varchar(4000) DEFAULT NULL,
  `Primitive` char(1) DEFAULT '0',
  `Abstract` char(1) DEFAULT '0',
  `Author` bigint(20) DEFAULT NULL,
  `AbnormalInherit` char(1) DEFAULT '0',
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `concept`
--

LOCK TABLES `concept` WRITE;
/*!40000 ALTER TABLE `concept` DISABLE KEYS */;
INSERT INTO `concept` VALUES (14,'0','ConceptPrgClass',14,116,'4330,1194,1232,116,','Program Class Metadata','Class that provide metadata for programm  class itself','0','0',17,'0'),(18,'0','Integer',14,1236,'4330,1194,1232,1236,','Integer',NULL,'1','0',17,'0'),(20,'0','Bigint',14,1236,'4330,1194,1232,1236,','Big Integer',NULL,'1','0',17,'0'),(22,'0','Decimal',14,1236,'4330,1194,1232,1236,','Decimal',NULL,'1','0',17,'0'),(24,'0','BigDecimal',14,1236,'4330,1194,1232,1236,','Big Decimal',NULL,'1','0',17,'0'),(26,'0','Money',14,22,'4330,1194,1232,1236,22,','Money','Money','1','0',17,'0'),(28,'0','String',14,1236,'4330,1194,1232,1236,','String',NULL,'1','0',17,'0'),(30,'0','ShortString',14,1236,'4330,1194,1232,1236,','Short String888',NULL,'1','0',17,'0'),(32,'0','LongString',14,1236,'4330,1194,1232,1236,','Long String',NULL,'1','0',17,'0'),(34,'0','Text',14,1236,'4330,1194,1232,1236,','Text',NULL,'1','0',17,'0'),(36,'0','Date',14,1236,'4330,1194,1232,1236,','Date',NULL,'1','0',17,'0'),(38,'0','DateTime',14,1236,'4330,1194,1232,1236,','Date Time',NULL,'1','0',17,'0'),(40,'0','TimePrecize',14,1236,'4330,1194,1232,1236,','DateTime Precize',NULL,'1','0',17,'0'),(53,'0','Boolean',14,1236,'4330,1194,1232,1236,','Boolean',NULL,'1','0',17,'0'),(62,'0','RelationPrgAttribute',14,116,'4330,1194,1232,116,','Programm Attributes','Attribute that model some Accosiation of this (any) object and some related type','1','0',17,'0'),(108,'0','PrgMenu',14,116,'4330,1194,1232,116,','Programm Menu','Menu object - simply header and common point of Menu Items','0','0',17,'0'),(109,'0','PrgMenuItem',14,116,'4330,1194,1232,116,','Programm Menu Item','Programm Menu Item','0','0',17,'0'),(116,'0','PrgComponent',14,1232,'4330,1194,1232,','PrgComponent',NULL,'0','1',17,'0'),(130,'0','Concept',14,1232,'4330,1194,1232,','Concept','Anything Type - The main semantic classifier of all concepts of the world','0','1',17,'0'),(132,'0','ChangeConcept',14,1232,'4330,1194,1232,','Type of Changes',NULL,'0','0',17,'0'),(134,'0','Particular',14,1228,'4330,1194,1228,','Object','Consistent element - Object in common OO sence','0','0',17,'0'),(143,'0','WindowSettings',14,1227,'4330,1194,1228,1227,','Window size and position','Window size and position for User (and optional context)','0','0',17,'0'),(148,'0','RelationKind',14,1232,'4330,1194,1232,','Relation Kind',NULL,'0','1',17,'0'),(180,'0','PrgView',14,116,'4330,1194,1232,116,','View of this Type','Interface View of some Type','0','0',17,'0'),(411,'0','PrgViewField',14,116,'4330,1194,1232,116,','PrgViewField','Attributes inclusion into UI View','0','0',17,'0'),(453,'0','ListSettings',14,1227,'4330,1194,1228,1227,','Table View size and position','Table View size and position for User (and optional context)','0','0',17,'0'),(971,'0','EnityInChangeRole',14,1232,'4330,1194,1232,','Role in Activity','Roles that any entity play in some activity','0','0',17,'0'),(1194,'0','Entity',14,NULL,'4330,','Thing ','Any Thing - some real or abstract entity of the world','0','1',17,'0'),(1228,'0','Substance',14,1194,'4330,1194,','Entity Instances','Anything Existing: Objects and their relations','0','1',17,'0'),(1227,'0','Structural',14,1228,'4330,1194,1228,','Structure','Relations, Links, Roles, week Compositions of Objects','0','1',17,'0'),(1232,'0','Abstraction',14,1194,'4330,1194,','Abstraction','Any Concepts, Taxonomies, Knowledge, Information...','0','1',17,'0'),(1236,'0','Primitive',14,1232,'4330,1194,1232,','Change','Changes of any other Thing (Instance or Abstraction). May be primitive, or complicated.','1','1',17,'0'),(1238,'0','Change',14,NULL,'4330,','Primitive Types',NULL,'0','1',17,'0'),(1234,'0','Event',14,1235,'4330,1238,1235,','Event','Some changes that happends beyond any actor participation','0','1',17,'0'),(1235,'0','Transaction',14,1238,'4330,1238,','Trtansaction','Changes that is result of some activity','0','1',17,'0'),(1241,'0','Process',14,1238,'4330,1238,','Process','Complex of Transactions','0','1',17,'0'),(1504,'0','PrgVersion',14,116,'4330,1194,1232,116,',NULL,NULL,'1','1',17,'0'),(1624,'0','Relation',14,1232,'4330,1194,1232,',NULL,NULL,'0','0',17,'0'),(1767,'0','PrgClass',14,116,'4330,1194,1232,116,',NULL,NULL,'0','0',17,'0'),(1828,'0','DataBaseStore',14,116,'4330,1194,1232,116,',NULL,NULL,'0','0',17,'0'),(2541,'0','UserRights',14,1227,'4330,1194,1228,1227,','User Rights',NULL,'0','0',17,'0'),(2802,'0','EntityKind',14,1232,'4330,1194,1232,',NULL,NULL,'0','1',17,'0'),(3220,'0','Roles',14,4312,'4330,1194,4312,',NULL,NULL,'0','0',NULL,'0'),(3244,'0','Information',14,3960,'4330,1194,1228,134,3960,',NULL,NULL,'0','1',NULL,'0'),(3262,'0','Tangible',14,134,'4330,1194,1228,134,',NULL,NULL,'0','1',NULL,'0'),(3960,'0','Intangible',14,134,'4330,1194,1228,134,',NULL,NULL,'0','1',NULL,'0'),(4312,'0','Relations',14,1194,'4330,1194,',NULL,NULL,'0','1',NULL,'0'),(7554,'0','Building',14,3262,'4330,1194,1228,134,3262,',NULL,NULL,'0','0',NULL,'0'),(7777,'0','PrgAttribute',14,116,'4330,1194,1232,116,',NULL,NULL,'0','0',NULL,'0');
/*!40000 ALTER TABLE `concept` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `databasestore`
--

DROP TABLE IF EXISTS `databasestore`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `databasestore` (
  `ID` bigint(20) NOT NULL,
  `Del` char(1) DEFAULT '0',
  `SysCode` varchar(200) DEFAULT NULL,
  `Description` varchar(400) DEFAULT NULL,
  `DriverType` varchar(400) DEFAULT NULL,
  `ConnectionParams` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `databasestore`
--

LOCK TABLES `databasestore` WRITE;
/*!40000 ALTER TABLE `databasestore` DISABLE KEYS */;
INSERT INTO `databasestore` VALUES (1469,'0',NULL,'Development','MySQL',NULL);
/*!40000 ALTER TABLE `databasestore` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entitykind`
--

DROP TABLE IF EXISTS `entitykind`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `entitykind` (
  `ID` bigint(20) NOT NULL,
  `SysCode` varchar(200) DEFAULT NULL,
  `Del` char(1) DEFAULT '0',
  `Concept` bigint(20) DEFAULT NULL,
  `Source` bigint(20) DEFAULT NULL,
  `Parent` bigint(20) DEFAULT NULL,
  `HierCode` varchar(400) DEFAULT '',
  `Code` varchar(400) DEFAULT NULL,
  `Description` varchar(1000) DEFAULT NULL,
  `Notes` varchar(4000) DEFAULT NULL,
  `Actual` char(1) DEFAULT '1',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entitykind`
--

LOCK TABLES `entitykind` WRITE;
/*!40000 ALTER TABLE `entitykind` DISABLE KEYS */;
INSERT INTO `entitykind` VALUES (7,'Abstraction','0',1232,17,NULL,'','Abstraction','Abstraction - Information, Knowledge',NULL,'1'),(9,'PrgComponent','0',116,17,7,'7,','PrgComponent','Programm Component type',NULL,'1'),(10,'PrgClass','0',14,17,9,'7,9,','PrgClass','Program Class ',NULL,'1'),(11,'PrgAttribute','0',62,17,9,'7,9,','PrgAttribute','Program Class Attribute',NULL,'1'),(12,'PrgMenu','0',108,17,9,'7,9,','PrgMenu','Program Menu',NULL,'1'),(13,'PrgMenuItem','0',109,17,9,'7,9,','PrgMenuItem','Menu Items',NULL,'1'),(16,'PrgInstallation','0',NULL,17,6855,'6872,6855,','PrgInstallation','PrgInstallation',NULL,'1'),(6854,'PrgApplication','0',NULL,17,9,'7,9,','PrgApplication','Application - Single module or even IS',NULL,'1'),(6855,'Intangible','0',NULL,17,6872,'6872,','Intagible','Intangible Object',NULL,'1'),(6857,'Physical','0',NULL,17,6872,'6872,','Physical','Physical Object',NULL,'1'),(6872,'Object|>ru-RU|Ð?Ð°Ñ?Ñ?','0',1194,17,NULL,'','Object','Solid Object',NULL,'1'),(6873,'Structure>|ru-RU|Структура','0',1227,17,NULL,'','Structure','Structural object',NULL,'1'),(7587,'Building','0',7554,17,6857,'6872,6857,','Physical','Building',NULL,'1');
/*!40000 ALTER TABLE `entitykind` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `identifier`
--

DROP TABLE IF EXISTS `identifier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `identifier` (
  `ID` bigint(20) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `identifier`
--

LOCK TABLES `identifier` WRITE;
/*!40000 ALTER TABLE `identifier` DISABLE KEYS */;
INSERT INTO `identifier` VALUES (8942);
/*!40000 ALTER TABLE `identifier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imgname`
--

DROP TABLE IF EXISTS `imgname`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `imgname` (
  `ID` int(11) NOT NULL,
  `NameCode` varchar(512) DEFAULT NULL,
  `ImgCode` char(36) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imgname`
--

LOCK TABLES `imgname` WRITE;
/*!40000 ALTER TABLE `imgname` DISABLE KEYS */;
INSERT INTO `imgname` VALUES (2487,'anonymous','f66bb9f2-c8a2-4a28-927c-35726d2504b7'),(2498,'TUFW','e4d0d665-35bc-46dd-9152-3cfc01edf853');
/*!40000 ALTER TABLE `imgname` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `informat`
--

DROP TABLE IF EXISTS `informat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `informat` (
  `InCode` char(36) NOT NULL,
  `Code` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`InCode`)
) ENGINE=MEMORY DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `informat`
--

LOCK TABLES `informat` WRITE;
/*!40000 ALTER TABLE `informat` DISABLE KEYS */;
/*!40000 ALTER TABLE `informat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listsettings`
--

DROP TABLE IF EXISTS `listsettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `listsettings` (
  `ID` bigint(20) NOT NULL,
  `ForType` varchar(200) DEFAULT NULL,
  `Context` varchar(400) DEFAULT NULL,
  `Settings` varchar(7000) DEFAULT NULL,
  `Win` varchar(200) DEFAULT NULL,
  `ForUser` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listsettings`
--

LOCK TABLES `listsettings` WRITE;
/*!40000 ALTER TABLE `listsettings` DISABLE KEYS */;
INSERT INTO `listsettings` VALUES (850,'PrgView','','({selected:\"[{ID:7900}]\",field:\"[{name:\"SysCode\",width:null},{name:\"ForConcept\",width:null},{name:\"Description\",width:null},{name:\"Notes\",width:null}]\",sort:\"({fieldName:\"SysCode\",sortDir:\"ascending\",sortSpecifiers:[{property:\"SysCode\",direction:\"ascending\"}]})\",hilite:null,group:\"\"})','TableWindow','TUFW'),(934,'PrgComponent','','({selected:\"[]\",field:\"[{name:\"SysCode\",autoFitWidth:false,width:94},{name:\"EntityKind\",autoFitWidth:false,width:112},{name:\"Description\",autoFitWidth:false,width:467}]\",sort:\"({fieldName:null,sortDir:\"ascending\"})\",hilite:null,group:\"\"})','TableWindow','TUFW'),(1047,'RelationKind','','({selected:\"[{ID:153}]\",field:\"[{name:\"SysCode\",width:null},{name:\"Description\",width:null}]\",sort:\"({fieldName:null,sortDir:\"ascending\"})\",hilite:null,group:\"\"})','TableWindow','TUFW'),(1502,'RelationPrgAttribute','','({selected:\"[]\",field:\"[{name:\\\"SysCode\\\",width:null},{name:\\\"ForConcept\\\",autoFitWidth:false,width:175},{name:\\\"InheritedFrom\\\",width:null},{name:\\\"RelatedConcept\\\",width:null},{name:\\\"Description\\\",width:null},{name:\\\"ForPrgClass\\\",width:null},{name:\\\"DisplayName\\\",width:null},{name:\\\"PrgAttributeNotes\\\",width:null},{name:\\\"DBTable\\\",width:null},{name:\\\"DBColumn\\\",width:null},{name:\\\"Odr\\\",width:null}]\",sort:\"({fieldName:null,sortDir:\\\"ascending\\\"})\",hilite:null,group:\"([{fieldName:\\\"ForConcept\\\",groupingMode:null,groupGranularity:null,groupPrecision:null}])\"})','TableWindow','TUFW'),(1456,'ConceptPrgClass','','({\r    selected:\"[{ID:109}]\", \r    field:\"[{name:\"SysCode\",autoFitWidth:false,width:265},{name:\"BaseConcept\",width:null},{name:\"Description\",width:null},{name:\"Notes\",width:null},{name:\"VersDescription\",width:null},{name:\"VersNotes\",width:null},{name:\"PrgPackage\",width:null},{name:\"PrgType\",width:null}]\", \r    sort:\"({fieldName:null,sortDir:\"ascending\"})\", \r    hilite:null, \r    group:\"\", \r    open:\"[\r    \"/1194/1232/116\", \r    \"/1194/1232\", \r    \"/1194\", \r    \"/\"\r]\"\r})','TableWindow','TUFW'),(1399,'Concept','','({\r    selected:\"[{ID:2802}]\", \r    field:\"[{name:\"SysCode\",width:null},{name:\"BaseConcept\",width:null},{name:\"Description\",width:null},{name:\"Notes\",width:null}]\", \r    sort:\"({fieldName:null,sortDir:\"ascending\"})\", \r    hilite:null, \r    group:\"\", \r    open:\"[\r    \"/1194/1232\", \r    \"/1194\", \r    \"/\"\r]\"\r})','TableWindow','TUFW'),(1882,'PrgMenuItem','','({\r    selected:\"[{ID:1442}]\", \r    field:\"[{name:\"Odr\",autoFitWidth:false,width:67},{name:\"ParentItem\",autoFitWidth:false,width:134},{name:\"SysCode\",width:null},{name:\"Description\",width:null}]\", \r    sort:\"({fieldName:null,sortDir:\"ascending\"})\", \r    hilite:null, \r    group:\"\", \r    open:\"[\r    \"/104\", \r    \"/\"\r]\"\r})','TableWindow','TUFW'),(1910,'PrgVersion','','({selected:\"[{ID:3}]\",field:\"[{name:\\\"SysCode\\\",autoFitWidth:false,width:117},{name:\\\"Description\\\",autoFitWidth:false,width:293},{name:\\\"Owner\\\",autoFitWidth:false,width:203},{name:\\\"DateMark\\\",autoFitWidth:false,width:204},{name:\\\"Actual\\\",autoFitWidth:false,width:50}]\",sort:\"({fieldName:null,sortDir:\\\"ascending\\\"})\",hilite:null,group:\"\"})','TableWindow','TUFW'),(1948,'PrgClass','','({selected:\"[]\",field:\"[{name:\"ForConcept\",autoFitWidth:false,width:155},{name:\"PrgVersion\",autoFitWidth:false,width:222},{name:\"Description\",width:null},{name:\"Notes\",width:null}]\",sort:\"({fieldName:null,sortDir:\"ascending\"})\",hilite:null,group:\"\"})','TableWindow','TUFW'),(2583,'ConceptPrgClass','','({\r    selected:\"[{ID:2541}]\", \r    field:\"[{name:\\\"SysCode\\\",autoFitWidth:false,width:194},{name:\\\"BaseConcept\\\",autoFitWidth:false,width:145},{name:\\\"Description\\\",autoFitWidth:false,width:145},{name:\\\"Notes\\\",autoFitWidth:false,width:145},{name:\\\"VersDescription\\\",autoFitWidth:false,width:145},{name:\\\"VersNotes\\\",autoFitWidth:false,width:145},{name:\\\"PrgPackage\\\",autoFitWidth:false,width:145},{name:\\\"PrgType\\\",autoFitWidth:false,width:149}]\", \r    sort:\"({fieldName:null,sortDir:\\\"ascending\\\"})\", \r    hilite:null, \r    group:\"\", \r    open:\"[\\r    \\\"/1194/1228/1227\\\", \\r    \\\"/1194/1228\\\", \\r    \\\"/1194\\\", \\r    \\\"/\\\"\\r]\"\r})','TableWindow','6ade0790-48a9-40df-8750-ec40ce6fb391'),(2881,'Relation','','({selected:\"[{ID:66}]\",field:\"[{name:\"Odr\",width:null},{name:\"SysCode\",width:null},{name:\"ForConcept\",width:null},{name:\"InheritedFrom\",width:null},{name:\"RelatedConcept\",width:null},{name:\"Description\",width:null}]\",sort:\"({fieldName:null,sortDir:\"ascending\"})\",hilite:null,group:\"\"})','TableWindow','TUFW'),(3988,'ListSettings','','({selected:\"[]\",field:\"[{name:\\\"ID\\\",width:null},{name:\\\"ForType\\\",width:null},{name:\\\"Win\\\",width:null},{name:\\\"Context\\\",autoFitWidth:false,width:77},{name:\\\"ForUser\\\",width:null},{name:\\\"Settings\\\",width:null}]\",sort:\"({fieldName:null,sortDir:\\\"ascending\\\"})\",hilite:null,group:\"\"})','TableWindow','TUFW'),(7079,'EntityKind','','({\r    selected:\"[{ID:6872}]\", \r    field:\"[{name:\"SysCode\",autoFitWidth:false,width:305},{name:\"Parent\",width:null},{name:\"HierCode\",width:null},{name:\"Code\",width:null},{name:\"Description\",width:null},{name:\"Source\",width:null},{name:\"Concept\",width:null},{name:\"Actual\",autoFitWidth:true,width:40}]\", \r    sort:\"({fieldName:null,sortDir:\"ascending\"})\", \r    hilite:null, \r    group:\"\", \r    open:\"[\r    \"/7\", \r    \"/6872\", \r    \"/\"\r]\"\r})','TableWindow','TUFW'),(7565,'PrgMenu','','({selected:\"[]\",field:\"[{name:\"SysCode\",width:null},{name:\"Description\",width:null}]\",sort:\"({fieldName:null,sortDir:\"ascending\"})\",hilite:null,group:\"\"})','TableWindow','TUFW'),(8222,'PrgAttribute','','({selected:\"[{ID:212}]\",field:\"[{name:\"ForRelation\",width:null},{name:\"ForPrgClass\",width:null},{name:\"DisplayName\",width:null},{name:\"Notes\",width:null},{name:\"DBTable\",width:null},{name:\"DBColumn\",width:null}]\",sort:\"({fieldName:null,sortDir:\"ascending\"})\",hilite:null,group:\"\"})','TableWindow','TUFW');
/*!40000 ALTER TABLE `listsettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `outformat`
--

DROP TABLE IF EXISTS `outformat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `outformat` (
  `Code` char(36) NOT NULL,
  `Ds` varchar(45) DEFAULT NULL,
  `Img` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`Code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `outformat`
--

LOCK TABLES `outformat` WRITE;
/*!40000 ALTER TABLE `outformat` DISABLE KEYS */;
INSERT INTO `outformat` VALUES ('e4d0d665-35bc-46dd-9152-3cfc01edf853','TUFW','$2a$10$xOMQ1ukq4KSuQLtXE82hOer/y5uPyaU/oRr5SX8WuGff2xNsWp.NS'),('f66bb9f2-c8a2-4a28-927c-35726d2504b7','anonymous','$2a$10$/Gxha31n6doqk27jcqx4t.PuhThfAxIbUIB4ybzEEh7HJ3xW4Zx62');
/*!40000 ALTER TABLE `outformat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prgattribute`
--

DROP TABLE IF EXISTS `prgattribute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prgattribute` (
  `ID` bigint(20) NOT NULL,
  `Del` char(1) DEFAULT '0',
  `ForRelation` bigint(20) NOT NULL,
  `ForPrgClass` bigint(20) NOT NULL,
  `Modified` char(1) DEFAULT '0',
  `Size` int(11) DEFAULT NULL,
  `LinkFilter` varchar(4000) DEFAULT NULL,
  `Mandatory` char(1) DEFAULT '0',
  `IsPublic` char(1) DEFAULT '1',
  `ExprEval` varchar(4000) DEFAULT NULL,
  `ExprDefault` varchar(2000) DEFAULT NULL,
  `ExprValidate` varchar(2000) DEFAULT NULL,
  `CopyValue` char(1) DEFAULT '1',
  `CopyLinked` char(1) DEFAULT '1',
  `DeleteLinked` char(1) DEFAULT '1',
  `RelationStructRole` varchar(45) DEFAULT NULL,
  `Part` varchar(40) DEFAULT NULL,
  `Root` bigint(20) DEFAULT NULL,
  `DisplayName` varchar(400) DEFAULT NULL,
  `Notes` varchar(2000) DEFAULT NULL,
  `DBTable` varchar(2000) DEFAULT NULL,
  `DBColumn` varchar(2000) DEFAULT NULL,
  `Const` char(1) DEFAULT '0',
  `Countable` char(1) DEFAULT '0',
  `Historical` char(1) DEFAULT '0',
  `Versioned` char(1) DEFAULT '0',
  `VersPart` varchar(120) DEFAULT NULL,
  `MainPartID` varchar(120) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prgattribute`
--

LOCK TABLES `prgattribute` WRITE;
/*!40000 ALTER TABLE `prgattribute` DISABLE KEYS */;
INSERT INTO `prgattribute` VALUES (189,'0',42,15,'0',0,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'ID','Identifier','CBM.Concept','c.ID','0','0','0','0',NULL,NULL),(191,'0',44,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Class Code',NULL,'CBM.Concept','c.SysCode','0','0','0','0',NULL,NULL),(192,'0',45,15,'0',1,NULL,'0','0',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'Del',NULL,'CBM.Concept','c.Del','0','0','0','0',NULL,NULL),(195,'0',48,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Base Concept',NULL,'CBM.Concept','c.BaseConcept','0','0','0','0',NULL,NULL),(197,'0',50,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Primitive',NULL,'CBM.Concept','c.Primitive','0','0','0','0',NULL,NULL),(198,'0',51,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Abstract',NULL,'CBM.Concept','c.Abstract','0','0','0','0',NULL,NULL),(200,'0',55,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'PrgClassVersion',NULL,'CBM.PrgClass','cv.PrgVersion','0','0','0','0',NULL,NULL),(203,'0',58,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Name',NULL,'CBM.PrgClass','cv.Description','0','0','0','0',NULL,NULL),(204,'0',59,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Note',NULL,'CBM.PrgClass','cv.Notes','0','0','0','0',NULL,NULL),(205,'0',60,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'PrgPackage',NULL,'CBM.PrgClass','cv.PrgPackage','0','0','0','0',NULL,NULL),(206,'0',61,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'PrgType',NULL,'CBM.PrgClass','cv.PrgType','0','0','0','0',NULL,NULL),(207,'0',64,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'ExprToString',NULL,'CBM.PrgClass','cv.ExprToString','0','0','0','0',NULL,NULL),(208,'0',65,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'ExprFrom',NULL,'CBM.PrgClass','cv.ExprFrom','0','0','0','0',NULL,NULL),(209,'0',66,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'ExprWhere',NULL,'CBM.PrgClass','cv.ExprWhere','0','0','0','0',NULL,NULL),(210,'0',67,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'ExprGroup',NULL,'CBM.PrgClass','cv.ExprGroup','0','0','0','0',NULL,NULL),(211,'0',68,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'ExprHaving',NULL,'CBM.PrgClass','cv.ExprHaving','0','0','0','0',NULL,NULL),(212,'0',69,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'ExprOrder',NULL,'CBM.PrgClass','cv.ExprOrder','0','0','0','0',NULL,NULL),(213,'0',70,63,'0',0,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'ID','Identifier','CBM.Relation','r.ID','0','0','0','0',NULL,NULL),(215,'0',72,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Attribute Code',NULL,'CBM.Relation','r.SysCode','0','0','0','0',NULL,NULL),(216,'0',73,63,'0',1,NULL,'0','0',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'Del',NULL,'CBM.Relation','r.Del','0','0','0','0',NULL,NULL),(219,'0',81,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'CounterAttribute',NULL,'CBM.Relation','r.BackLinkRelation','0','0','0','0',NULL,NULL),(221,'0',77,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Name',NULL,'CBM.PrgAttribute','rv.DisplayName','0','0','0','0',NULL,NULL),(222,'0',78,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Notes',NULL,'CBM.PrgAttribute','rv.Notes','0','0','0','0',NULL,NULL),(223,'0',79,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'AttributeKind',NULL,'CBM.Relation','r.RelationKind','0','0','0','0',NULL,NULL),(224,'0',80,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'PointedClass',NULL,'CBM.Relation','r.RelatedConcept','0','0','0','0',NULL,NULL),(225,'0',82,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'CrossClass',NULL,'CBM.Relation','r.CrossConcept','0','0','0','0',NULL,NULL),(226,'0',83,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'CrossAttribute',NULL,'CBM.Relation','r.CrossRelation','0','0','0','0',NULL,NULL),(227,'0',84,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'IsPublic',NULL,'CBM.PrgAttribute','rv.IsPublic','0','0','0','0',NULL,NULL),(228,'0',85,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'ExprEval',NULL,'CBM.PrgAttribute','rv.ExprEval','0','0','0','0',NULL,NULL),(229,'0',86,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'ExprDefault',NULL,'CBM.PrgAttribute','rv.ExprDefault','0','0','0','0',NULL,NULL),(230,'0',87,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'ExprValidate',NULL,'CBM.PrgAttribute','rv.ExprValidate','0','0','0','0',NULL,NULL),(231,'0',88,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'LinkFilter',NULL,'CBM.PrgAttribute','rv.LinkFilter','0','0','0','0',NULL,NULL),(232,'0',89,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'CopyValue',NULL,'CBM.PrgAttribute','rv.CopyValue','0','0','0','0',NULL,NULL),(233,'0',90,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'CopyLinked',NULL,'CBM.PrgAttribute','rv.CopyLinked','0','0','0','0',NULL,NULL),(234,'0',91,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'DeleteLinked',NULL,'CBM.PrgAttribute','rv.DeleteLinked','0','0','0','0',NULL,NULL),(235,'0',92,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Countable',NULL,'CBM.PrgAttribute','rv.Countable','0','0','0','0',NULL,NULL),(236,'0',93,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'InheritedFrom',NULL,'CBM.Relation','r.InheritedFrom','0','0','0','0',NULL,NULL),(237,'0',94,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Modified',NULL,'CBM.PrgAttribute','rv.Modified','0','0','0','0',NULL,NULL),(238,'0',95,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Historical attribute',NULL,'CBM.PrgAttribute','rv.Historical','0','0','0','0',NULL,NULL),(239,'0',96,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Versioned',NULL,'CBM.PrgAttribute','rv.Versioned','0','0','0','0',NULL,NULL),(240,'0',97,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'DBTable',NULL,'CBM.PrgAttribute','rv.DBTable','0','0','0','0',NULL,NULL),(241,'0',98,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'DBColumn',NULL,'CBM.PrgAttribute','rv.DBColumn','0','0','0','0',NULL,NULL),(242,'0',99,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Sequence',NULL,'CBM.Relation','r.Odr','0','0','0','0',NULL,NULL),(244,'0',101,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'UIMandatory',NULL,'CBM.PrgAttribute','rv.Mandatory','0','0','0','0',NULL,NULL),(471,'0',470,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Attributes',NULL,NULL,NULL,'0','0','0','0',NULL,NULL),(246,'0',112,111,'0',0,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'ID','Identifier','CBM.PrgMenuItem','ID','0','0','0','0',NULL,NULL),(247,'0',113,111,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'SysCode',NULL,'CBM.PrgMenuItem','SysCode','0','0','0','0',NULL,NULL),(248,'0',114,111,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,'null',0,'Name',NULL,'CBM.PrgMenuItem','Description','0','0','0','0',NULL,NULL),(249,'0',115,111,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Parent',NULL,'CBM.PrgMenuItem','ParentItem','0','0','0','0',NULL,NULL),(250,'0',118,117,'0',0,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'ID','Identifier','CBM.PrgComponent','pc.ID','0','0','0','0',NULL,NULL),(252,'0',120,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Code',NULL,'CBM.PrgComponent','pc.SysCode','0','0','0','0',NULL,NULL),(253,'0',121,117,'0',1,NULL,'0','0',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'Del',NULL,'CBM.PrgComponent','pc.Del','0','0','0','0',NULL,NULL),(254,'0',122,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Installation',NULL,'CBM.PrgComponent','pc.Installation','0','0','0','0',NULL,NULL),(255,'0',123,117,'0',20,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Component Kind',NULL,'CBM.PrgComponent','pc.EntityKind','0','0','0','0',NULL,NULL),(257,'0',125,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'ID of version part of Programm Classes (PrgClass)',NULL,'CBM.PrgClass','cv.ID','0','0','0','0',NULL,NULL),(258,'0',126,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'MainID',NULL,'CBM.PrgClass','cv.ForConcept','0','0','0','0',NULL,NULL),(259,'0',136,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'For which Class and it\'s Version this attribute belongs',NULL,'CBM.PrgAttribute','rv.ForPrgClass','0','0','0','0',NULL,NULL),(261,'0',138,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Prg Class',NULL,'CBM.PrgClass','cv.DataBaseStore','0','0','0','0',NULL,NULL),(263,'0',140,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Relation version part  ID',NULL,'CBM.PrgAttribute','rv.ID','0','0','0','0',NULL,NULL),(264,'0',145,144,'0',0,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'ID','Identifier','CBM.windowsettings','ws.ID','0','0','0','0',NULL,NULL),(265,'0',154,149,'0',0,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'ID','Identifier','CBM.RelationKind','rk.ID','0','0','0','0',NULL,NULL),(266,'0',155,149,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,'null',0,'Name',NULL,'CBM.RelationKind','rk.Description','0','0','0','0',NULL,NULL),(267,'0',156,149,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'SysCode',NULL,'CBM.RelationKind','rk.SysCode','0','0','0','0',NULL,NULL),(268,'0',157,149,'0',1,NULL,'0','0',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'Del',NULL,'CBM.RelationKind','rk.Del','0','0','0','0',NULL,NULL),(1521,'0',1520,1505,'0',0,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'ID','Identifier','CBM.PrgVersion','pv.ID','0','0','0','0',NULL,NULL),(1525,'0',1524,1505,'0',1,NULL,'0','0',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'Del',NULL,'CBM.PrgVersion','pv.Del','0','0','0','0',NULL,NULL),(1529,'0',1528,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.PrgVersion','pv.SysCode','0','0','0','0',NULL,NULL),(272,'0',161,149,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Description',NULL,'CBM.RelationKind','rk.Notes','0','0','0','0',NULL,NULL),(279,'0',171,144,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'For which type this settings',NULL,'CBM.windowsettings','ws.ForType','0','0','0','0',NULL,NULL),(280,'0',172,144,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Window','Window for which stored settings','CBM.windowsettings','ws.Win','0','0','0','0',NULL,NULL),(281,'0',174,144,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Context','Additional Context for this parameters ','CBM.windowsettings','ws.Context','0','0','0','0',NULL,NULL),(282,'0',176,144,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'For User',NULL,'CBM.windowsettings','ws.ForUser','0','0','0','0',NULL,NULL),(283,'0',178,144,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Position',NULL,'CBM.windowsettings','ws.Position','0','0','0','0',NULL,NULL),(284,'0',182,181,'1',NULL,NULL,'1','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'ID',NULL,'CBM.PrgView','cv.ID','0','0','0','0',NULL,NULL),(286,'0',184,181,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Code',NULL,'CBM.PrgView','cv.SysCode','0','0','0','0',NULL,NULL),(287,'0',185,181,'0',1,NULL,'0','0',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'Del',NULL,'CBM.PrgView','cv.Del','0','0','0','0',NULL,NULL),(403,'0',401,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Concept to which Relation belongs',NULL,'CBM.Relation','r.ForConcept','0','0','0','0',NULL,NULL),(407,'0',406,181,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'ForClass',NULL,'CBM.PrgView','cv.ForConcept','0','0','0','0',NULL,NULL),(409,'0',408,63,'0',NULL,NULL,'0','0',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'MainID',NULL,'CBM.PrgAttribute','rv.ForRelation','0','0','0','0',NULL,NULL),(416,'0',415,412,'1',0,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'ID','Identifier','CBM.PrgViewField','cvf.ID','0','0','0','0',NULL,NULL),(418,'0',417,412,'1',NULL,NULL,'1','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'PrgView',NULL,'CBM.PrgViewField','cvf.ForPrgView','0','0','0','0',NULL,NULL),(422,'0',421,412,'0',NULL,NULL,'1','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Attribute',NULL,'CBM.PrgViewField','cvf.ForRelation','0','0','0','0',NULL,NULL),(424,'0',423,412,'0',NULL,NULL,'1','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Sequence','Sequence in Class','CBM.PrgViewField','cvf.Odr','0','0','0','0',NULL,NULL),(426,'0',425,412,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'UI Root',NULL,'CBM.PrgViewField','cvf.UIPath','0','0','0','0',NULL,NULL),(428,'0',427,412,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Mandatory',NULL,'CBM.PrgViewField','cvf.Mandatory','0','0','0','0',NULL,NULL),(456,'0',455,412,'0',NULL,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Code',NULL,'CBM.PrgViewField','cvf.SysCode','0','0','0','0',NULL,NULL),(432,'0',431,412,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Hidden',NULL,'CBM.PrgViewField','cvf.Hidden','0','0','0','0',NULL,NULL),(434,'0',433,412,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'InList',NULL,'CBM.PrgViewField','cvf.InList','0','0','0','0',NULL,NULL),(437,'0',436,181,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Note',NULL,'CBM.PrgView','cv.Notes','0','0','0','0',NULL,NULL),(474,'0',473,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Size',NULL,'CBM.PrgAttribute','rv.Size','0','0','0','0',NULL,NULL),(476,'0',475,63,'0',NULL,NULL,'0','1',NULL,'false',NULL,'1','1','1',NULL,NULL,NULL,'Constant','Attribute once initialized cannot be changed in the future','CBM.PrgAttribute','rv.Const','0','0','0','0',NULL,NULL),(478,'0',477,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','1',NULL,NULL,NULL,'Values Set','Map of possible Values','CBM.Relation','r.Domain','0','0','0','0',NULL,NULL),(480,'0',479,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Role of Relation in Concept internal stucture',NULL,'CBM.PrgAttribute','rv.RelationStructRole','0','0','0','0',NULL,NULL),(482,'0',481,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Part','Part of Entity in meta-data sence','CBM.PrgAttribute','rv.VersPart','0','0','0','0',NULL,NULL),(486,'0',485,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'??? MainPartID - MUST DIE?','What attribute MainID points to','CBM.PrgAttribute','rv.MainPartID','0','0','0','0',NULL,NULL),(488,'0',487,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Root','Root for Hierarchy','CBM.PrgAttribute','rv.Root','0','0','0','0',NULL,NULL),(490,'0',489,412,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'ControlType',NULL,'CBM.PrgViewField','cvf.ControlType','0','0','0','0',NULL,NULL),(492,'0',491,412,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'ShowTitle',NULL,'CBM.PrgViewField','cvf.ShowTitle','0','0','0','0',NULL,NULL),(494,'0',493,412,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Editable',NULL,'CBM.PrgViewField','cvf.Editable','0','0','0','0',NULL,NULL),(496,'0',495,412,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'DataSourceView',NULL,'CBM.PrgViewField','cvf.DataSourceView','0','0','0','0',NULL,NULL),(498,'0',497,412,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'ValueField',NULL,'CBM.PrgViewField','cvf.ValueField','0','0','0','0',NULL,NULL),(500,'0',499,412,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'DisplayField',NULL,'CBM.PrgViewField','cvf.DisplayField','0','0','0','0',NULL,NULL),(502,'0',501,412,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'PickListWidth',NULL,'CBM.PrgViewField','cvf.PickListWidth','0','0','0','0',NULL,NULL),(504,'0',503,412,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'ViewOnly',NULL,'CBM.PrgViewField','cvf.ViewOnly','0','0','0','0',NULL,NULL),(803,'0',802,454,'0',0,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'ID','Identifier','CBM.ListSettings','ls.ID','0','0','0','0',NULL,NULL),(811,'0',810,454,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'For which type this settings',NULL,'CBM.ListSettings','ls.ForType','0','0','0','0',NULL,NULL),(813,'0',812,454,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Window','Window for which stored settings','CBM.ListSettings','ls.Win','0','0','0','0',NULL,NULL),(815,'0',814,454,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Context','Additional Context for this parameters ','CBM.ListSettings','ls.Context','0','0','0','0',NULL,NULL),(817,'0',816,454,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'For User',NULL,'CBM.ListSettings','ls.ForUser','0','0','0','0',NULL,NULL),(819,'0',818,454,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'List Settings',NULL,'CBM.ListSettings','ls.Settings','0','0','0','0',NULL,NULL),(979,'0',978,972,'0',0,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'ID','Identifier','CBM.Role','r.ID','0','0','0','0',NULL,NULL),(981,'0',980,972,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.Role','r.SysCode','0','0','0','0',NULL,NULL),(997,'0',996,972,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,NULL,NULL,'CBM.Role','r.Description','0','0','0','0',NULL,NULL),(1203,'0',1201,131,'0',0,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'ID','Identifier','CBM.Concept','c.ID','0','0','0','0',NULL,NULL),(1202,'0',1200,131,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Concept Code','Concept Code','CBM.Concept','c.SysCode','0','0','0','0',NULL,NULL),(1531,'0',1530,1505,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,'null',0,'Name',NULL,'CBM.PrgVersion','pv.Description','0','0','0','0',NULL,NULL),(1533,'0',1532,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.PrgVersion','pv.Owner','0','0','0','0',NULL,NULL),(1535,'0',1534,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.PrgVersion','pv.DateMark','0','0','0','0',NULL,NULL),(1537,'0',1536,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.PrgVersion','pv.Actual','0','0','0','0',NULL,NULL),(1539,'0',1538,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.PrgVersion','pv.ExprFilter','0','0','0','0',NULL,NULL),(1603,'0',1602,131,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,NULL,NULL,'CBM.Concept','c.BaseConcept','0','0','0','0',NULL,NULL),(1605,'0',1604,131,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,'null',0,'Name',NULL,'CBM.Concept','c.Description','0','0','0','0',NULL,NULL),(1607,'0',1606,131,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,NULL,NULL,'CBM.Concept','c.Notes','0','0','0','0',NULL,NULL),(1609,'0',1608,131,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,NULL,NULL,'CBM.Concept','c.Primitive','0','0','0','0',NULL,NULL),(1611,'0',1610,131,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,NULL,NULL,'CBM.Concept','c.Abstract','0','0','0','0',NULL,NULL),(1613,'0',1612,131,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,NULL,NULL,'CBM.Concept','c.Author','0','0','0','0',NULL,NULL),(1635,'0',1634,1625,'1',NULL,NULL,'0',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'ID',NULL,'CBM.Relation','r.ID','0','0','0','0',NULL,NULL),(1644,'0',1643,1625,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Del',NULL,'CBM.Relation','r.Del','0','0','0','0',NULL,NULL),(1646,'0',1645,1625,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'SysCode',NULL,'CBM.Relation','r.SysCode','0','0','0','0',NULL,NULL),(1659,'0',1658,1625,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Concept for which this Relation belongs',NULL,'CBM.Relation','r.ForConcept','0','0','0','0',NULL,NULL),(1664,'0',1663,1625,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'InheritedFrom',NULL,'CBM.Relation','r.InheritedFrom','0','0','0','0',NULL,NULL),(1666,'0',1665,1625,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'InheritedFrom',NULL,'CBM.Relation','r.RelationRole','0','0','0','0',NULL,NULL),(1668,'0',1667,1625,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'RelatedConcept',NULL,'CBM.Relation','r.RelatedConcept','0','0','0','0',NULL,NULL),(1670,'0',1669,1625,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'RelationKind',NULL,'CBM.Relation','r.RelationKind','0','0','0','0',NULL,NULL),(1672,'0',1671,1625,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Domain',NULL,'CBM.Relation','r.Domain','0','0','0','0',NULL,NULL),(1674,'0',1673,1625,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'BackLinkRelation',NULL,'CBM.Relation','r.BackLinkRelation','0','0','0','0',NULL,NULL),(1676,'0',1675,1625,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'CrossConcept',NULL,'CBM.Relation','r.CrossConcept','0','0','0','0',NULL,NULL),(1678,'0',1677,1625,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'CrossRelation',NULL,'CBM.Relation','r.CrossRelation','0','0','0','0',NULL,NULL),(1680,'0',1679,1625,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Description',NULL,'CBM.Relation','r.Description','0','0','0','0',NULL,NULL),(1682,'0',1681,1625,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Notes',NULL,'CBM.Relation','r.Notes','0','0','0','0',NULL,NULL),(1684,'0',1683,1625,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Seqn',NULL,'CBM.Relation','r.Odr','0','0','0','0',NULL,NULL),(7887,'0',7886,1625,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'IS aspects of Relation','IS aspects of Relation',NULL,NULL,'0','0','0','0',NULL,NULL),(1739,'0',1738,131,'0',1,NULL,'0','0',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'Del',NULL,'CBM.Concept','c.Del','0','0','0','0',NULL,NULL),(1771,'0',1772,1768,'0',0,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'ID','Identifier','CBM.PrgClass','pc.ID','0','0','0','0',NULL,NULL),(1775,'0',1774,1768,'0',1,NULL,'0','0',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'Del',NULL,'CBM.PrgClass','pc.Del','0','0','0','0',NULL,NULL),(1785,'0',1784,412,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','0',NULL,NULL,NULL,'Del',NULL,'CBM.PrgViewField','cvf.Del','0','0','0','0',NULL,NULL),(1812,'0',1811,1768,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'ForConcept',NULL,'CBM.PrgClass','pc.ForConcept','0','0','0','0',NULL,NULL),(1815,'0',1814,1768,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Version',NULL,'CBM.PrgClass','pc.PrgVersion','0','0','0','0',NULL,NULL),(1817,'0',1816,1768,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,'null',0,'Name',NULL,'CBM.PrgClass','pc.Description','0','0','0','0',NULL,NULL),(1819,'0',1818,1768,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Notes',NULL,'CBM.PrgClass','pc.Notes','0','0','0','0',NULL,NULL),(1821,'0',1820,1768,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'ExprToString',NULL,'CBM.PrgClass','pc.ExprToString','0','0','0','0',NULL,NULL),(1824,'0',1823,1768,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'DataBaseStore',NULL,'CBM.PrgClass','pc.DataBaseStore','0','0','0','0',NULL,NULL),(1837,'0',1836,1768,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','1','1',NULL,NULL,NULL,'ExprFrom',NULL,'CBM.PrgClass','pc.ExprFrom','0','0','0','0',NULL,NULL),(1839,'0',1838,1768,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','1','1',NULL,NULL,NULL,'ExprWhere',NULL,'CBM.PrgClass','pc.ExprWhere','0','0','0','0',NULL,NULL),(1841,'0',1840,1768,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','1','1',NULL,NULL,NULL,'ExprGroup',NULL,'CBM.PrgClass','pc.ExprGroup','0','0','0','0',NULL,NULL),(1843,'0',1842,1768,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','1','1',NULL,NULL,NULL,'ExprHaving',NULL,'CBM.PrgClass','pc.ExprHaving','0','0','0','0',NULL,NULL),(1845,'0',1844,1768,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','1','1',NULL,NULL,NULL,'ExprOrder',NULL,'CBM.PrgClass','pc.ExprOrder','0','0','0','0',NULL,NULL),(1848,'0',1847,1768,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','1','1',NULL,NULL,NULL,'PrgPackage',NULL,'CBM.PrgClass','pc.PrgPackage','0','0','0','0',NULL,NULL),(1850,'0',1849,1768,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','1','1',NULL,NULL,NULL,'PrgType',NULL,'CBM.PrgClass','pc.PrgType','0','0','0','0',NULL,NULL),(2067,'0',2065,1829,'1',0,'null','1','1','null','null','null','0','0','0','null','null',0,'ID','Identifier','CBM.DataBaseStore','dbs.ID','0','0','0','0',NULL,NULL),(2068,'0',2066,1829,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Del','Delete flag','CBM.DataBaseStore ','dbs.Del','0','0','0','0',NULL,NULL),(2072,'0',2071,1829,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Code','Permanent code','CBM.DataBaseStore ','dbs.SysCode','0','0','0','0',NULL,NULL),(2074,'0',2073,1829,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Description','Short Description for this data store','CBM.DataBaseStore ','dbs.Description','0','0','0','0',NULL,NULL),(2076,'0',2075,1829,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'DriverType','Name of DBMS','CBM.DataBaseStore ','dbs.DriverType','0','0','0','0',NULL,NULL),(2078,'0',2077,1829,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Connection Parameters','Connection string as usial','CBM.DataBaseStore ','dbs.ConnectionParams','0','0','0','0',NULL,NULL),(2205,'0',2204,63,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,'null',0,'Name',NULL,'CBM.Relation','r.Description','0','0','0','0',NULL,NULL),(2207,'0',2206,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Notes',NULL,'CBM.Relation','r.Notes','0','0','0','0',NULL,NULL),(2214,'0',2213,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Concept to which Relation belongs',NULL,'CBM.Relation','r.RelationRole','0','0','0','0',NULL,NULL),(2341,'0',2342,111,'0',4,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Order',NULL,'CBM.PrgMenuItem','Odr','0','0','0','0',NULL,NULL),(2348,'0',2347,111,'0',0,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'For Menu',NULL,'CBM.PrgMenuItem','ForMenu','0','0','0','0',NULL,NULL),(2351,'0',2350,111,'0',120,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Name',NULL,'CBM.PrgMenuItem','CalledConcept','0','0','0','0',NULL,NULL),(2353,'0',2352,111,'0',200,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Called Method',NULL,'CBM.PrgMenuItem','CalledMethod','0','0','0','0',NULL,NULL),(2355,'0',2354,111,'0',400,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Args',NULL,'CBM.PrgMenuItem','Args','0','0','0','0',NULL,NULL),(2548,'0',2547,2542,'1',NULL,NULL,'1','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'ID','ID of Right','CBM.Right','ID','0','0','0','0',NULL,NULL),(2552,'0',2551,2542,'0',20,NULL,'1','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'For Type','Right for What','CBM.Right','ForType','0','0','0','0',NULL,NULL),(2561,'0',2560,2542,'0',20,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Action Type','To Do What','CBM.Right','ActionType','0','0','0','0',NULL,NULL),(2563,'0',2562,2542,'0',20,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'For User','For Whom is this Right granted','CBM.Right','ForUser','0','0','0','0',NULL,NULL),(2565,'0',2564,2542,'0',2000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Creteria','Additional creteria','CBM.Right','Creteria','0','0','0','0',NULL,NULL),(2783,'0',2782,1195,'0',NULL,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'ID','Identifier',NULL,'ID','0','0','0','0',NULL,NULL),(2789,'0',2788,1195,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Name',NULL,NULL,'Description','0','0','0','0',NULL,NULL),(2914,'0',2913,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.PrgVersion','pv.Owner','0','0','0','0',NULL,NULL),(2904,'0',2903,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.PrgVersion','pv.ID','0','0','0','0',NULL,NULL),(2906,'0',2905,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.PrgVersion','pv.Del','0','0','0','0',NULL,NULL),(2912,'0',2911,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Description',NULL,'CBM.PrgVersion','pv.Description','0','0','0','0',NULL,NULL),(2910,'0',2909,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.PrgVersion','pv.SysCode','0','0','0','0',NULL,NULL),(2908,'0',2907,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.PrgVersion','pv.UID','0','0','0','0',NULL,NULL),(2920,'0',2919,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.PrgVersion','pv.ExprFilter','0','0','0','0',NULL,NULL),(2916,'0',2915,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.PrgVersion','pv.DateMark','0','0','0','0',NULL,NULL),(2918,'0',2917,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.PrgVersion','pv.Actual','0','0','0','0',NULL,NULL),(3090,'0',3089,110,'0',0,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'ID','Identifier','CBM.PrgMenu','ID','0','0','0','0',NULL,NULL),(3097,'0',3096,110,'0',1,NULL,'0','0',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'Del',NULL,'CBM.PrgMenu','Del','0','0','0','0',NULL,NULL),(3101,'0',3100,110,'0',200,NULL,'1','0',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,NULL,NULL,'CBM.PrgMenu','SysCode','0','0','0','0',NULL,NULL),(3103,'0',3102,110,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,'null',0,'Name',NULL,'CBM.PrgMenu','Description','0','0','0','0',NULL,NULL),(3225,'0',3224,3221,'0',1,'null','0','0','null','null','null','0','0','0','null','null',0,'Del','null.Del','CBM.Role','r.Del','0','0','0','0',NULL,NULL),(3223,'0',3222,3221,'0',0,'null','1','1','null','null','null','0','0','0','null','null',0,'ID','Identifier','CBM.Role','r.ID','0','0','0','0',NULL,NULL),(3231,'0',3230,3221,'0',200,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Context','Additional Context for this parameters ','CBM.Role','r.SysCode','0','0','0','0',NULL,NULL),(3251,'0',3250,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Code',NULL,NULL,'SysCode','0','0','0','0',NULL,NULL),(3257,'0',3256,117,'0',20,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'AnyType',NULL,NULL,'EntityKind','0','0','0','0',NULL,NULL),(3949,'0',3948,3263,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Code',NULL,NULL,'SysCode','0','0','0','0',NULL,NULL),(3955,'0',3954,3263,'0',20,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'AnyType',NULL,NULL,'EntityKind','0','0','0','0',NULL,NULL),(3973,'0',3972,117,'0',20,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'AnyType',NULL,NULL,NULL,'0','0','0','0',NULL,NULL),(4246,'0',4245,1195,'0',1,NULL,'0','0',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Del',NULL,NULL,'Del','0','0','0','0',NULL,NULL),(4315,'0',4314,4313,'0',NULL,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'ID','Identifier',NULL,'ID','0','0','0','0',NULL,NULL),(4319,'0',4318,4313,'0',1,'null','0','0','null','null','null','0','0','0','null','null',0,'Del','null',NULL,'Del','0','0','0','0',NULL,NULL),(4321,'0',4320,4313,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Name',NULL,NULL,'Description','0','0','0','0',NULL,NULL),(4333,'0',4332,4331,'0',NULL,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'ID','Identifier',NULL,NULL,'0','0','0','0',NULL,NULL),(4337,'0',4336,4331,'0',1,NULL,'0','0',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Del',NULL,NULL,NULL,'0','0','0','0',NULL,NULL),(4339,'0',4338,4331,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Name',NULL,NULL,NULL,'0','0','0','0',NULL,NULL),(4409,'0',4408,1195,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Concept',NULL,NULL,'Concept','0','0','0','0',NULL,NULL),(4395,'0',4394,4331,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Concept',NULL,NULL,NULL,'0','0','0','0',NULL,NULL),(4521,'0',4520,15,'0',100,NULL,'0','0',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Hierarchy path',NULL,'CBM.Concept','c.HierCode','0','0','0','0',NULL,NULL),(5814,'0',5813,133,'0',0,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'ID','Identifier',NULL,'ID','0','0','0','0',NULL,NULL),(5816,'0',5815,135,'0',0,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'ID','Identifier',NULL,'ID','0','0','0','0',NULL,NULL),(5818,'0',5817,1229,'0',0,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'ID','Identifier',NULL,'ID','0','0','0','0',NULL,NULL),(5820,'0',5819,1230,'0',0,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'ID','Identifier',NULL,'ID','0','0','0','0',NULL,NULL),(5822,'0',5821,1233,'0',0,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'ID','Identifier',NULL,'ID','0','0','0','0',NULL,NULL),(5826,'0',5825,2803,'0',0,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'ID','Identifier','CBM.EntityKind','ek.ID','0','0','0','0',NULL,NULL),(5828,'0',5827,3245,'0',0,'null','1','1','null','null','null','0','0','0','null','null',0,'ID','Identifier','null','null','0','0','0','0',NULL,NULL),(5830,'0',5829,3263,'0',0,'null','1','1','null','null','null','0','0','0','null','null',0,'ID','Identifier','null','null','0','0','0','0',NULL,NULL),(5832,'0',5831,3961,'0',0,'null','1','1','null','null','null','0','0','0','null','null',0,'ID','Identifier','null','null','0','0','0','0',NULL,NULL),(5862,'0',5861,133,'0',1,'null','0','0','null','null','null','0','0','0','null','null',0,'Del','null','null','Del','0','0','0','0',NULL,NULL),(5864,'0',5863,135,'0',1,'null','0','0','null','null','null','0','0','0','null','null',0,'Del','null','null','Del','0','0','0','0',NULL,NULL),(5866,'0',5865,972,'0',1,NULL,'0','0',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'Del',NULL,'CBM.Role','r.Del','0','0','0','0',NULL,NULL),(5870,'0',5869,1230,'0',1,'null','0','0','null','null','null','0','0','0','null','null',0,'Del','null','null','Del','0','0','0','0',NULL,NULL),(5872,'0',5871,1233,'0',1,'null','0','0','null','null','null','0','0','0','null','null',0,'Del','null','null','Del','0','0','0','0',NULL,NULL),(5878,'0',5877,2803,'0',1,NULL,'0','0',NULL,NULL,NULL,'0','0','0',NULL,'null',0,'Del',NULL,'CBM.EntityKind','ek.Del','0','0','0','0',NULL,NULL),(5880,'0',5879,3245,'0',1,'null','0','0','null','null','null','0','0','0','null','null',0,'Del','null','null','Del','0','0','0','0',NULL,NULL),(5882,'0',5881,3263,'0',1,'null','0','0','null','null','null','0','0','0','null','null',0,'Del','null','null','Del','0','0','0','0',NULL,NULL),(5884,'0',5883,3961,'0',1,'null','0','0','null','null','null','0','0','0','null','null',0,'Del','null','null','Del','0','0','0','0',NULL,NULL),(5886,'0',5885,15,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,'null',0,'Concept',NULL,'CBM.Concept','c.Concept','0','0','0','0',NULL,NULL),(5914,'0',5913,63,'0',1000,'null','0','1','null','null','null','1','0','0','null','null',0,'Concept','null','null','null','0','0','0','0',NULL,NULL),(5916,'0',5915,110,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,'null',0,'Concept',NULL,'CBM.PrgMenu','Concept','0','0','0','0',NULL,NULL),(5920,'0',5919,117,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,'null',0,'Concept',NULL,'CBM.PrgComponent','pc.Concept','0','0','0','0',NULL,NULL),(5922,'0',5921,131,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,'null',0,'Concept',NULL,'CBM.Concept','c.Concept','0','0','0','0',NULL,NULL),(5924,'0',5923,133,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,'null',0,'Concept',NULL,NULL,'Concept','0','0','0','0',NULL,NULL),(5926,'0',5925,135,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,'null',0,'Concept',NULL,NULL,'Concept','0','0','0','0',NULL,NULL),(5932,'0',5931,181,'0',1000,'null','0','1','null','null','null','1','0','0','null','null',0,'Concept','null','null','null','0','0','0','0',NULL,NULL),(5934,'0',5933,412,'0',1000,'null','0','1','null','null','null','1','0','0','null','null',0,'Concept','null','null','null','0','0','0','0',NULL,NULL),(5938,'0',5937,972,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,'null',0,'Concept',NULL,'CBM.Role','r.Concept','0','0','0','0',NULL,NULL),(5942,'0',5941,1230,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,'null',0,'Concept',NULL,NULL,'Concept','0','0','0','0',NULL,NULL),(5944,'0',5943,1233,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,'null',0,'Concept',NULL,NULL,'Concept','0','0','0','0',NULL,NULL),(5958,'0',5957,2803,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,'null',0,'Concept',NULL,'CBM.EntityKind','ek.Concept','0','0','0','0',NULL,NULL),(5960,'0',5959,3221,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,'null',0,'Concept',NULL,'CBM.Role','r.Concept','0','0','0','0',NULL,NULL),(5962,'0',5961,3245,'0',1000,'null','0','1','null','null','null','1','0','0','null','null',0,'Concept','null','null','null','0','0','0','0',NULL,NULL),(5964,'0',5963,3263,'0',1000,'null','0','1','null','null','null','1','0','0','null','null',0,'Concept','null','null','null','0','0','0','0',NULL,NULL),(5966,'0',5965,3961,'0',1000,'null','0','1','null','null','null','1','0','0','null','null',0,'Concept','null','null','null','0','0','0','0',NULL,NULL),(5968,'0',5967,4313,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,'null',0,'Concept',NULL,NULL,'Concept','0','0','0','0',NULL,NULL),(5970,'0',5969,15,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,'null',0,'Name',NULL,'CBM.Concept','c.Description','0','0','0','0',NULL,NULL),(5998,'0',5997,117,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,'null',0,'Name',NULL,'CBM.PrgComponent','pc.Description','0','0','0','0',NULL,NULL),(6000,'0',5999,133,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,'null',0,'Name',NULL,NULL,'Description','0','0','0','0',NULL,NULL),(6002,'0',6001,135,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,'null',0,'Name',NULL,NULL,'Description','0','0','0','0',NULL,NULL),(6006,'0',6005,181,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,'null',0,'Name',NULL,'CBM.PrgView','cv.Description','0','0','0','0',NULL,NULL),(6008,'0',6007,412,'0',1000,'null','0','1','null','null','null','1','0','0','null','null',0,'Name','null','null','null','0','0','0','0',NULL,NULL),(6016,'0',6015,1230,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,'null',0,'Name',NULL,NULL,'Description','0','0','0','0',NULL,NULL),(6018,'0',6017,1233,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,'null',0,'Name',NULL,NULL,'Description','0','0','0','0',NULL,NULL),(6024,'0',6023,2803,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,'null',0,'Name',NULL,'CBM.EntityKind','ek.Description','0','0','0','0',NULL,NULL),(6026,'0',6025,3221,'0',1000,'null','0','1','null','null','null','1','0','0','null','null',0,'Name','null','CBM.Role','r.Description','0','0','0','0',NULL,NULL),(6028,'0',6027,3245,'0',1000,'null','0','1','null','null','null','1','0','0','null','null',0,'Name','null','null','null','0','0','0','0',NULL,NULL),(6030,'0',6029,3263,'0',1000,'null','0','1','null','null','null','1','0','0','null','null',0,'Name','null','null','null','0','0','0','0',NULL,NULL),(6032,'0',6031,3961,'0',1000,'null','0','1','null','null','null','1','0','0','null','null',0,'Name','null','null','null','0','0','0','0',NULL,NULL),(5757,'0',5756,2803,'1',20,NULL,'1','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Parent',NULL,'CBM.EntityKind','ek.Parent','0','0','0','0',NULL,NULL),(5772,'0',5771,2803,'0',400,NULL,'0','0',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Hierarchy Code',NULL,'CBM.EntityKind','ek.HierCode','0','0','0','0',NULL,NULL),(6038,'0',6037,2803,'0',400,NULL,'0','0',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Code','Short code of position','CBM.EntityKind','ek.Code','0','0','0','0',NULL,NULL),(6053,'0',6052,2803,'0',200,NULL,'0','0',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'System Code','System code of position','CBM.EntityKind','ek.SysCode','0','0','0','0',NULL,NULL),(6056,'0',6055,2803,'0',1,NULL,'0','0',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Actual','Actual','CBM.EntityKind','ek.Actual','0','0','0','0',NULL,NULL),(6058,'0',6057,2803,'0',20,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Source Installation',NULL,'CBM.EntityKind','ek.Source','0','0','0','0',NULL,NULL),(7416,'0',7415,2803,'0',4000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Name',NULL,'CBM.EntityKind','ek.Notes','0','0','0','0',NULL,NULL),(7497,'0',7496,1229,'0',1,'null','0','0','null','null','null','0','0','0','null','null',0,'Del','null','null','Del','0','0','0','0',NULL,NULL),(7505,'0',7504,1229,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,'null',0,'Concept',NULL,NULL,'Concept','0','0','0','0',NULL,NULL),(7513,'0',7512,1229,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,'null',0,'Name',NULL,NULL,'Description','0','0','0','0',NULL,NULL),(7433,'0',7432,131,'0',1,NULL,'0','0',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Abnormal Inheritance','Flag that Class is protected from different parent class influences (like attributes propagating). Maintained by hand.','CBM.Concept','c.AbnormalInherit','0','0','0','0',NULL,NULL),(7569,'0',7568,110,'0',0,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Menu Items',NULL,NULL,NULL,'0','0','0','0',NULL,NULL),(7780,'0',7779,7778,'0',0,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'ID','Identifier','CBM.PrgAttribute','pa.ID','0','0','0','0',NULL,NULL),(7779,'0',7781,7778,'0',1,NULL,'0','0',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Del',NULL,'CBM.PrgAttribute','pa.Del','0','0','0','0',NULL,NULL),(7781,'0',7783,7778,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Concept',NULL,NULL,NULL,'0','0','0','0',NULL,NULL),(7794,'0',7796,7778,'0',NULL,NULL,'0','1',NULL,'false',NULL,'1','1','1',NULL,NULL,NULL,'Constant','Attribute once initialized cannot be changed in the future','CBM.PrgAttribute','pa.Const','0','0','0','0',NULL,NULL),(7795,'0',7797,7778,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Countable',NULL,'CBM.PrgAttribute','pa.Countable','0','0','0','0',NULL,NULL),(7796,'0',7798,7778,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Historical attribute',NULL,'CBM.PrgAttribute','pa.Historical','0','0','0','0',NULL,NULL),(7797,'0',7799,7778,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Versioned',NULL,'CBM.PrgAttribute','pa.Versioned','0','0','0','0',NULL,NULL),(7798,'0',7800,7778,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Part','Part of Entity in meta-data sence','CBM.PrgAttribute','pa.VersPart','0','0','0','0',NULL,NULL),(7799,'0',7801,7778,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'MainPartID','What attribute MainID points to','CBM.PrgAttribute','pa.MainPartID','0','0','0','0',NULL,NULL),(7800,'0',7802,7778,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Root','Root for Hierarchy','CBM.PrgAttribute','pa.Root','0','0','0','0',NULL,NULL),(7802,'0',7804,7778,'0',NULL,NULL,'0','0',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'MainID',NULL,'CBM.PrgAttribute','pa.ForRelation','0','0','0','0',NULL,NULL),(7804,'0',7806,7778,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Name',NULL,'CBM.PrgAttribute','pa.DisplayName','0','0','0','0',NULL,NULL),(7805,'0',7807,7778,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Notes',NULL,'CBM.PrgAttribute','pa.Notes','0','0','0','0',NULL,NULL),(7806,'0',7808,7778,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Modified',NULL,'CBM.PrgAttribute','pa.Modified','0','0','0','0',NULL,NULL),(7809,'0',7811,7778,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'UIMandatory',NULL,'CBM.PrgAttribute','pa.Mandatory','0','0','0','0',NULL,NULL),(7807,'0',7809,7778,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Size',NULL,'CBM.PrgAttribute','pa.Size','0','0','0','0',NULL,NULL),(7811,'0',7813,7778,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'ExprEval',NULL,'CBM.PrgAttribute','pa.ExprEval','0','0','0','0',NULL,NULL),(7812,'0',7814,7778,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'ExprDefault',NULL,'CBM.PrgAttribute','pa.ExprDefault','0','0','0','0',NULL,NULL),(7813,'0',7815,7778,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'ExprValidate',NULL,'CBM.PrgAttribute','pa.ExprValidate','0','0','0','0',NULL,NULL),(7810,'0',7812,7778,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'IsPublic',NULL,'CBM.PrgAttribute','pa.IsPublic','0','0','0','0',NULL,NULL),(7815,'0',7817,7778,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'CopyLinked',NULL,'CBM.PrgAttribute','pa.CopyLinked','0','0','0','0',NULL,NULL),(7814,'0',7816,7778,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'CopyValue',NULL,'CBM.PrgAttribute','pa.CopyValue','0','0','0','0',NULL,NULL),(7808,'0',7810,7778,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'LinkFilter',NULL,'CBM.PrgAttribute','pa.LinkFilter','0','0','0','0',NULL,NULL),(7816,'0',7818,7778,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'DeleteLinked',NULL,'CBM.PrgAttribute','pa.DeleteLinked','0','0','0','0',NULL,NULL),(7817,'0',7819,7778,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Role of Relation in Concept internal stucture',NULL,'CBM.PrgAttribute','pa.RelationStructRole','0','0','0','0',NULL,NULL),(7818,'0',7820,7778,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'DBTable',NULL,'CBM.PrgAttribute','pa.DBTable','0','0','0','0',NULL,NULL),(7819,'0',7821,7778,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'DBColumn',NULL,'CBM.PrgAttribute','pa.DBColumn','0','0','0','0',NULL,NULL),(8062,'0',8061,7778,'0',20,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Prg class for which this Attribute belongs','Prg class for which this Attribute belongs','CBM.PrgAttribute','pa.ForPrgClass','0','0','0','0',NULL,NULL),(8537,'0',8536,412,'0',250,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Description version for UI',NULL,'CBM.PrgViewField','cvf.Title','0','0','0','0',NULL,NULL);
/*!40000 ALTER TABLE `prgattribute` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prgclass`
--

DROP TABLE IF EXISTS `prgclass`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prgclass` (
  `ID` bigint(20) NOT NULL,
  `Del` char(1) DEFAULT '0',
  `ForConcept` bigint(20) NOT NULL,
  `PrgVersion` bigint(20) DEFAULT '333',
  `Description` varchar(400) DEFAULT NULL,
  `Notes` varchar(2000) DEFAULT NULL,
  `ExprToString` varchar(2000) DEFAULT NULL,
  `DataBaseStore` bigint(20) DEFAULT NULL,
  `ExprFrom` varchar(4000) DEFAULT NULL,
  `ExprWhere` varchar(4000) DEFAULT NULL,
  `ExprOrder` varchar(1000) DEFAULT 'ID',
  `ExprGroup` varchar(1000) DEFAULT NULL,
  `ExprHaving` varchar(2000) DEFAULT NULL,
  `PrgPackage` varchar(120) DEFAULT '',
  `PrgType` varchar(120) DEFAULT '',
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prgclass`
--

LOCK TABLES `prgclass` WRITE;
/*!40000 ALTER TABLE `prgclass` DISABLE KEYS */;
INSERT INTO `prgclass` VALUES (15,'0',14,333,'Concept with Class','Complex which represents Concept and related PrgClass','SysCode',1469,'CBM.Concept c INNER JOIN CBM.PrgClass cv ON cv.ForConcept = c.ID and cv.Del=0 INNER JOIN CBM.PrgVersion vers on vers.ID=cv.PrgVersion and vers.Actual=1 and vers.Del=0',NULL,'c.SysCode',NULL,NULL,'',''),(19,'0',18,333,'Integer',NULL,NULL,NULL,NULL,NULL,'ID',NULL,NULL,'',''),(21,'0',20,333,'Big Integer',NULL,NULL,NULL,NULL,NULL,'ID',NULL,NULL,'',''),(23,'0',22,333,'Decimal',NULL,NULL,NULL,NULL,NULL,'ID',NULL,NULL,'',''),(25,'0',24,333,'Big Decimal',NULL,NULL,NULL,NULL,NULL,'ID',NULL,NULL,'',''),(27,'0',26,333,'Money','Money',NULL,NULL,NULL,NULL,'ID',NULL,NULL,'',''),(29,'0',28,333,'String',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'CBMCore',''),(31,'0',30,333,'Short String888',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',''),(33,'0',32,333,'Long String',NULL,NULL,NULL,NULL,NULL,'ID',NULL,NULL,'',''),(35,'0',34,333,'Text',NULL,NULL,NULL,NULL,NULL,'ID',NULL,NULL,'',''),(37,'0',36,333,'Date',NULL,NULL,NULL,NULL,NULL,'ID',NULL,NULL,'',''),(39,'0',38,333,'Date Time',NULL,NULL,NULL,NULL,NULL,'ID',NULL,NULL,'',''),(41,'0',40,333,'DateTime Precize',NULL,NULL,NULL,NULL,NULL,'ID',NULL,NULL,'',''),(54,'0',53,333,'Boolean',NULL,NULL,NULL,NULL,NULL,'ID',NULL,NULL,'',''),(63,'0',62,333,'Programm Attributes','Attribute that model some Accosiation of this (any) object and some related type','SysCode',1469,'CBM.Relation r INNER JOIN CBM.PrgAttribute rv ON rv.ForRelation=r.ID',NULL,'r.Odr, r.ID',NULL,NULL,'',''),(110,'0',108,333,'Programm Menu','Menu object - simply header and common point of Menu Items',NULL,1469,'CBM.PrgMenu',NULL,'SysCode',NULL,NULL,'',''),(111,'0',109,333,'Programm Menu Item','Programm Menu Item',NULL,1469,'CBM.PrgMenuItem',NULL,'ForMenu, Odr',NULL,NULL,'',''),(117,'0',116,333,'PrgComponent',NULL,NULL,1469,'CBM.PrgComponent pc',NULL,'ID',NULL,NULL,'',''),(131,'0',130,333,'Anything Categories','Anything Type - The main semantic classifier of all concepts of the world. First-class classifier by structural differrences.',NULL,1469,'CBM.Concept c',NULL,'c.SysCode',NULL,NULL,'',''),(133,'0',132,333,'Kinds of Changes',NULL,NULL,1469,'CBM.ChangeType',NULL,'ID',NULL,NULL,'',''),(135,'0',134,333,'Consistent Object','Consistent element - Object in common sence',NULL,1469,'CBM.Object',NULL,'ID',NULL,NULL,'',''),(144,'0',143,333,'Window size and position for User','Window size and position for User (and optional context)',NULL,1469,'CBM.WindowSettings ws',NULL,'ws.ID',NULL,NULL,NULL,NULL),(149,'0',148,333,'Relation Kind','Kinds of Relations (Attributes) - generalized meaning of semantically the same attributes ',NULL,1469,'CBM.RelationKind rk',NULL,'rk.ID',NULL,NULL,NULL,NULL),(181,'0',180,333,'View of this Type','Interface View of some Type',NULL,1469,'CBM.PrgView cv',NULL,'cv.SysCode',NULL,NULL,NULL,NULL),(412,'0',411,333,'PrgViewField','Attributes inclusion into UI View',NULL,1469,'CBM.PrgViewField cvf INNER JOIN CBM.Relation r on r.ID = cvf.ForRelation',NULL,'cvf.Odr',NULL,NULL,NULL,NULL),(454,'0',453,333,'Table View size and position for User','Table View size and position for User (and optional context)',NULL,1469,'CBM.ListSettings ls',NULL,'ls.ID',NULL,NULL,NULL,NULL),(972,'0',971,333,'Role of Entity in Activity','Roles that any entity play in some activity',NULL,1469,'CBM.Role r',NULL,'ID',NULL,NULL,NULL,NULL),(1195,'0',1194,333,'Everything exists in reality or in thoughts','Any Thing - some real or abstract entity of the world',NULL,NULL,NULL,NULL,'ID',NULL,NULL,'',''),(1230,'0',1228,333,'Anything that exits in the world beyond anybody\'s  mind','Anything Existing: Objects and their relations',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1229,'0',1227,333,'Structure','Relations, Links, Roles, week Compositions of Objects',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1233,'0',1232,333,'Abstraction','Any Abstractions, Concepts, Taxonomies, Knowledge, Information, Thoughts, Plans, ...',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1239,'0',1238,333,'Any Change in Substanses, Abstractions, or their Relations','Any changes in Instances or Abstractions. Changes of any other Thing (Instance or Abstraction). May be primitive, or complicated.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1237,'0',1236,333,'Scalar Types','Primitive value-types',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(7235,'0',1234,333,'Event','Some changes that happends beyond any actor participation',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(7234,'0',1235,333,'Transaction','Changes that is result of some activity',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1242,'0',1241,333,'Process','Complex of Transactions',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1625,'0',1624,333,'Relation Concept','Associations of Concept with other (including Primitive properties)',NULL,NULL,'CBM.Relation r',NULL,'r.Odr, r.ID',NULL,NULL,NULL,NULL),(1505,'0',1504,333,'Programm Versions','Named version of program components',NULL,NULL,'CBM.PrgVersion pv',NULL,'pv.ID',NULL,NULL,NULL,NULL),(1768,'0',1767,333,'Program Class Metadata','Information System related properties of Concept - for work with that concept instances in IS','Code',NULL,'CBM.PrgClass pc inner join CBM.PrgVersion vers on vers.ID=pc.PrgVersion and vers.Actual=1 and vers.Del=0','pc.Del=0','pc.Description',NULL,NULL,'',''),(1829,'0',1828,333,'DataBaseStore','DataBaseStore','SysCode',NULL,'CBM.DataBaseStore dbs','dbs.Del=0','dbs.SysCode',NULL,NULL,'',''),(2542,'0',2541,333,'Right for something','The most abstract kind of Rights - as permission of Somebody make any Activitieson Something',NULL,NULL,'CBM.Right r',NULL,'r.ForType, r.ForUser, r.ID',NULL,NULL,NULL,NULL),(2803,'0',2802,333,'Main Entities classifier','Main (in Aristotle sense) classifiers of everything',NULL,NULL,'CBM.EntityKind ek',NULL,'ek.Code',NULL,NULL,NULL,NULL),(3221,'0',3220,333,'Roles','Role-related sets of some entity properties',NULL,NULL,'CBM.Role r',NULL,'r.ID',NULL,NULL,NULL,NULL),(3245,'0',3244,333,'Information','Information as Intangible Substance ',NULL,NULL,NULL,NULL,'ID',NULL,NULL,'',''),(3263,'0',3262,333,'Tangible object','Tangible object',NULL,NULL,NULL,NULL,'ID',NULL,NULL,'',''),(3961,'0',3960,333,'Intangible object','Intangible object',NULL,NULL,NULL,NULL,'ID',NULL,NULL,'',''),(4313,'0',4312,333,'Associations','Any Associations, relations, even properties (which are the kind of associations), roles (which are complicated kind of associations too), so on... ',NULL,NULL,NULL,NULL,'ID',NULL,NULL,'',''),(7555,'0',7554,333,'Buildings',NULL,NULL,NULL,'CBM.Obj o',NULL,'ID',NULL,NULL,'',''),(7778,'0',7777,333,'Programm Attributes','Attribute that model IS-aspects of some Accosiation of this (any) object and some related type','SysCode',NULL,'CBM.PrgAttribute pa',NULL,'pa.ID',NULL,NULL,'','');
/*!40000 ALTER TABLE `prgclass` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prgcomponent`
--

DROP TABLE IF EXISTS `prgcomponent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prgcomponent` (
  `ID` bigint(20) NOT NULL,
  `Del` char(1) DEFAULT '0',
  `SysCode` varchar(200) DEFAULT NULL,
  `Concept` bigint(20) DEFAULT NULL,
  `EntityKind` bigint(20) DEFAULT NULL,
  `Installation` bigint(20) DEFAULT NULL,
  `Description` varchar(400) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prgcomponent`
--

LOCK TABLES `prgcomponent` WRITE;
/*!40000 ALTER TABLE `prgcomponent` DISABLE KEYS */;
INSERT INTO `prgcomponent` VALUES (14,'0','PrgClass',14,10,17,NULL),(17,'0','CBM',116,16,17,NULL),(18,'0','Integer',14,10,17,NULL),(20,'0','Bigint',14,10,17,NULL),(22,'0','Decimal',14,10,17,NULL),(24,'0','BigDecimal',14,10,17,NULL),(26,'0','Money',14,10,17,NULL),(28,'0','String',14,10,17,NULL),(30,'0','ShortString',14,10,17,NULL),(32,'0','LongString',14,10,17,NULL),(34,'0','Text',14,10,17,NULL),(36,'0','Date',14,10,17,NULL),(38,'0','DateTime',14,10,17,NULL),(40,'0','TimePrecize',14,10,17,NULL),(42,'0','ID',62,11,17,NULL),(43,'0','UID',62,11,17,NULL),(44,'0','SysCode',62,11,17,NULL),(45,'0','Del',62,11,17,NULL),(46,'0','Installation',62,11,17,NULL),(47,'0','AnyType',62,11,17,NULL),(48,'0','Superclass',62,11,17,NULL),(49,'0','Prg',62,11,17,NULL),(50,'0','Primitive',62,11,17,NULL),(51,'0','Abstract',62,11,17,NULL),(52,'0','Category',62,11,17,NULL),(53,'0','Boolean',14,10,17,NULL),(55,'0','PrgClassVersion',62,11,17,NULL),(56,'0','Actual',62,11,17,NULL),(57,'0','Dated',62,11,17,NULL),(58,'0','Name',62,11,17,NULL),(59,'0','Note',62,11,17,NULL),(60,'0','PrgPackage',62,11,17,NULL),(61,'0','PrgType',62,11,17,NULL),(62,'0','PrgAttribute',14,10,17,NULL),(64,'0','ExprToString',62,11,17,NULL),(65,'0','ExprFrom',62,11,17,NULL),(66,'0','ExprWhere',62,11,17,NULL),(67,'0','ExprGroup',62,11,17,NULL),(68,'0','ExprHaving',62,11,17,NULL),(69,'0','ExprOrder',62,11,17,NULL),(70,'0','ID',62,11,17,NULL),(71,'0','UID',62,11,17,NULL),(72,'0','SysCode',62,11,17,NULL),(73,'0','Del',62,11,17,NULL),(77,'0','Name',62,11,17,NULL),(78,'0','Note',62,11,17,NULL),(79,'0','AttributeKind',62,11,17,NULL),(80,'0','PointedClass',62,11,17,NULL),(81,'0','CounterAttribute',62,11,17,NULL),(82,'0','CrossClass',62,11,17,NULL),(83,'0','CrossAttribute',62,11,17,NULL),(84,'0','IsPublic',62,11,17,NULL),(85,'0','ExprEval',62,11,17,NULL),(86,'0','ExprDefault',62,11,17,NULL),(87,'0','ExprValidate',62,11,17,NULL),(88,'0','LinkFilter',62,11,17,NULL),(89,'0','CopyValue',62,11,17,NULL),(90,'0','CopyLinked',62,11,17,NULL),(91,'0','DeleteLinked',62,11,17,NULL),(92,'0','Countable',62,11,17,NULL),(93,'0','InheritedFrom',62,11,17,NULL),(94,'0','Modified',62,11,17,NULL),(95,'0','Historical',62,11,17,NULL),(96,'0','Versioned',62,11,17,NULL),(97,'0','DBTable',62,11,17,NULL),(98,'0','DBColumn',62,11,17,NULL),(99,'0','Seqn',62,11,17,NULL),(101,'0','UIMandatory',62,11,17,NULL),(470,'0','Attributes',62,11,17,NULL),(103,'0','MainMenu',108,12,17,NULL),(108,'0','PrgMenu',14,10,17,NULL),(109,'0','PrgMenuItem',14,10,17,NULL),(112,'0','ID',62,11,17,NULL),(113,'0','SysCode',62,11,17,NULL),(114,'0','Name',62,11,17,NULL),(115,'0','Parent',62,11,17,NULL),(116,'0','PrgComponent',14,10,17,NULL),(118,'0','ID',62,11,17,NULL),(119,'0','UID',62,11,17,NULL),(120,'0','SysCode',62,11,17,NULL),(121,'0','Del',62,11,17,NULL),(122,'0','Installation',62,11,17,NULL),(123,'0','AnyType',62,11,17,NULL),(126,'0','MainID',62,11,17,NULL),(125,'0','PrgClass_VersID',62,11,17,NULL),(124,'0','PrgClassID',62,11,17,NULL),(127,'0','AnyType',14,10,17,NULL),(130,'0','Concept',14,10,17,NULL),(132,'0','ChangeType',14,10,17,NULL),(134,'0','Object',14,10,17,NULL),(136,'0','ForClassVers',62,11,17,NULL),(137,'0','PrgClass',62,11,17,NULL),(138,'0','PrgClass',62,11,17,NULL),(139,'0','UIForms',62,11,17,NULL),(140,'0','PrgAttr_VersID',62,11,17,NULL),(143,'0','WindowSettings',14,10,17,NULL),(145,'0','ID',62,11,17,NULL),(148,'0','AttributeKind',14,10,17,NULL),(154,'0','ID',62,11,17,NULL),(155,'0','UID',62,11,17,NULL),(156,'0','SysCode',62,11,17,NULL),(157,'0','DEL',62,11,17,NULL),(158,'0','Installation',62,11,17,NULL),(159,'0','AnyType',62,11,17,NULL),(160,'0','PrgClass',62,11,17,NULL),(161,'0','Note',62,11,17,NULL),(162,'0','UID',62,11,17,NULL),(164,'0','SysCode',62,11,17,NULL),(166,'0','Del',62,11,17,NULL),(167,'0','Installation',62,11,17,NULL),(168,'0','AnyType',62,11,17,NULL),(169,'0','PrgClass',62,11,17,NULL),(171,'0','ForType',62,11,17,NULL),(172,'0','Win',62,11,17,NULL),(174,'0','Context',62,11,17,NULL),(176,'0','ForUser',62,11,17,NULL),(178,'0','Position',62,11,17,NULL),(180,'0','PrgView',14,10,17,NULL),(182,'0','ID',62,11,17,NULL),(183,'0','UID',62,11,17,NULL),(184,'0','SysCode',62,11,17,NULL),(185,'0','Del',62,11,17,NULL),(186,'0','InstallationID',62,11,17,NULL),(187,'0','AnyTypeID',62,11,17,NULL),(188,'0','PrgClassID',62,11,17,NULL),(291,'0','PrgComponent',180,1,17,NULL),(292,'0','PrgClass',180,1,17,NULL),(293,'0','PrgAttribute',180,1,17,NULL),(294,'0','AttributeKind',180,10,17,NULL),(295,'0','PrgMenuItem',180,1,17,NULL),(296,'0','PrgView',180,1,17,NULL),(400,'0','PrgAttrID',62,11,17,NULL),(401,'0','ForClass',62,11,17,NULL),(404,'0','PrgViewID',62,11,17,NULL),(406,'0','ForClass',62,11,17,NULL),(408,'0','MainID',62,11,17,NULL),(411,'0','PrgViewField',14,10,17,NULL),(413,'0','ID',62,11,17,NULL),(415,'0','ID',62,11,17,NULL),(417,'0','PrgView',62,11,17,NULL),(419,'0','PrgAttr',62,11,17,NULL),(421,'0','PrgAttr',62,11,17,NULL),(423,'0','Seqn',62,11,17,NULL),(425,'0','UIPath',62,11,17,NULL),(427,'0','Mandatory',62,11,17,NULL),(455,'0','SysCode',62,11,17,NULL),(431,'0','Hidden',62,11,17,NULL),(433,'0','InList',62,11,17,NULL),(436,'0','Note',62,11,17,NULL),(489,'0','ControlType',62,11,17,NULL),(451,'0','PrgViewField',180,1,17,NULL),(453,'0','ListSettings',14,10,17,NULL),(473,'0','Size',62,11,17,NULL),(475,'0','Const',62,11,17,NULL),(477,'0','Domain',62,11,17,NULL),(479,'0','AttrSpecType',62,11,17,NULL),(481,'0','Part',62,11,17,NULL),(485,'0','MainPartID',62,11,17,NULL),(487,'0','Root',62,11,17,NULL),(491,'0','ShowTitle',62,11,17,NULL),(493,'0','Editable',62,11,17,NULL),(495,'0','DataSourceView',62,11,17,NULL),(497,'0','ValueField',62,11,17,NULL),(499,'0','DisplayField',62,11,17,NULL),(501,'0','PickListWidth',62,11,17,NULL),(503,'0','ViewOnly',62,11,17,NULL),(552,'0','WindowSettings',180,1,17,NULL),(551,'0','ListSettings',180,1,17,NULL),(587,'0','AnyType',62,11,17,NULL),(593,'0','AnyObject',180,10,17,NULL),(601,'0','Date',62,11,17,NULL),(804,'0','UID',62,11,17,NULL),(802,'0','ID',62,11,17,NULL),(806,'0','Del',62,11,17,NULL),(808,'0','InstallationID',62,11,17,NULL),(810,'0','ForType',62,11,17,NULL),(812,'0','Win',62,11,17,NULL),(814,'0','Context',62,11,17,NULL),(816,'0','ForUser',62,11,17,NULL),(818,'0','Settings',62,11,17,NULL),(971,'0','Role',14,10,17,NULL),(978,'0','ID',62,11,17,NULL),(980,'0','SysCode',62,11,17,NULL),(996,'0','Name',62,11,17,NULL),(998,'0','Role',180,1,17,NULL),(1194,'0','Thing',14,10,17,NULL),(1201,'0','ID',62,0,17,NULL),(1200,'0','SyCode',62,0,17,NULL),(1228,'0','Instance',14,NULL,17,NULL),(1227,'0','Structure',14,NULL,17,NULL),(1232,'0','Abstraction',14,NULL,NULL,NULL),(1233,'0','Substance',14,NULL,NULL,NULL),(1236,'0','Primitive',14,NULL,17,NULL),(1238,'0','Change',14,NULL,17,NULL),(1234,'0','Event',14,NULL,17,NULL),(1235,'0','Trtansaction',14,NULL,17,NULL),(1241,'0','Process',14,NULL,17,NULL);
/*!40000 ALTER TABLE `prgcomponent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prgmenu`
--

DROP TABLE IF EXISTS `prgmenu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prgmenu` (
  `ID` bigint(20) NOT NULL,
  `Del` char(1) DEFAULT '0',
  `SysCode` varchar(128) DEFAULT NULL,
  `Description` varchar(400) DEFAULT NULL,
  `Concept` bigint(20) DEFAULT '108',
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prgmenu`
--

LOCK TABLES `prgmenu` WRITE;
/*!40000 ALTER TABLE `prgmenu` DISABLE KEYS */;
INSERT INTO `prgmenu` VALUES (103,'0','Main','Main Menu (Navigator)',108);
/*!40000 ALTER TABLE `prgmenu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prgmenuitem`
--

DROP TABLE IF EXISTS `prgmenuitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prgmenuitem` (
  `ID` bigint(20) NOT NULL,
  `ParentItem` bigint(20) DEFAULT NULL,
  `Odr` smallint(6) DEFAULT '9999',
  `ForMenu` bigint(20) DEFAULT NULL,
  `SysCode` varchar(100) DEFAULT NULL,
  `Description` varchar(400) DEFAULT NULL,
  `CalledConcept` bigint(20) DEFAULT NULL,
  `CalledMethod` varchar(200) DEFAULT NULL,
  `Args` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prgmenuitem`
--

LOCK TABLES `prgmenuitem` WRITE;
/*!40000 ALTER TABLE `prgmenuitem` DISABLE KEYS */;
INSERT INTO `prgmenuitem` VALUES (104,NULL,3000,103,'MetaData','MetaProgramming section',NULL,NULL,NULL),(106,104,4010,103,'ConceptPrgClass','Alternative MetaData editor (Concepts with IS extencion)',14,'0',NULL),(146,104,3050,103,'RelationKind','Assosiations Types',NULL,'0',NULL),(1442,104,2010,103,'Concept','Metadata editor (Concepts - ontology view)',130,'0',NULL),(1917,NULL,2000,103,'Master Data','Master Data section',NULL,NULL,NULL),(3193,NULL,100,103,'WorkArea','Applications',NULL,NULL,NULL),(3205,3193,3000,103,'ALM','ALM - Application Lifecycle Management',NULL,NULL,NULL),(3206,3193,201,103,'CRM','CRM - Customer Relations Management',NULL,NULL,NULL),(3208,3193,700,103,'EAM','EAM - Enterprise Assets Management',NULL,NULL,NULL),(3209,3205,10,103,'Products','Product construction',NULL,NULL,NULL),(3211,3205,20,103,'Development','Development process',NULL,NULL,NULL),(3213,3205,40,103,'ImplementProjects','Implementation projects',NULL,NULL,NULL),(3214,3205,50,103,'Support','Customer support process',NULL,NULL,NULL),(3215,3208,10,103,'Assets','Assets list',NULL,'1',NULL),(3216,3206,40,103,'Customers','Customers',NULL,'1',NULL),(3217,3206,10,103,'Incidents','Incidents',NULL,'1',NULL),(3218,3193,4000,103,'ERP','ERP - Full-featured Enterpise-wide application',NULL,'0',NULL),(3219,3218,700,103,'EAM','EAM - Enterprise Assets Management',NULL,'0',NULL),(7074,1917,2005,103,'EntityKind','Entity Kinds',NULL,NULL,NULL),(7560,1917,2005,103,'ChangeKind','Activities Kinds',NULL,'0',NULL),(7562,104,3320,103,'PrgMenu','Menus',NULL,'0',NULL);
/*!40000 ALTER TABLE `prgmenuitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prgversion`
--

DROP TABLE IF EXISTS `prgversion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prgversion` (
  `ID` bigint(20) NOT NULL,
  `Del` char(1) DEFAULT '0',
  `SysCode` varchar(200) DEFAULT NULL,
  `Description` varchar(2000) NOT NULL,
  `Owner` bigint(20) DEFAULT NULL,
  `DateMark` datetime DEFAULT NULL,
  `Actual` char(1) DEFAULT '1',
  `ExprFilter` varchar(4000) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prgversion`
--

LOCK TABLES `prgversion` WRITE;
/*!40000 ALTER TABLE `prgversion` DISABLE KEYS */;
INSERT INTO `prgversion` VALUES (333,'0','CBM default','Initial Default Version',NULL,'2012-09-01 00:00:00','1',NULL),(3,'0','RUS Gov','Russian Government- related Domain classes',NULL,'2014-02-09 00:51:00','0',NULL);
/*!40000 ALTER TABLE `prgversion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prgview`
--

DROP TABLE IF EXISTS `prgview`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prgview` (
  `ID` bigint(20) NOT NULL,
  `Del` char(1) DEFAULT '0',
  `Concept` bigint(20) DEFAULT NULL,
  `ForConcept` bigint(20) DEFAULT NULL,
  `SysCode` varchar(200) DEFAULT NULL,
  `Description` varchar(400) DEFAULT NULL,
  `Notes` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prgview`
--

LOCK TABLES `prgview` WRITE;
/*!40000 ALTER TABLE `prgview` DISABLE KEYS */;
INSERT INTO `prgview` VALUES (291,'0',NULL,116,'PrgComponent',NULL,'Program Components Default View'),(292,'0',NULL,14,'ConceptPrgClass',NULL,'Programm Class View'),(293,'0',NULL,62,'RelationPrgAttribute',NULL,'Default View of Relation with Attribute - that model some Accosiation of this (any) object and some related type'),(294,'0',NULL,148,'RelationKind',NULL,'RelationKind'),(295,'0',NULL,109,'PrgMenuItem',NULL,'Prg Menu Item default View'),(296,'0',NULL,180,'PrgView',NULL,'View for Prg View itself'),(451,'0',NULL,411,'PrgViewField',NULL,'The View for \"View Items\" themself'),(552,'0',NULL,143,'WindowSettings',NULL,'UI View for Window size and position.'),(551,'0',NULL,453,'ListSettings',NULL,'UI View for Table View size and position'),(587,'0',NULL,130,'Concept',NULL,'UI View for Concept'),(593,'0',NULL,134,'Particular',NULL,'UI View for Object'),(601,'0',NULL,36,'Date',NULL,'UI View for Date'),(998,'0',NULL,971,'Role',NULL,'UI View for Role in Activity'),(1520,'0',NULL,NULL,'PrgClassVersion',NULL,NULL),(1547,'0',NULL,1504,'PrgVersion',NULL,NULL),(1649,'0',NULL,1624,'Relation',NULL,NULL),(1851,'0',NULL,1767,'PrgClass',NULL,NULL),(2100,'0',NULL,1828,'DataBaseStore','DataBaseStore','DataBaseStore'),(2140,'0',NULL,180,'PrgViewShort','View of this Type','Interface View of some Type'),(2130,'0',NULL,NULL,NULL,NULL,NULL),(2572,'0',NULL,2541,'UserRights','Right forSomething','The most abstract kind of Rights - as permission of Somebody make any Activitieson Something'),(2570,'0',NULL,NULL,NULL,NULL,NULL),(3181,'0',NULL,108,'PrgMenu','Programm Menu','Menu object - simply header and common point of Menu Items'),(6990,'0',NULL,2802,'EntityKind','Main Entities classifier','Main (in Aristotle sense) classifiers of everything'),(7900,'0',NULL,7777,'PrgAttribute','PrgAttribue view ',NULL);
/*!40000 ALTER TABLE `prgview` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prgviewfield`
--

DROP TABLE IF EXISTS `prgviewfield`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prgviewfield` (
  `ID` bigint(20) NOT NULL,
  `Del` char(1) DEFAULT '0',
  `SysCode` varchar(128) DEFAULT NULL,
  `Title` varchar(400) DEFAULT NULL,
  `ForPrgView` bigint(20) NOT NULL,
  `ForRelation` bigint(20) DEFAULT NULL,
  `Odr` smallint(6) DEFAULT NULL,
  `UIPath` varchar(400) DEFAULT NULL,
  `Mandatory` char(1) DEFAULT '0',
  `Hidden` char(1) DEFAULT '0',
  `ViewOnly` char(1) DEFAULT '0',
  `InList` char(1) DEFAULT '1',
  `ControlType` varchar(200) DEFAULT NULL,
  `ShowTitle` char(1) DEFAULT '1',
  `Editable` char(1) DEFAULT '1',
  `Hint` varchar(1000) DEFAULT NULL,
  `DataSourceView` varchar(200) DEFAULT NULL,
  `ValueField` varchar(200) DEFAULT NULL,
  `DisplayField` varchar(200) DEFAULT NULL,
  `PickListWidth` int(11) DEFAULT NULL,
  `CreateFromMethods` varchar(19000) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prgviewfield`
--

LOCK TABLES `prgviewfield` WRITE;
/*!40000 ALTER TABLE `prgviewfield` DISABLE KEYS */;
INSERT INTO `prgviewfield` VALUES (297,'0','ID',NULL,292,42,1,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(298,'0','UID',NULL,292,43,20,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(299,'0','SysCode',NULL,292,44,30,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(300,'0','Del',NULL,292,45,40,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(301,'0','Installation',NULL,292,46,50,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(302,'0','AnyType',NULL,292,47,60,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(303,'0','BaseConcept',NULL,292,48,75,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(304,'0','Prg',NULL,292,49,80,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(305,'0','Primitive',NULL,292,50,90,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(306,'0','Abstract',NULL,292,51,100,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(307,'0','Category',NULL,292,52,110,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(308,'0','PrgVersion',NULL,292,55,125,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(309,'0','Actual',NULL,292,56,130,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(310,'0','Dated',NULL,292,57,140,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(311,'0','Description',NULL,292,58,150,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(312,'0','Notes',NULL,292,59,160,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(313,'0','PrgPackage',NULL,292,60,170,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(314,'0','PrgType',NULL,292,61,180,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(315,'0','ExprToString',NULL,292,64,190,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(316,'0','ExprFrom',NULL,292,65,200,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(317,'0','ExprWhere',NULL,292,66,210,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(318,'0','ExprGroup',NULL,292,67,230,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(319,'0','ExprHaving',NULL,292,68,240,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(320,'0','ExprOrder',NULL,292,69,220,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(321,'0','ID',NULL,293,70,0,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(322,'0','UID',NULL,293,71,20,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(323,'0','SysCode',NULL,293,72,30,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(324,'0','Del',NULL,293,73,1,NULL,'1','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1566,'0','SysCode',NULL,1547,1528,10,NULL,'1','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(327,'0','BackLinkRelation',NULL,293,81,125,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(329,'0','DisplayName',NULL,293,77,330,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(330,'0','PrgAttributeNotes',NULL,293,78,340,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(331,'0','RelationKind',NULL,293,79,110,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(332,'0','RelatedConcept',NULL,293,80,100,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(333,'0','CrossConcept',NULL,293,82,130,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(334,'0','CrossRelation',NULL,293,83,140,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(335,'0','IsPublic',NULL,293,84,390,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(336,'0','ExprEval',NULL,293,85,400,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(337,'0','ExprDefault',NULL,293,86,410,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(338,'0','ExprValidate',NULL,293,87,420,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(339,'0','LinkFilter',NULL,293,88,370,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(340,'0','CopyValue',NULL,293,89,430,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(341,'0','CopyLinked',NULL,293,90,440,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(342,'0','DeleteLinked',NULL,293,91,450,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(344,'0','InheritedFrom',NULL,293,93,115,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(345,'0','Modified',NULL,293,94,350,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(346,'0','Historical',NULL,293,95,200,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(347,'0','Versioned',NULL,293,96,210,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(348,'0','DBTable',NULL,293,97,470,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(349,'0','DBColumn',NULL,293,98,480,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(350,'0','Odr','Order',293,99,180,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(352,'0','Mandatory',NULL,293,101,380,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1486,'0','SysCode',NULL,587,1200,10,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(354,'0','ID',NULL,295,112,0,NULL,'1','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(355,'0','SysCode',NULL,295,113,20,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(356,'0','Description',NULL,295,114,30,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(357,'0','ParentItem',NULL,295,115,10,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(358,'0','ID',NULL,291,118,1,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(359,'0','UID',NULL,291,119,20,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(360,'0','SysCode',NULL,291,120,30,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(361,'0','Del',NULL,291,121,5,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(362,'0','Installation',NULL,291,122,50,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(363,'0','EntityKind',NULL,291,123,42,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(365,'0','PrgClassID',NULL,292,125,120,NULL,'0','1','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(366,'0','MainID',NULL,292,126,125,NULL,'0','1','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(367,'0','ForPrgClass',NULL,293,136,320,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(368,'0','PrgClass',NULL,291,137,80,NULL,'0','1','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(369,'0','PrgClass',NULL,292,138,22,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(370,'0','UIForms',NULL,292,139,140,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(371,'0','PrgAttributeID',NULL,293,140,300,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(373,'0','ID',NULL,294,154,1,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(374,'0','Description',NULL,294,155,2,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(375,'0','SysCode',NULL,294,156,3,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(376,'0','DEL',NULL,294,157,999,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1565,'0','UID',NULL,1547,1526,2,NULL,'0','1','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1563,'0','ID',NULL,1547,1520,0,NULL,'0','1','0','0',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1564,'0','Del',NULL,1547,1524,1,NULL,'0','1','0','0',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(380,'0','Notes',NULL,294,161,999,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(392,'0','ID',NULL,296,182,0,NULL,'1','1','0','0',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(393,'0','UID',NULL,296,183,0,NULL,'0','1','0','0',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(394,'0','SysCode',NULL,296,184,5,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(396,'0','InstallationID',NULL,296,186,0,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(397,'0','AnyTypeID',NULL,296,187,0,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(398,'0','PrgClassID',NULL,296,188,0,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(6100,'0','PrgAttrID',NULL,293,400,1,NULL,'1','0','0','0',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(435,'0','ForConcept',NULL,293,401,10,NULL,'1','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(439,'0','PrgViewID',NULL,296,404,0,NULL,'1','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(440,'0','ForConcept',NULL,296,406,3,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(441,'0','Notes',NULL,296,436,40,NULL,'0','0','0','0',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(452,'0','ID',NULL,451,415,0,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(461,'0','ForPrgView',NULL,451,417,1,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(462,'0','ForRelation',NULL,451,421,2,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(463,'0','Odr','Order',451,423,3,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(464,'0','UIPath',NULL,451,425,4,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(457,'0','Mandatory',NULL,451,427,5,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1485,'0','ID',NULL,587,1201,0,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(459,'0','Hidden',NULL,451,431,7,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(460,'0','InList',NULL,451,433,8,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(555,'0','ID',NULL,552,145,1,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1655,'0','SysCode',NULL,1649,1645,NULL,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(591,'0','Win',NULL,552,172,15,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(597,'0','Context',NULL,552,174,20,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1653,'0','ID',NULL,1649,1634,0,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(646,'0','Position',NULL,552,178,40,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1654,'0','Del',NULL,1649,1643,1,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(589,'0','ForUser',NULL,552,176,10,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(644,'0','Del',NULL,552,166,999,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1712,'0','Notes',NULL,1649,1681,16,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1711,'0','Description',NULL,1649,1679,10,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(645,'0','ForType',NULL,552,171,5,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(826,'0','ID',NULL,551,802,0,NULL,'0','0','0','1','','1','1',NULL,NULL,NULL,NULL,NULL,NULL),(829,'0','Del',NULL,551,806,999,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(831,'0','Win',NULL,551,812,999,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(830,'0','ForType',NULL,551,810,999,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(833,'0','ForUser',NULL,551,816,999,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(832,'0','Context',NULL,551,814,999,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(834,'0','Settings',NULL,551,818,999,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1002,'0','ID',NULL,998,978,0,NULL,'1','0','0','0',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1003,'0','SysCode',NULL,998,980,10,NULL,'1','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1004,'0','Description',NULL,998,996,20,NULL,'1','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1147,'0','SysCode',NULL,451,455,2,NULL,'0','0','1','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1567,'0','Derscription',NULL,1547,1679,20,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1568,'0','Owner',NULL,1547,1532,30,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1569,'0','DateMark',NULL,1547,1534,40,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1570,'0','Actual',NULL,1547,1536,50,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1571,'0','ExprFilter',NULL,1547,1538,60,NULL,'0','0','0','0',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1715,'0','RelationRole',NULL,1649,1665,40,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1714,'0','InheritedFrom',NULL,1649,1663,30,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1718,'0','Domain',NULL,1649,1671,55,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1713,'0','ForConcept',NULL,1649,1658,30,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1717,'0','RelationKind',NULL,1649,1669,55,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1716,'0','RelatedConcept',NULL,1649,1667,50,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1719,'0','BackLinkRelation',NULL,1649,1673,60,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1720,'0','CrossConcept',NULL,1649,1675,70,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1722,'0','Odr','Order',1649,1683,80,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1721,'0','CrossRelation',NULL,1649,1677,73,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1723,'0','Const',NULL,1649,1685,83,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1724,'0','Countable',NULL,1649,1687,86,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1725,'0','Historical',NULL,1649,1689,90,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1726,'0','Versioned',NULL,1649,1691,93,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1727,'0','VersPart',NULL,1649,1693,93,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1728,'0','MainPartID',NULL,1649,1695,98,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1729,'0','Root',NULL,1649,1697,110,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1747,'0','Del',NULL,587,1738,1,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1749,'0','BaseConcept',NULL,587,1602,20,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(12268,'0','Concept',NULL,998,5937,10,NULL,NULL,NULL,'0',NULL,NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1750,'0','Description',NULL,587,1604,30,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1752,'0','Primitive',NULL,587,1608,50,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1751,'0','Notes',NULL,587,1606,33,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1754,'0','Author',NULL,587,1612,70,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1753,'0','Abstract',NULL,587,1610,55,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(6101,'0','ForRelation',NULL,293,408,310,'IS related','1','0','0','0',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1807,'0','Del',NULL,451,1784,2,NULL,'0','1','0','0',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1857,'0','ID',NULL,1851,1772,0,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1858,'0','Del',NULL,1851,1774,1,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1859,'0','UID',NULL,1851,1801,3,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1860,'0','ForConcept',NULL,1851,1811,10,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1861,'0','PrgVersion',NULL,1851,1814,10,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1862,'0','Description',NULL,1851,1816,10,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1864,'0','ExprToString',NULL,1851,1820,40,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1863,'0','Notes',NULL,1851,1818,33,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1865,'0','DataBaseStore',NULL,1851,1823,45,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1866,'0','ExprFrom',NULL,1851,1836,50,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1868,'0','ExprOrder',NULL,1851,1844,54,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1867,'0','ExprWhere',NULL,1851,1838,52,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1869,'0','ExprGroup',NULL,1851,1840,56,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1870,'0','ExprHaving',NULL,1851,1842,58,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1871,'0','PrgPackage',NULL,1851,1847,70,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1877,'0','PrgType',NULL,1851,1849,72,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2083,'0','Del','Del',2082,2066,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2084,'0','ID','ID',2082,2065,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2085,'0','UID','UID',2082,2069,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2086,'0','SysCode','SysCode',2082,2071,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2087,'0','Description','Description',2082,2073,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2088,'0','DriverType','DriverType',2082,2075,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2089,'0','ConnectionParams','ConnectionParams',2082,2077,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2093,'0','Del','Del',2092,2066,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2094,'0','ID','ID',2092,2065,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2095,'0','UID','UID',2092,2069,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2096,'0','SysCode','SysCode',2092,2071,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2097,'0','Description','Description',2092,2073,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2098,'0','DriverType','DriverType',2092,2075,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2099,'0','ConnectionParams','ConnectionParams',2092,2077,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2101,'0','Del','Del',2100,2066,1,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2102,'0','ID','ID',2100,2065,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2103,'0','UID','UID',2100,2069,5,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2104,'0','SysCode','SysCode',2100,2071,10,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2105,'0','Description','Description',2100,2073,20,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2106,'0','DriverType','DriverType',2100,2075,30,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2107,'0','ConnectionParams','ConnectionParams',2100,2077,40,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2146,'0','Notes','Note',2140,436,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2144,'0','Del','Del',2140,185,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2143,'0','SysCode','Code',2140,184,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2142,'0','UID','UID',2140,183,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(9623,'0','Description',NULL,296,6005,20,NULL,NULL,NULL,'0',NULL,NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2134,'0','UID','UID',2132,2069,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2141,'0','ID','ID',2140,182,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2233,'0','Const','Constant',293,475,185,NULL,'0','0','0','1','null, ','1','1','Attribute once initialized cannot be changed in the future','null, ','ID','SysCode',500,NULL),(2234,'0','Countable','Countable',293,92,190,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(12376,'0','Description',NULL,593,6001,20,NULL,NULL,NULL,'0',NULL,NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(12375,'0','Concept',NULL,593,5925,10,NULL,NULL,NULL,'0',NULL,NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(12373,'0','ID',NULL,593,5815,0,NULL,NULL,NULL,'0',NULL,NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(12436,'0','AbnormalInherit',NULL,1851,12432,7,NULL,NULL,NULL,'0',NULL,NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2304,'0','RelationRole',NULL,293,2213,20,NULL,'1','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2591,'0','ForType',NULL,2572,2551,10,NULL,NULL,NULL,'0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2592,NULL,'ActionType',NULL,2572,2560,20,NULL,NULL,NULL,'0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2593,'0','ForUser',NULL,2572,2562,30,NULL,NULL,NULL,'0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2577,'0','Creteria','Creteria',2572,2564,50,NULL,'0','0','0','1','null, ','1','1','Additional creteria','null, ','ID','SysCode',NULL,NULL),(2573,'0','ID','ID',2572,2547,0,NULL,'0','0','0','1','null, ','1','1','ID of Right','null, ','ID','SysCode',NULL,NULL),(2364,NULL,'Args',NULL,295,2354,80,NULL,NULL,NULL,'0',NULL,NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2363,'0','CalledMethod',NULL,295,2352,70,NULL,'1','1','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2362,NULL,'CalledConcept',NULL,295,2350,60,NULL,NULL,NULL,'0',NULL,NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2361,'0','ForMenu',NULL,295,2347,5,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(6102,'0','Odr',NULL,295,2342,15,NULL,'1','1','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2331,'0','RelationStructRole',NULL,293,479,460,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2324,'0','Root','Root item',293,487,230,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2329,'0','Size',NULL,293,473,360,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2322,'0','MainPartID',NULL,293,485,220,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2320,'0','VersPart',NULL,293,481,215,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2307,'0','Notes',NULL,293,2206,45,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2311,'0','Domain',NULL,293,477,120,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2306,'0','Description',NULL,293,2204,40,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(3182,'0','ID','null',3181,3089,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',NULL,NULL),(3183,'0','Del','null',3181,3096,1,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',NULL,NULL),(3184,'0','UID','null',3181,3098,2,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',NULL,NULL),(3185,'0','SysCode','null',3181,3100,2,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',NULL,NULL),(3186,'0','Description','null',3181,3102,20,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',NULL,NULL),(4579,'0','HierCode',NULL,292,4520,77,NULL,'0','0','0','0',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7944,'0','Description',NULL,291,5997,60,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7942,'0','Concept',NULL,291,5919,40,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(6991,'0','ID','ID',6990,5825,0,NULL,'0','0','0','0',NULL,'1','1','Identifier','null, ','ID','SysCode',NULL,NULL),(6992,'0','Del','Del',6990,5877,5,NULL,'0','0','0','0',NULL,'1','1','nullk.Del','null, ','ID','SysCode',NULL,NULL),(6993,'0','SysCode','System Code',6990,6052,7,NULL,'0','0','0','1',NULL,'1','1','System code of position','null, ','ID','SysCode',NULL,NULL),(6994,'0','Source','Source Installation',6990,6057,8,NULL,'0','0','0','1','combobox','1','1','null','PrgComponent','ID','SysCode',500,NULL),(6995,'0','Concept','Concept',6990,5957,10,NULL,'0','0','0','1','combobox','1','1','null','ConceptPrgClass','ID','SysCode',500,NULL),(6996,'0','Code','Code',6990,6037,18,NULL,'0','0','0','1',NULL,'1','1','Short code of position','null, ','ID','SysCode',NULL,NULL),(6997,'0','Description','Name',6990,6023,20,NULL,'0','0','0','1',NULL,'1','1','null','null, ','ID','SysCode',NULL,NULL),(6998,'0','Parent','Parent',6990,5756,24,NULL,'0','0','0','1','combobox','1','1','null','EntityKind','ID','SysCode',500,NULL),(6999,'0','HierCode','Hierarchy Code',6990,5771,25,NULL,'0','0','0','1',NULL,'1','1','null','null, ','ID','SysCode',NULL,NULL),(7000,'0','Actual','Actual',6990,6055,30,NULL,'0','0','0','1',NULL,'1','1','Actual','null, ','ID','SysCode',NULL,NULL),(7578,'0','Items',NULL,3181,7568,100,NULL,NULL,NULL,'0',NULL,NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7691,'0','AbnormalInherit',NULL,587,7432,60,NULL,'0','0','0','0',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7910,'0','ID',NULL,7900,7779,0,NULL,'1','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7911,'0','Del',NULL,7900,7781,5,NULL,NULL,NULL,'0',NULL,NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7913,'0','ForRelation',NULL,7900,7804,20,NULL,'1','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7912,'0','Concept',NULL,7900,7783,10,NULL,NULL,NULL,'0',NULL,NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7914,'0','DisplayName',NULL,7900,7806,30,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7915,'0','Const',NULL,7900,7796,185,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7916,'0','Historical',NULL,7900,7798,200,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7917,'0','VersPart',NULL,7900,7800,215,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7918,'0','Root',NULL,7900,7802,230,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7919,'0','Size',NULL,7900,7809,360,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7922,'0','ExprValidate',NULL,7900,7815,420,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7920,'0','Mandatory',NULL,7900,7811,380,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7921,'0','ExprEval',NULL,7900,7813,400,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7924,'0','RelationStructRole',NULL,7900,7819,460,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7925,'0','DBColumn',NULL,7900,7821,480,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7923,'0','CopyLinked',NULL,7900,7817,440,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7928,'0','PrgAttributeNotes',NULL,7900,7807,34,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7929,'0','Countable',NULL,7900,7797,190,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7931,'0','Versioned',NULL,7900,7799,210,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7933,'0','Modified',NULL,7900,7808,350,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7932,'0','MainPartID',NULL,7900,7801,220,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7934,'0','LinkFilter',NULL,7900,7810,370,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7935,'0','IsPublic',NULL,7900,7812,390,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7949,'0','ExprDefault',NULL,7900,7814,410,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7950,'0','CopyValue',NULL,7900,7816,430,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7951,'0','DeleteLinked',NULL,7900,7818,450,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(7952,'0','DBTable',NULL,7900,7820,470,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(8088,'0','ForPrgClass',NULL,7900,8061,22,NULL,'1','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `prgviewfield` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relation`
--

DROP TABLE IF EXISTS `relation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `relation` (
  `ID` bigint(20) NOT NULL,
  `Del` char(1) DEFAULT '0',
  `ForConcept` bigint(20) NOT NULL,
  `InheritedFrom` bigint(20) DEFAULT NULL,
  `RelationRole` bigint(20) DEFAULT NULL,
  `RelatedConcept` bigint(20) DEFAULT NULL,
  `RelationKind` bigint(20) DEFAULT NULL,
  `Domain` varchar(2000) DEFAULT NULL,
  `BackLinkRelation` bigint(20) DEFAULT NULL,
  `CrossConcept` bigint(20) DEFAULT NULL,
  `CrossRelation` bigint(20) DEFAULT NULL,
  `SysCode` varchar(200) DEFAULT NULL,
  `Description` varchar(400) DEFAULT NULL,
  `Notes` varchar(2000) DEFAULT NULL,
  `Odr` smallint(6) DEFAULT '999',
  `Const` char(1) DEFAULT '0',
  `Countable` char(1) DEFAULT '0',
  `Historical` char(1) DEFAULT '0',
  `Versioned` char(1) DEFAULT '0',
  `VersPart` varchar(120) DEFAULT NULL,
  `MainPartID` varchar(120) DEFAULT NULL,
  `Root` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relation`
--

LOCK TABLES `relation` WRITE;
/*!40000 ALTER TABLE `relation` DISABLE KEYS */;
INSERT INTO `relation` VALUES (42,'0',14,1194,0,20,150,NULL,0,0,0,'ID','null','Identifier',0,'0','0','0','0','null','null',0),(44,'0',14,116,NULL,30,150,NULL,NULL,NULL,NULL,'SysCode','c.SysCode',NULL,30,'0','0','0','0',NULL,NULL,NULL),(45,'0',14,1194,0,53,150,NULL,0,0,0,'Del','cv.Del','null',5,'0','0','0','0','null','null',0),(48,'0',14,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'BaseConcept','c.BaseConcept',NULL,75,'0','0','0','0',NULL,NULL,NULL),(50,'0',14,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Primitive','c.Primitive',NULL,90,'0','0','0','0',NULL,NULL,NULL),(51,'0',14,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Abstract','c.Abstract',NULL,100,'0','0','0','0',NULL,NULL,NULL),(55,'0',14,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'ConceptVersion','cv.ConceptVersion',NULL,125,'0','0','0','0',NULL,NULL,NULL),(58,'0',14,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'VersDescription','cv.VersDescription',NULL,150,'0','0','0','0',NULL,NULL,NULL),(59,'0',14,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'VersNotes','cv.VersNotes',NULL,160,'0','0','0','0',NULL,NULL,NULL),(60,'0',14,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'PrgPackage','cv.PrgPackage',NULL,170,'0','0','0','0',NULL,NULL,NULL),(61,'0',14,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'PrgType','cv.PrgType',NULL,180,'0','0','0','0',NULL,NULL,NULL),(64,'0',14,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprToString','cv.ExprToString',NULL,190,'0','0','0','0',NULL,NULL,NULL),(65,'0',14,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprFrom','cv.ExprFrom',NULL,200,'0','0','0','0',NULL,NULL,NULL),(66,'0',14,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprWhere','cv.ExprWhere',NULL,210,'0','0','0','0',NULL,NULL,NULL),(67,'0',14,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprGroup','cv.ExprGroup',NULL,230,'0','0','0','0',NULL,NULL,NULL),(68,'0',14,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprHaving','cv.ExprHaving',NULL,240,'0','0','0','0',NULL,NULL,NULL),(69,'0',14,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'ExprOrder','cv.ExprOrder',NULL,220,'0','0','0','0',NULL,NULL,NULL),(70,'0',62,1194,0,20,150,NULL,0,0,0,'ID','null','Identifier',0,'0','0','0','0','null','null',0),(72,'0',62,116,NULL,30,150,NULL,NULL,NULL,NULL,'SysCode','r.SysCode',NULL,30,'0','0','0','0',NULL,NULL,NULL),(73,'0',62,1194,0,53,150,NULL,0,0,0,'Del','cv.Del','null',5,'0','0','0','0','null','null',0),(81,'0',62,NULL,NULL,62,151,NULL,NULL,NULL,NULL,'BackLinkRelation','rv.BackLinkRelation',NULL,125,'0','0','0','0',NULL,NULL,NULL),(77,'0',62,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'DisplayName','rv.DisplayName',NULL,330,'0','0','0','0',NULL,NULL,NULL),(78,'0',62,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'PrgAttributeNotes','rv.VersNotes',NULL,340,'0','0','0','0',NULL,NULL,NULL),(79,'0',62,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'RelationKind','rv.RelationKind',NULL,110,'0','0','0','0',NULL,NULL,NULL),(80,'0',62,NULL,NULL,14,151,NULL,NULL,NULL,NULL,'RelatedConcept','rv.RelatedConcept',NULL,100,'0','0','0','0',NULL,NULL,NULL),(82,'0',62,NULL,NULL,14,151,NULL,NULL,NULL,NULL,'CrossConcept','rv.CrossConcept',NULL,130,'0','0','0','0',NULL,NULL,NULL),(83,'0',62,NULL,NULL,62,151,NULL,NULL,NULL,NULL,'CrossRelation','rv.CrossRelation',NULL,140,'0','0','0','0',NULL,NULL,NULL),(84,'0',62,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'IsPublic','rv.IsPublic',NULL,390,'0','0','0','0',NULL,NULL,NULL),(85,'0',62,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprEval','rv.ExprEval',NULL,400,'0','0','0','0',NULL,NULL,NULL),(86,'0',62,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprDefault','rv.ExprDefault',NULL,410,'0','0','0','0',NULL,NULL,NULL),(87,'0',62,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprValidate','rv.ExprValidate',NULL,420,'0','0','0','0',NULL,NULL,NULL),(88,'0',62,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'LinkFilter','rv.LinkFilter',NULL,370,'0','0','0','0',NULL,NULL,NULL),(89,'0',62,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'CopyValue','rv.CopyValue',NULL,430,'0','0','0','0',NULL,NULL,NULL),(90,'0',62,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'CopyLinked','rv.CopyLinked',NULL,440,'0','0','0','0',NULL,NULL,NULL),(91,'0',62,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'DeleteLinked','rv.DeleteLinked',NULL,450,'0','0','0','0',NULL,NULL,NULL),(92,'0',62,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Countable','rv.Countable',NULL,190,'0','0','0','0',NULL,NULL,NULL),(93,'0',62,NULL,NULL,14,151,NULL,NULL,NULL,NULL,'InheritedFrom','rv.InheritedFrom',NULL,115,'0','0','0','0',NULL,NULL,NULL),(94,'0',62,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Modified','Is changed from analogue in parent','Is changed compared to analogue attribute from parent concept',350,'0','0','0','0',NULL,NULL,NULL),(95,'0',62,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Historical','rv.Historical',NULL,200,'0','0','0','0',NULL,NULL,NULL),(96,'0',62,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Versioned','rv.Versioned',NULL,210,'0','0','0','0',NULL,NULL,NULL),(97,'0',62,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'DBTable','rv.DBTable',NULL,470,'0','0','0','0',NULL,NULL,NULL),(98,'0',62,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'DBColumn','rv.DBColumn',NULL,480,'0','0','0','0',NULL,NULL,NULL),(99,'0',62,NULL,NULL,18,150,NULL,NULL,NULL,NULL,'Odr','rv.Seqn',NULL,180,'0','0','0','0',NULL,NULL,NULL),(473,'0',62,NULL,NULL,18,150,NULL,NULL,NULL,NULL,'Size','rv.Size',NULL,360,'0','0','0','0',NULL,NULL,NULL),(101,'0',62,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Mandatory','rv.Mandatory',NULL,380,'0','0','0','0',NULL,NULL,NULL),(470,'0',14,NULL,NULL,62,152,NULL,401,NULL,NULL,'Attributes',NULL,NULL,500,'0','0','0','0',NULL,NULL,NULL),(112,'0',109,1194,0,20,150,NULL,0,0,0,'ID','null','Identifier',0,'0','0','0','0','null','null',0),(113,'0',109,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'SysCode','SysCode',NULL,20,'0','0','0','0',NULL,NULL,NULL),(114,'0',109,1194,0,28,150,NULL,0,0,0,'Description','null','null',20,'0','0','1','1','null','null',0),(115,'0',109,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'ParentItem','ParentID',NULL,10,'0','0','0','0',NULL,NULL,NULL),(118,'0',116,1194,0,20,150,NULL,0,0,0,'ID','null','Identifier',0,'0','0','0','0','null','null',0),(120,'0',116,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'SysCode','SysCode',NULL,30,'0','0','0','0',NULL,NULL,NULL),(121,'0',116,1194,0,53,150,NULL,0,0,0,'Del','cv.Del','null',5,'0','0','0','0','null','null',0),(122,'0',116,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'Installation','InstallationID',NULL,50,'0','0','0','0',NULL,NULL,NULL),(123,'0',116,NULL,NULL,2802,151,NULL,NULL,NULL,NULL,'EntityKind','Kind of this Component',NULL,60,'0','0','0','0',NULL,NULL,NULL),(125,'0',14,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'PrgClassID','cv.ID',NULL,120,'0','0','0','0',NULL,NULL,NULL),(126,'0',14,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'MainID','cv.MainID',NULL,125,'0','0','0','0',NULL,NULL,NULL),(136,'0',62,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'ForPrgClass','rv.ForConceptVers',NULL,320,'0','0','0','0',NULL,NULL,NULL),(138,'0',14,116,NULL,20,151,NULL,NULL,NULL,NULL,'DataBaseStore','cv.DataBaseStore',NULL,22,'0','0','0','0',NULL,NULL,NULL),(140,'0',62,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'PrgAttributeID','rv.ID',NULL,300,'0','0','0','0',NULL,NULL,NULL),(145,'0',143,1194,0,20,150,NULL,0,0,0,'ID','null','Identifier',0,'0','0','0','0','null','null',0),(154,'0',148,1194,0,20,150,NULL,0,0,0,'ID','null','Identifier',0,'0','0','0','0','null','null',0),(155,'0',148,1194,0,28,150,NULL,0,0,0,'Description','null','null',20,'0','0','1','1','null','null',0),(156,'0',148,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'SysCode','ak.SysCode',NULL,10,'0','0','0','0',NULL,NULL,NULL),(157,'0',148,1194,0,53,150,NULL,0,0,0,'Del','cv.Del','null',5,'0','0','0','0','null','null',0),(1524,'0',1504,1194,0,53,150,NULL,0,0,0,'Del','cv.Del',NULL,2,'0','0','0','0',NULL,NULL,0),(1520,'0',1504,1194,0,20,150,NULL,0,0,0,'ID','null','Identifier',0,'0','0','0','0','null','null',0),(161,'0',148,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'Notes','ak.Note',NULL,30,'0','0','0','0',NULL,NULL,NULL),(1608,'0',130,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Primitive',NULL,NULL,50,'0','0','0','0',NULL,NULL,NULL),(1610,'0',130,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Abstract',NULL,NULL,55,'0','0','0','0',NULL,NULL,NULL),(1606,'0',130,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'Notes',NULL,NULL,33,'0','0','0','0',NULL,NULL,NULL),(1604,'0',130,1194,0,28,150,NULL,0,0,0,'Description','null','null',20,'0','0','1','1','null','null',0),(1602,'0',130,NULL,NULL,130,151,NULL,NULL,NULL,NULL,'BaseConcept',NULL,NULL,20,'0','0','0','0',NULL,NULL,NULL),(171,'0',143,NULL,NULL,30,151,NULL,NULL,NULL,NULL,'ForType','ws.ForType',NULL,5,'0','0','0','0',NULL,NULL,NULL),(172,'0',143,NULL,NULL,30,151,NULL,NULL,NULL,NULL,'Win','ws.Win','Window for which stored settings',15,'0','0','0','0',NULL,NULL,NULL),(174,'0',143,NULL,NULL,28,151,NULL,NULL,NULL,NULL,'Context','ws.Context','Additional Context for this parameters ',20,'0','0','0','0',NULL,NULL,NULL),(176,'0',143,NULL,NULL,30,151,NULL,NULL,NULL,NULL,'ForUser','ws.ForUser',NULL,10,'0','0','0','0',NULL,NULL,NULL),(178,'0',143,NULL,NULL,30,151,NULL,NULL,NULL,NULL,'Position','ws.Position',NULL,30,'0','0','0','0',NULL,NULL,NULL),(182,'0',180,116,NULL,20,150,NULL,NULL,NULL,NULL,'ID','cv.ID',NULL,0,'0','0','0','0',NULL,NULL,NULL),(184,'0',180,116,NULL,30,150,NULL,NULL,NULL,NULL,'SysCode','cv.SysCode',NULL,5,'0','0','0','0',NULL,NULL,NULL),(185,'0',180,1194,0,53,150,NULL,0,0,0,'Del','cv.Del',NULL,2,'0','0','0','0',NULL,NULL,0),(401,'0',62,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'ForConcept','r.ForConcept',NULL,10,'0','0','0','0',NULL,NULL,NULL),(406,'0',180,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'ForConcept','cv.ForConcept',NULL,13,'0','0','0','0',NULL,NULL,NULL),(408,'0',62,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'ForRelation',NULL,NULL,310,NULL,'0','0','0',NULL,NULL,NULL),(415,'0',411,1194,0,20,150,NULL,0,0,0,'ID','null','Identifier',0,'0','0','0','0','null','null',0),(417,'0',411,NULL,NULL,180,151,NULL,NULL,NULL,NULL,'ForPrgView','cvf.ForConceptView',NULL,10,'0','0','0','0',NULL,NULL,NULL),(421,'0',411,NULL,NULL,1624,151,NULL,NULL,NULL,NULL,'ForRelation','cvf.ForRelation',NULL,11,'0','0','0','0',NULL,NULL,NULL),(423,'0',411,NULL,NULL,18,150,NULL,NULL,NULL,NULL,'Odr','cvf.Seqn','Sequence in Class',4,'0','0','0','0',NULL,NULL,NULL),(425,'0',411,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'UIPath','cvf.UIPath',NULL,12,'0','0','0','0',NULL,NULL,NULL),(427,'0',411,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Mandatory','cvf.Mandatory',NULL,13,'0','0','0','0',NULL,NULL,NULL),(431,'0',411,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Hidden','cvf.Hidden',NULL,14,'0','0','0','0',NULL,NULL,NULL),(433,'0',411,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'InList','cvf.InList',NULL,16,'0','0','0','0',NULL,NULL,NULL),(436,'0',180,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'Notes','cv.Notes',NULL,40,'0','0','0','0',NULL,NULL,NULL),(455,'0',411,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'SysCode','cvf.SysCode',NULL,5,'0','0','0','0',NULL,NULL,NULL),(475,'0',62,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Const','rv.Const','Attribute once initialized cannot be changed in the future',185,'0','0','0','0',NULL,NULL,NULL),(477,'0',62,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'Domain','rv.Domain','Map of possible Values',120,'0','0','0','0',NULL,NULL,NULL),(479,'0',62,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'RelationStructRole','rv.RelationStructRole',NULL,460,'0','0','0','0',NULL,NULL,NULL),(481,'0',62,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'VersPart',NULL,NULL,215,NULL,'0','0','0',NULL,NULL,NULL),(485,'0',62,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'MainPartID','rv.MainPartID','What attribute MainID points to',220,'0','0','0','0',NULL,NULL,NULL),(487,'0',62,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'Root','rv.Root','Root for Hierarchy',230,'0','0','0','0',NULL,NULL,NULL),(489,'0',411,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'ControlType','cvf.ControlType',NULL,18,'0','0','0','0',NULL,NULL,NULL),(491,'0',411,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'ShowTitle','cvf.ShowTitle',NULL,22,'0','0','0','0',NULL,NULL,NULL),(493,'0',411,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Editable','cvf.Editable',NULL,50,'0','0','0','0',NULL,NULL,NULL),(495,'0',411,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'DataSourceView','cvf.DataSourceView',NULL,60,'0','0','0','0',NULL,NULL,NULL),(497,'0',411,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'ValueField','cvf.ValueField',NULL,70,'0','0','0','0',NULL,NULL,NULL),(499,'0',411,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'DisplayField','cvf.DisplayField',NULL,72,'0','0','0','0',NULL,NULL,NULL),(501,'0',411,NULL,NULL,18,150,NULL,NULL,NULL,NULL,'PickListWidth','cvf.PickListWidth',NULL,80,'0','0','0','0',NULL,NULL,NULL),(503,'0',411,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'ViewOnly','cvf.ViewOnly',NULL,90,'0','0','0','0',NULL,NULL,NULL),(802,'0',453,1194,0,20,150,NULL,0,0,0,'ID','null','Identifier',0,'0','0','0','0','null','null',0),(1612,'0',130,NULL,NULL,130,151,NULL,NULL,NULL,NULL,'Author',NULL,NULL,70,'0','0','0','0',NULL,NULL,NULL),(1634,'0',1624,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'ID',NULL,NULL,0,'0',NULL,NULL,'0',NULL,NULL,NULL),(810,'0',453,NULL,NULL,30,151,NULL,NULL,NULL,NULL,'ForType','ls.ForType',NULL,999,'0','0','0','0',NULL,NULL,NULL),(812,'0',453,NULL,NULL,30,151,NULL,NULL,NULL,NULL,'Win','ls.Win','Window for which stored settings',999,'0','0','0','0',NULL,NULL,NULL),(814,'0',453,NULL,NULL,28,151,NULL,NULL,NULL,NULL,'Context','ls.Context','Additional Context for this parameters ',999,'0','0','0','0',NULL,NULL,NULL),(816,'0',453,NULL,NULL,30,151,NULL,NULL,NULL,NULL,'ForUser','ls.ForUser',NULL,999,'0','0','0','0',NULL,NULL,NULL),(818,'0',453,NULL,NULL,30,151,NULL,NULL,NULL,NULL,'Settings','ls.Settings',NULL,999,'0','0','0','0',NULL,NULL,NULL),(978,'0',971,1194,0,20,150,NULL,0,0,0,'ID','null','Identifier',0,'0','0','0','0','null','null',0),(980,'0',971,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'SysCode','r.SysCode',NULL,10,'0','0','0','0',NULL,NULL,NULL),(996,'0',971,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'Description','Description',NULL,20,'0','0','0','0',NULL,NULL,NULL),(1201,'0',130,1194,0,20,150,NULL,0,0,0,'ID','null','Identifier',0,'0','0','0','0','null','null',0),(1200,'0',130,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'SyCode','SysCode','Concept Code',10,'0','0','0','0',NULL,NULL,NULL),(1528,'0',1504,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'SysCode',NULL,NULL,5,'0','0','0','0',NULL,NULL,NULL),(1530,'0',1504,1194,0,28,150,NULL,0,0,0,'Description','null','null',20,'0','0','1','1','null','null',0),(1532,'0',1504,NULL,NULL,30,151,NULL,NULL,NULL,NULL,'Owner',NULL,NULL,999,'0','0','0','0',NULL,NULL,NULL),(1534,'0',1504,NULL,NULL,38,150,NULL,NULL,NULL,NULL,'DateMark',NULL,NULL,999,'0','0','0','0',NULL,NULL,NULL),(1536,'0',1504,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Actual',NULL,NULL,999,'0','0','0','0',NULL,NULL,NULL),(1538,'0',1504,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprFilter',NULL,NULL,999,'0','0','0','0',NULL,NULL,NULL),(1643,'0',1624,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Del',NULL,NULL,1,'0','1','1','0',NULL,NULL,NULL),(1645,'0',1624,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'SysCode',NULL,NULL,10,'0','1','1','0',NULL,NULL,NULL),(1658,'0',1624,NULL,NULL,130,151,NULL,NULL,NULL,NULL,'ForConcept',NULL,NULL,30,'0','1','1','1',NULL,NULL,NULL),(1663,'0',1624,NULL,NULL,130,151,NULL,NULL,NULL,NULL,'InheritedFrom',NULL,NULL,30,'0','1','1','1',NULL,NULL,NULL),(1665,'0',1624,NULL,NULL,130,151,NULL,NULL,NULL,NULL,'RelationRole','Semantic meaning of Relation',NULL,40,'0','1','1','1',NULL,NULL,NULL),(1667,'0',1624,NULL,NULL,130,151,NULL,NULL,NULL,NULL,'RelatedConcept',NULL,NULL,50,'0','1','1','1',NULL,NULL,NULL),(1669,'0',1624,NULL,NULL,148,151,NULL,NULL,NULL,NULL,'RelationKind',NULL,NULL,55,'0','1','1','1',NULL,NULL,NULL),(1671,'0',1624,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'Domain',NULL,NULL,55,'0','0','0','0',NULL,NULL,NULL),(1673,'0',1624,NULL,NULL,1624,151,NULL,NULL,NULL,NULL,'BackLinkRelation',NULL,NULL,60,'0','1','1','1',NULL,NULL,NULL),(1675,'0',1624,NULL,NULL,130,151,NULL,NULL,NULL,NULL,'CrossConcept',NULL,NULL,70,'0','1','1','1',NULL,NULL,NULL),(1677,'0',1624,NULL,NULL,1624,151,NULL,NULL,NULL,NULL,'CrossRelation',NULL,NULL,73,'0','1','1','1',NULL,NULL,NULL),(1679,'0',1624,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'Description',NULL,NULL,10,'0','1','1','0',NULL,NULL,NULL),(1681,'0',1624,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'Notes',NULL,NULL,16,'0','1','1','0',NULL,NULL,NULL),(1683,'0',1624,NULL,NULL,18,150,NULL,NULL,NULL,NULL,'Odr',NULL,NULL,80,'0','1','1','0',NULL,NULL,NULL),(7886,'0',1624,NULL,NULL,7777,2342,NULL,7804,NULL,NULL,'PrgAttributes','Programm implementations','Information-system related aspects of this concept - maybe represented in several variants (for different PrgClasses).',100,'0','0','0','0',NULL,NULL,NULL),(1738,'0',130,1194,0,53,150,NULL,0,0,0,'Del','cv.Del','null',5,'0','0','0','0','null','null',0),(1772,'0',1767,1194,0,20,150,NULL,0,0,0,'ID','null','Identifier',0,'0','0','0','0','null','null',0),(1774,'0',1767,1194,0,53,150,NULL,0,0,0,'Del','cv.Del','null',5,'0','0','0','0','null','null',0),(1784,'0',411,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Del',NULL,NULL,2,'0','0','0','0',NULL,NULL,NULL),(1811,'0',1767,NULL,NULL,130,151,NULL,NULL,NULL,NULL,'ForConcept',NULL,NULL,10,'0','0','0','0',NULL,NULL,NULL),(1814,'0',1767,NULL,NULL,1504,151,NULL,NULL,NULL,NULL,'PrgVersion','Version',NULL,10,'0','0','0','0',NULL,NULL,NULL),(1816,'0',1767,1194,0,28,150,NULL,0,0,0,'Description','null','null',20,'0','0','1','1','null','null',0),(1818,'0',1767,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'Notes',NULL,NULL,33,'0','0','0','0',NULL,NULL,NULL),(1820,'0',1767,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'ExprToString',NULL,NULL,40,'0','0','0','0',NULL,NULL,NULL),(1823,'0',1767,NULL,NULL,1828,151,NULL,NULL,NULL,NULL,'DataBaseStore',NULL,NULL,45,'0','0','0','0',NULL,NULL,NULL),(1836,'0',1767,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprFrom',NULL,NULL,50,'0','0','0','0',NULL,NULL,NULL),(1838,'0',1767,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprWhere',NULL,NULL,52,'0','0','0','0',NULL,NULL,NULL),(1840,'0',1767,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprGroup',NULL,NULL,56,'0','0','0','0',NULL,NULL,NULL),(1842,'0',1767,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprHaving',NULL,NULL,58,'0','0','0','0',NULL,NULL,NULL),(1844,'0',1767,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprOrder',NULL,NULL,54,'0','0','0','0',NULL,NULL,NULL),(1847,'0',1767,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'PrgPackage',NULL,NULL,70,'0','0','0','0',NULL,NULL,NULL),(1849,'0',1767,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'PrgType',NULL,NULL,72,'0','0','0','0',NULL,NULL,NULL),(2065,'0',1828,1194,0,20,150,NULL,0,0,0,'ID','null','Identifier',0,'0','0','0','0','null','null',0),(2066,'0',1828,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'Del',NULL,NULL,1,'0','1','1','1',NULL,NULL,NULL),(2071,'0',1828,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'SysCode',NULL,NULL,10,'0','1','1','1',NULL,NULL,NULL),(2073,'0',1828,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'Description',NULL,NULL,20,'0','1','1','1',NULL,NULL,NULL),(2075,'0',1828,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'DriverType',NULL,NULL,30,'0','1','1','1',NULL,NULL,NULL),(2077,'0',1828,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'ConnectionParams',NULL,NULL,40,'0','1','1','1',NULL,NULL,NULL),(2342,'0',109,NULL,NULL,18,150,NULL,NULL,NULL,NULL,'Odr','Order','Order of menu items',15,'1','0','0','0',NULL,NULL,NULL),(2204,'0',62,1194,0,28,150,NULL,0,0,0,'Description','null','null',20,'0','0','1','1','null','null',0),(2206,'0',62,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'Notes',NULL,NULL,45,'0','0','0','0',NULL,NULL,NULL),(2213,'0',62,NULL,NULL,130,151,NULL,NULL,NULL,NULL,'RelationRole','Semantic meaning of Relation',NULL,20,'0','0','0','0',NULL,NULL,NULL),(2347,'0',109,NULL,NULL,108,151,NULL,NULL,NULL,NULL,'ForMenu','ForMenu',NULL,5,'0','0','0','0',NULL,NULL,NULL),(2350,'0',109,NULL,NULL,130,151,NULL,NULL,NULL,NULL,'CalledConcept','Called concept',NULL,60,'0','0','0','0',NULL,NULL,NULL),(2352,'0',109,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'CalledMethod','Called Method',NULL,70,'0','0','0','0',NULL,NULL,NULL),(2354,'0',109,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'Args','Args',NULL,80,'0','0','0','0',NULL,NULL,NULL),(2547,'0',2541,1194,NULL,20,150,NULL,NULL,NULL,NULL,'ID','ID of Right',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2551,'0',2541,NULL,NULL,1194,151,NULL,NULL,NULL,NULL,'ForType','On what Right ',NULL,10,'0','0','0','0',NULL,NULL,NULL),(2560,'0',2541,NULL,NULL,132,151,NULL,NULL,NULL,NULL,'ActionType','What ToDo Right',NULL,20,'0','0','0','0',NULL,NULL,NULL),(2562,'0',2541,NULL,NULL,1228,151,NULL,NULL,NULL,NULL,'ForUser','For Whom','For Whom is this Right granted',30,'0','0','0','0',NULL,NULL,NULL),(2564,'0',2541,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'Creteria','Additional Creteria',NULL,50,'0','0','0','0',NULL,NULL,NULL),(2782,'0',1194,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'ID',NULL,NULL,0,'0','0','0','0',NULL,NULL,NULL),(2788,'0',1194,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'Description',NULL,NULL,20,'0','0','1','1',NULL,NULL,NULL),(2913,'0',2901,NULL,NULL,30,151,NULL,NULL,NULL,NULL,'Owner',NULL,NULL,999,'0','0','0','0',NULL,NULL,NULL),(2903,'0',2901,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'ID',NULL,NULL,0,'0','1','1','1',NULL,NULL,NULL),(2905,'0',2901,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Del',NULL,NULL,999,'0','0','0','0',NULL,NULL,NULL),(2911,'0',2901,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'Description',NULL,NULL,999,'0','0','0','0',NULL,NULL,NULL),(2909,'0',2901,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'SysCode',NULL,NULL,999,'0','0','0','0',NULL,NULL,NULL),(2919,'0',2901,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprFilter',NULL,NULL,999,'0','0','0','0',NULL,NULL,NULL),(2907,'0',2901,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'UID',NULL,NULL,999,'0','0','0','0',NULL,NULL,NULL),(2917,'0',2901,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Actual',NULL,NULL,999,'0','0','0','0',NULL,NULL,NULL),(2915,'0',2901,NULL,NULL,38,150,NULL,NULL,NULL,NULL,'DateMark',NULL,NULL,999,'0','0','0','0',NULL,NULL,NULL),(3068,'0',1828,NULL,NULL,34,150,NULL,NULL,NULL,NULL,'Test','Test!!!!!!!!!!!!!!!!!!!!!!!!!!!!!','aeardc???????????????????',12,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3089,'0',108,1194,0,20,150,NULL,0,0,0,'ID','null','Identifier',0,'0','0','0','0','null','null',0),(3096,'0',108,1194,0,53,150,NULL,0,0,0,'Del','cv.Del',NULL,2,'0','0','0','0',NULL,NULL,0),(3100,'0',108,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'SysCode','Sys Code',NULL,5,'0','0','0','0',NULL,NULL,NULL),(3102,'0',108,1194,0,28,150,NULL,0,0,0,'Description','null','null',20,'0','0','1','1','null','null',0),(3224,'0',3220,1194,0,53,150,NULL,0,0,0,'Del','cv.Del',NULL,2,'0','0','0','0',NULL,NULL,0),(3222,'0',3220,1194,0,20,150,NULL,0,0,0,'ID','null','Identifier',0,'0','0','0','0','null','null',0),(3230,'0',3220,NULL,NULL,28,151,NULL,NULL,NULL,NULL,'SysCode','System code','Invariant code for system usage',5,'0','0','0','0',NULL,NULL,NULL),(3250,'0',3244,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'SysCode','SysCode',NULL,30,'0','0','0','0',NULL,NULL,NULL),(3256,'0',3244,NULL,NULL,2802,151,NULL,NULL,NULL,NULL,'EntityKind','AnyTypeID',NULL,60,'0','0','0','0',NULL,NULL,NULL),(3948,'0',3262,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'SysCode','SysCode',NULL,30,'0','0','0','0',NULL,NULL,NULL),(3954,'0',3262,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'EntityKind','AnyTypeID',NULL,60,'0','0','0','0',NULL,NULL,NULL),(3972,'0',3960,NULL,NULL,2802,151,NULL,NULL,NULL,NULL,'EntityKind','AnyTypeID',NULL,60,'0','0','0','0',NULL,NULL,NULL),(4245,'0',1194,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Del','cv.Del',NULL,5,'0','0','0','0',NULL,NULL,NULL),(4314,'0',4312,1194,0,20,150,NULL,0,0,0,'ID',NULL,'Identifier',0,'0','0','0','0',NULL,NULL,0),(4318,'0',4312,1194,0,53,150,NULL,0,0,0,'Del','cv.Del',NULL,5,'0','0','0','0',NULL,NULL,0),(4320,'0',4312,1194,0,28,150,NULL,0,0,0,'Description',NULL,NULL,20,'0','0','1','1',NULL,NULL,0),(4332,'0',4330,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'ID',NULL,NULL,0,'0','0','0','0',NULL,NULL,NULL),(4336,'0',4330,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Del','cv.Del',NULL,5,'0','0','0','0',NULL,NULL,NULL),(4338,'0',4330,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'Description',NULL,NULL,20,'0','0','1','1',NULL,NULL,NULL),(4408,'0',1194,NULL,NULL,14,151,NULL,NULL,NULL,NULL,'Concept','Is of the Kind','Even if we imagine something absolutely unique, not belongs to any analogues - it will form its own concept, and this will be pointer to that.\nIf something combines features of several concepts - ??? ...',10,'0','0','1','1',NULL,NULL,NULL),(4394,'0',4330,NULL,NULL,14,151,NULL,NULL,NULL,NULL,'Concept','Is of the Kind','Even if we imagine something absolutely unique, not belongs to any analogues - it will form its own concept, and this will be pointer to that.\nIf something combines features of several concepts - ??? ...',10,'0','0','1','1',NULL,NULL,NULL),(4520,'0',14,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'HierCode','Hierarchy full parth','Hierarchy full parth',77,'0','0','0','0',NULL,NULL,NULL),(5813,'0',132,1194,0,20,150,NULL,0,0,0,'ID','null','Identifier',0,'0','0','0','0','null','null',0),(5815,'0',134,1194,0,20,150,NULL,0,0,0,'ID','null','Identifier',0,'0','0','0','0','null','null',0),(5817,'0',1227,1194,0,20,150,NULL,0,0,0,'ID','null','Identifier',0,'0','0','0','0','null','null',0),(5819,'0',1228,1194,0,20,150,NULL,0,0,0,'ID',NULL,'Identifier',0,'0','0','0','0',NULL,NULL,0),(5821,'0',1232,1194,0,20,150,NULL,0,0,0,'ID',NULL,'Identifier',0,'0','0','0','0',NULL,NULL,0),(5825,'0',2802,1194,0,20,150,NULL,0,0,0,'ID','null','Identifier',0,'0','0','0','0','null','null',0),(5827,'0',3244,1194,0,20,150,NULL,0,0,0,'ID','null','Identifier',0,'0','0','0','0','null','null',0),(5829,'0',3262,1194,0,20,150,NULL,0,0,0,'ID','null','Identifier',0,'0','0','0','0','null','null',0),(5831,'0',3960,1194,0,20,150,NULL,0,0,0,'ID','null','Identifier',0,'0','0','0','0','null','null',0),(5861,'0',132,1194,0,53,150,NULL,0,0,0,'Del','cv.Del','null',5,'0','0','0','0','null','null',0),(5863,'0',134,1194,0,53,150,NULL,0,0,0,'Del','cv.Del','null',5,'0','0','0','0','null','null',0),(5865,'0',971,1194,0,53,150,NULL,0,0,0,'Del','cv.Del','null',5,'0','0','0','0','null','null',0),(5869,'0',1228,1194,0,53,150,NULL,0,0,0,'Del','cv.Del',NULL,5,'0','0','0','0',NULL,NULL,0),(5871,'0',1232,1194,0,53,150,NULL,0,0,0,'Del','cv.Del',NULL,5,'0','0','0','0',NULL,NULL,0),(5877,'0',2802,1194,0,53,150,NULL,0,0,0,'Del','cv.Del','null',5,'0','0','0','0','null','null',0),(5879,'0',3244,1194,0,53,150,NULL,0,0,0,'Del','cv.Del','null',5,'0','0','0','0','null','null',0),(5881,'0',3262,1194,0,53,150,NULL,0,0,0,'Del','cv.Del','null',5,'0','0','0','0','null','null',0),(5883,'0',3960,1194,0,53,150,NULL,0,0,0,'Del','cv.Del','null',5,'0','0','0','0','null','null',0),(5885,'0',14,1194,0,14,151,NULL,0,0,0,'Concept','Is of the Kind','null',10,'0','0','1','1','null','null',0),(5913,'0',62,1194,0,14,151,NULL,0,0,0,'Concept','Is of the Kind','null',10,'0','0','1','1','null','null',0),(5915,'0',108,1194,0,14,151,NULL,0,0,0,'Concept','Is of the Kind','null',10,'0','0','1','1','null','null',0),(5919,'0',116,1194,0,14,151,NULL,0,0,0,'Concept','Is of the Kind','null',10,'0','0','1','1','null','null',0),(5921,'0',130,1194,0,14,151,NULL,0,0,0,'Concept','Is of the Kind','null',10,'0','0','1','1','null','null',0),(5923,'0',132,1194,0,14,151,NULL,0,0,0,'Concept','Is of the Kind','null',10,'0','0','1','1','null','null',0),(5925,'0',134,1194,0,14,151,NULL,0,0,0,'Concept','Is of the Kind','null',10,'0','0','1','1','null','null',0),(5931,'0',180,1194,0,14,151,NULL,0,0,0,'Concept','Is of the Kind','null',10,'0','0','1','1','null','null',0),(5933,'0',411,1194,0,14,151,NULL,0,0,0,'Concept','Is of the Kind',NULL,9,'0','0','1','1',NULL,NULL,0),(5937,'0',971,1194,0,14,151,NULL,0,0,0,'Concept','Is of the Kind','null',10,'0','0','1','1','null','null',0),(5941,'0',1228,1194,0,14,151,NULL,0,0,0,'Concept','Is of the Kind',NULL,10,'0','0','1','1',NULL,NULL,0),(5943,'0',1232,1194,0,14,151,NULL,0,0,0,'Concept','Is of the Kind',NULL,10,'0','0','1','1',NULL,NULL,0),(5957,'0',2802,1194,0,14,151,NULL,0,0,0,'Concept','Is of the Kind','null',10,'0','0','1','1','null','null',0),(5959,'0',3220,1194,0,14,151,NULL,0,0,0,'Concept','Is of the Kind','null',10,'0','0','1','1','null','null',0),(5961,'0',3244,1194,0,14,151,NULL,0,0,0,'Concept','Is of the Kind','null',10,'0','0','1','1','null','null',0),(5963,'0',3262,1194,0,14,151,NULL,0,0,0,'Concept','Is of the Kind','null',10,'0','0','1','1','null','null',0),(5965,'0',3960,1194,0,14,151,NULL,0,0,0,'Concept','Is of the Kind','null',10,'0','0','1','1','null','null',0),(5967,'0',4312,1194,0,14,151,NULL,0,0,0,'Concept','Is of the Kind',NULL,10,'0','0','1','1',NULL,NULL,0),(5969,'0',14,1194,0,28,150,NULL,0,0,0,'Description','null','null',20,'0','0','1','1','null','null',0),(5997,'0',116,1194,0,28,150,NULL,0,0,0,'Description','null','null',20,'0','0','1','1','null','null',0),(5999,'0',132,1194,0,28,150,NULL,0,0,0,'Description','null','null',20,'0','0','1','1','null','null',0),(6001,'0',134,1194,0,28,150,NULL,0,0,0,'Description','null','null',20,'0','0','1','1','null','null',0),(6005,'0',180,1194,0,28,150,NULL,0,0,0,'Description','null','null',20,'0','0','1','1','null','null',0),(6007,'0',411,1194,0,28,150,NULL,0,0,0,'Description','null','null',20,'0','0','1','1','null','null',0),(6015,'0',1228,1194,0,28,150,NULL,0,0,0,'Description',NULL,NULL,20,'0','0','1','1',NULL,NULL,0),(6017,'0',1232,1194,0,28,150,NULL,0,0,0,'Description',NULL,NULL,20,'0','0','1','1',NULL,NULL,0),(6023,'0',2802,1194,0,28,150,NULL,0,0,0,'Description','null','null',20,'0','0','1','1','null','null',0),(6025,'0',3220,1194,0,28,150,NULL,0,0,0,'Description','null','null',20,'0','0','1','1','null','null',0),(6027,'0',3244,1194,0,28,150,NULL,0,0,0,'Description','null','null',20,'0','0','1','1','null','null',0),(6029,'0',3262,1194,0,28,150,NULL,0,0,0,'Description','null','null',20,'0','0','1','1','null','null',0),(6031,'0',3960,1194,0,28,150,NULL,0,0,0,'Description','null','null',20,'0','0','1','1','null','null',0),(5756,'0',2802,NULL,NULL,2802,151,NULL,NULL,NULL,NULL,'Parent','Parent Kind',NULL,24,'1','1','1','1',NULL,NULL,NULL),(5771,'0',2802,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'HierCode','Hierarchy code',NULL,25,'0','0','0','0',NULL,NULL,NULL),(6037,'0',2802,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'Code','Code','Short code of position',18,'0','0','0','0',NULL,NULL,NULL),(6052,'0',2802,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'SysCode','System Code','Invariant constant code for system usage',7,'0','0','0','0',NULL,NULL,NULL),(6055,'0',2802,NULL,0,53,150,NULL,0,0,0,'Actual','Actual flag','Position is actual',30,'0','0','0','0',NULL,NULL,NULL),(6057,'0',2802,NULL,0,116,151,NULL,0,0,0,'Source','Source installation of CBM','Installation from which this position comes',8,'0','0','0','0',NULL,NULL,NULL),(7415,'0',2802,NULL,0,28,150,NULL,0,0,0,'Notes','Notes','More detailed description',22,'0','0','1','1',NULL,NULL,NULL),(7496,'0',1227,1194,0,53,150,'null',0,0,0,'Del','cv.Del','null',5,'0','0','0','0','null','null',0),(7504,'0',1227,1194,0,14,151,'null',0,0,0,'Concept','Is of the Kind','null',10,'0','0','1','1','null','null',0),(7512,'0',1227,1194,0,28,150,'null',0,0,0,'Description','null','null',20,'0','0','1','1','null','null',0),(7432,'0',130,1194,0,53,150,NULL,0,0,0,'AbnormalInherit','Abnormal Inheritance','Flag that this Class outstand in some way in Inheritance hierarchy, so, it is protected from different parent class influences (like attributes propagating). Maintained by hand.',60,'0','0','0','0',NULL,NULL,NULL),(7568,'0',108,NULL,0,109,2342,NULL,0,0,0,'Items','Menu Items','Menu Items',100,'0','0','1','0',NULL,NULL,NULL),(7781,'0',7777,1194,0,53,150,NULL,0,0,0,'Del','cv.Del',NULL,5,'0','0','0','0',NULL,NULL,NULL),(7779,'0',7777,1194,0,20,150,NULL,0,0,0,'ID',NULL,'Identifier',0,'0','0','0','0',NULL,NULL,NULL),(7783,'0',7777,1194,0,14,151,NULL,0,0,0,'Concept','Is of the Kind',NULL,10,'0','0','1','1',NULL,NULL,NULL),(7796,'0',7777,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Const','rv.Const','Attribute once initialized cannot be changed in the future',185,'0','0','0','0',NULL,NULL,NULL),(7797,'0',7777,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Countable','rv.Countable',NULL,190,'0','0','0','0',NULL,NULL,NULL),(7798,'0',7777,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Historical','rv.Historical',NULL,200,'0','0','0','0',NULL,NULL,NULL),(7799,'0',7777,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Versioned','rv.Versioned',NULL,210,'0','0','0','0',NULL,NULL,NULL),(7800,'0',7777,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'VersPart',NULL,NULL,215,'1','0','0','0',NULL,NULL,NULL),(7801,'0',7777,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'MainPartID','MainPart key attribute name','What attribute MainID points to',220,'0','0','0','0',NULL,NULL,NULL),(7802,'0',7777,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'Root','rv.Root','Root for Hierarchy',230,'0','0','0','0',NULL,NULL,NULL),(7804,'0',7777,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'ForRelation',NULL,NULL,20,'1','0','0','0',NULL,NULL,NULL),(7806,'0',7777,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'DisplayName','rv.DisplayName',NULL,30,'0','0','0','0',NULL,NULL,NULL),(7807,'0',7777,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'PrgAttributeNotes','rv.VersNotes',NULL,34,'0','0','0','0',NULL,NULL,NULL),(7808,'0',7777,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Modified','Is changed from analogue in parent','Is changed compared to analogue attribute from parent concept',350,'0','0','0','0',NULL,NULL,NULL),(7811,'0',7777,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Mandatory','rv.Mandatory',NULL,380,'0','0','0','0',NULL,NULL,NULL),(7809,'0',7777,NULL,NULL,18,150,NULL,NULL,NULL,NULL,'Size','rv.Size',NULL,360,'0','0','0','0',NULL,NULL,NULL),(7813,'0',7777,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprEval','rv.ExprEval',NULL,400,'0','0','0','0',NULL,NULL,NULL),(7814,'0',7777,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprDefault','rv.ExprDefault',NULL,410,'0','0','0','0',NULL,NULL,NULL),(7815,'0',7777,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprValidate','rv.ExprValidate',NULL,420,'0','0','0','0',NULL,NULL,NULL),(7812,'0',7777,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'IsPublic','rv.IsPublic',NULL,390,'0','0','0','0',NULL,NULL,NULL),(7817,'0',7777,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'CopyLinked','rv.CopyLinked',NULL,440,'0','0','0','0',NULL,NULL,NULL),(7816,'0',7777,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'CopyValue','rv.CopyValue',NULL,430,'0','0','0','0',NULL,NULL,NULL),(7810,'0',7777,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'LinkFilter','rv.LinkFilter',NULL,370,'0','0','0','0',NULL,NULL,NULL),(7818,'0',7777,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'DeleteLinked','rv.DeleteLinked',NULL,450,'0','0','0','0',NULL,NULL,NULL),(7819,'0',7777,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'RelationStructRole','rv.RelationStructRole',NULL,460,'0','0','0','0',NULL,NULL,NULL),(7820,'0',7777,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'DBTable','rv.DBTable',NULL,470,'0','0','0','0',NULL,NULL,NULL),(7821,'0',7777,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'DBColumn','rv.DBColumn',NULL,480,'0','0','0','0',NULL,NULL,NULL),(8061,'0',7777,NULL,NULL,1767,151,NULL,NULL,NULL,NULL,'ForPrgClass','Prg class for this Attribute','Prg class for which this Attribute belongs',22,'0','0','0','0',NULL,NULL,NULL),(8536,'0',411,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'Title','Description version for UI',NULL,7,'0','0','0','0',NULL,NULL,NULL);
/*!40000 ALTER TABLE `relation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relationkind`
--

DROP TABLE IF EXISTS `relationkind`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `relationkind` (
  `ID` bigint(20) NOT NULL,
  `Del` char(1) DEFAULT '0',
  `SysCode` varchar(200) DEFAULT NULL,
  `Description` varchar(2000) DEFAULT NULL,
  `Notes` varchar(4000) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relationkind`
--

LOCK TABLES `relationkind` WRITE;
/*!40000 ALTER TABLE `relationkind` DISABLE KEYS */;
INSERT INTO `relationkind` VALUES (150,'0','Value','By-value included instance. Usually of primitive type. ','By-value inclusion of some type instance'),(151,'0','Link','Many-to-One - simple relation by direct pointer to some other instance','Many-to-One association'),(152,'0','BackAggregate','One-to-One Back-linked association with strong dependency, even edited inside prime object','One-to-one association linked by reverse pointer with '),(153,'0','CrossLink','Many-to-Many association ','Many-to-Many relation'),(2341,'0','Aggregate','One-to-One association with strong dependency, even edited inside prime object','Aggregated by link entity, edited and represented in-place with host - main entity'),(2342,'0','BackLink','One-to-Many - collection that points to the prime object','Many-to-One association. Aggregated by back-link entity - the most usual case (default meaning) for back-linked things.');
/*!40000 ALTER TABLE `relationkind` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `right`
--

DROP TABLE IF EXISTS `right`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `right` (
  `ID` bigint(20) NOT NULL,
  `Del` char(1) DEFAULT '0',
  `ForType` bigint(20) DEFAULT NULL,
  `ActionType` bigint(20) DEFAULT NULL,
  `ForUser` bigint(20) DEFAULT NULL,
  `Creteria` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `right`
--

LOCK TABLES `right` WRITE;
/*!40000 ALTER TABLE `right` DISABLE KEYS */;
/*!40000 ALTER TABLE `right` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role` (
  `ID` bigint(20) NOT NULL,
  `Del` char(1) DEFAULT '0',
  `SysCode` varchar(200) DEFAULT NULL,
  `Concept` bigint(20) DEFAULT NULL,
  `Description` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `startsession`
--

DROP TABLE IF EXISTS `startsession`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `startsession` (
  `idSession` char(36) NOT NULL,
  `Counter` bigint(20) DEFAULT NULL,
  `Moment` datetime DEFAULT NULL,
  `TmpKey` char(32) DEFAULT NULL,
  `Locale` char(5) DEFAULT NULL,
  `Who` varchar(45) DEFAULT NULL,
  `FirstKey` varchar(4000) DEFAULT NULL,
  `SystemInstance` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`idSession`)
) ENGINE=MEMORY DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `startsession`
--

LOCK TABLES `startsession` WRITE;
/*!40000 ALTER TABLE `startsession` DISABLE KEYS */;
INSERT INTO `startsession` VALUES ('6b91f5af-4dba-4154-8b54-08b7ea802ada',33,'2014-05-27 21:34:47','Mw5rlnu5mIDdOyT3','fr-FR','TUFW','n:156116620058914803620900612999931352748261267529452205699270147439647576860338066089432653884111074803773822619305880586970891600121371563046983429593107413698017342406924437725060459530621948190691199270400696792526452090486539960553652545886769095450029797724322324287394142774879137696325929787855817082213, e:65537, d:93054910142079251241998589288940878645010881712170544325133726590817293169846746322193527188136701804089607501114865179203059484980106790650584565873096831271476888622879400929418617232610787606210198663431826939337688386825039756221044612280699390451373596554768692673437205666143847894253433650103342670593, p:13201276101949960662385316803918234772819509619470859545209082670631051266423387857084273193205302544916791696491159578169127108239545227986189476836902573, q:11825873412029827606521616788994180816899233039204483511758454684495290469356757782949964994179313682111185291309992984564991666316965205887456488165910681, pe:5924731586533625172997533044747959768877736796580502491771590835577934768135726490996226977611846189994012453558973963908762006723678895749848041292763101, pq:127214256915651135428807236160350603108380903804555607912930261570855849076041232234916540593808324242616928305744008027805958843911995821454397121579673, k:6623975177617676533398971638159673915139119164202751866735879029161692477785988677813482336016295464858133204842495478068119154828010345506485863728628596','CBM');
/*!40000 ALTER TABLE `startsession` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `storescheme`
--

DROP TABLE IF EXISTS `storescheme`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `storescheme` (
  `ID` bigint(20) NOT NULL,
  `SysCode` varchar(200) DEFAULT NULL,
  `Description` varchar(400) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `storescheme`
--

LOCK TABLES `storescheme` WRITE;
/*!40000 ALTER TABLE `storescheme` DISABLE KEYS */;
INSERT INTO `storescheme` VALUES (1355,'RDBMS','Storage in standard Relational DataBase');
/*!40000 ALTER TABLE `storescheme` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `windowsettings`
--

DROP TABLE IF EXISTS `windowsettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `windowsettings` (
  `ID` bigint(20) NOT NULL,
  `DEL` char(1) DEFAULT '0',
  `ForType` varchar(40) DEFAULT NULL,
  `Win` varchar(200) DEFAULT NULL,
  `Context` varchar(400) DEFAULT NULL,
  `ForUser` varchar(40) DEFAULT NULL,
  `Position` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `windowsettings`
--

LOCK TABLES `windowsettings` WRITE;
/*!40000 ALTER TABLE `windowsettings` DISABLE KEYS */;
INSERT INTO `windowsettings` VALUES (1120,'0','PrgView','TableWindow','','TUFW','{\"T\":2, \"L\":2, \"W\":700, \"H\":500}'),(1119,'0','PrgAttribute','TableWindow','','TUFW','{\"T\":23, \"L\":77, \"W\":1000, \"H\":525}'),(789,'0','PrgComponent','FormWindow','','TUFW','{\"T\":75, \"L\":457, \"W\":624, \"H\":158}'),(785,'0','PrgComponent','TableWindow','','TUFW','{\"T\":61, \"L\":317, \"W\":714, \"H\":542}'),(783,'0','PrgAttribute','TableWindow','','TUFW','{\"T\":18, \"L\":152, \"W\":1242, \"H\":620}'),(779,'0','PrgAttribute','FormWindow','','TUFW','{\"T\":75, \"L\":174, \"W\":955, \"H\":573}'),(771,'0','PrgClass','TableWindow','','TUFW','{\"T\":100, \"L\":186, \"W\":1167, \"H\":579}'),(775,'0','PrgClass','FormWindow','','TUFW','{\"T\":47, \"L\":235, \"W\":969, \"H\":573}'),(777,'0','PrgView','FormWindow','','TUFW','{\"T\":56, \"L\":140, \"W\":1038, \"H\":562}'),(776,'0','PrgView','TableWindow','','TUFW','{\"T\":138, \"L\":241, \"W\":779, \"H\":563}'),(947,'0','AttributeKind','TableWindow','','TUFW','{\"T\":26, \"L\":233, \"W\":784, \"H\":475}'),(1371,'0','Concept','TableWindow','','TUFW','{\"T\":33, \"L\":186, \"W\":1039, \"H\":559}'),(1373,'0','Relation','TableWindow','','TUFW','{\"T\":25, \"L\":268, \"W\":909, \"H\":550}'),(1374,'0','Concept','FormWindow','','TUFW','{\"T\":17, \"L\":205, \"W\":916, \"H\":594}'),(1449,'0','ConceptPrgClass','FormWindow','','TUFW','{\"T\":57, \"L\":106, \"W\":1302, \"H\":632}'),(1444,'0','ConceptPrgClass','TableWindow','','TUFW','{\"T\":65, \"L\":189, \"W\":1199, \"H\":600}'),(1501,'0','RelationPrgAttribute','TableWindow','','TUFW','{\"T\":10, \"L\":155, \"W\":1002, \"H\":571}'),(1557,'0','PrgViewField','FormWindow','','TUFW','{\"T\":117, \"L\":248, \"W\":969, \"H\":383}'),(1574,'0','RelationPrgAttribute','FormWindow','','TUFW','{\"T\":5, \"L\":76, \"W\":1052, \"H\":619}'),(1987,'0','RelationKind','TableWindow','','TUFW','{\"T\":155, \"L\":431, \"W\":800, \"H\":296}'),(2659,'0','RelationKind','FormWindow','','TUFW','{\"T\":41, \"L\":227, \"W\":674, \"H\":196}'),(2925,'0','PrgVersion','TableWindow','','TUFW','{\"T\":30, \"L\":190, \"W\":764, \"H\":480}'),(3073,'0','Relation','FormWindow','','TUFW','{\"T\":134, \"L\":89, \"W\":853, \"H\":549}'),(3078,'0','PrgVersion','FormWindow','','TUFW','{\"T\":55, \"L\":265, \"W\":612, \"H\":100}'),(3084,'0','PrgMenuItem','TableWindow','','TUFW','{\"T\":8, \"L\":195, \"W\":808, \"H\":536}'),(3118,'0','PrgMenuItem','FormWindow','','TUFW','{\"T\":70, \"L\":123, \"W\":702, \"H\":368}'),(3119,'0','PrgMenu','TableWindow','','TUFW','{\"T\":8, \"L\":432, \"W\":809, \"H\":481}'),(3144,'0','Object','TableWindow','','TUFW','{\"T\":11, \"L\":130, \"W\":700, \"H\":500}'),(3986,'0','ListSettings','TableWindow','','TUFW','{\"T\":0, \"L\":0, \"W\":1098, \"H\":500}'),(4019,'0','DataBaseStore','TableWindow','','TUFW','{\"T\":20, \"L\":145, \"W\":700, \"H\":500}'),(7077,'0','EntityKind','TableWindow','','TUFW','{\"T\":35, \"L\":377, \"W\":1127, \"H\":470}'),(7294,'0','EntityKind','FormWindow','','TUFW','{\"T\":330, \"L\":373, \"W\":799, \"H\":309}'),(7580,'0','PrgMenu','FormWindow','','TUFW','{\"T\":89, \"L\":526, \"W\":893, \"H\":490}');
/*!40000 ALTER TABLE `windowsettings` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-05-27 21:36:04
