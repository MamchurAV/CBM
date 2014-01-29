CREATE DATABASE  IF NOT EXISTS `cbm` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `cbm`;
-- MySQL dump 10.13  Distrib 5.5.16, for Win32 (x86)
--
-- Host: localhost    Database: cbm
-- ------------------------------------------------------
-- Server version	5.5.25a

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
-- Table structure for table `concept`
--

DROP TABLE IF EXISTS `concept`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `concept` (
  `ID` bigint(20) NOT NULL,
  `Del` char(1) DEFAULT '0',
  `UID` char(36) DEFAULT NULL,
  `SysCode` varchar(200) DEFAULT NULL,
  `BaseConcept` bigint(20) DEFAULT NULL,
  `HierCode` varchar(1000) DEFAULT NULL,
  `Description` varchar(400) DEFAULT NULL,
  `Notes` varchar(4000) DEFAULT NULL,
  `Primitive` char(1) DEFAULT '0',
  `Abstract` char(1) DEFAULT '0',
  `Author` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `concept`
--

LOCK TABLES `concept` WRITE;
/*!40000 ALTER TABLE `concept` DISABLE KEYS */;
INSERT INTO `concept` (`ID`, `Del`, `UID`, `SysCode`, `BaseConcept`, `HierCode`, `Description`, `Notes`, `Primitive`, `Abstract`, `Author`) VALUES (14,'0',NULL,'ConceptPrgClass',116,NULL,'Program Class Metadata','Class that provide metadata for programm  class itself','0','0',17),(18,'0',NULL,'Integer',1236,NULL,'Integer',NULL,'1','0',17),(20,'0',NULL,'Bigint',1236,NULL,'Big Integer',NULL,'1','0',17),(22,'0',NULL,'Decimal',1236,NULL,'Decimal',NULL,'1','0',17),(24,'0',NULL,'BigDecimal',1236,NULL,'Big Decimal',NULL,'1','0',17),(26,'0',NULL,'Money',22,NULL,'Money','Money','1','0',17),(28,'0',NULL,'String',1236,NULL,'String',NULL,'1','0',17),(30,'0',NULL,'ShortString',1236,NULL,'Short String888',NULL,'1','0',17),(32,'0',NULL,'LongString',1236,NULL,'Long String',NULL,'1','0',17),(34,'0',NULL,'Text',1236,NULL,'Text',NULL,'1','0',17),(36,'0',NULL,'Date',1236,NULL,'Date',NULL,'1','0',17),(38,'0',NULL,'DateTime',1236,NULL,'Date Time',NULL,'1','0',17),(40,'0',NULL,'TimePrecize',1236,NULL,'DateTime Precize',NULL,'1','0',17),(53,'0',NULL,'Boolean',1236,NULL,'Boolean',NULL,'1','0',17),(62,'0',NULL,'RelationPrgAttribute',116,NULL,'Programm Attributes','Attribute that model some Accosiation of this (any) object and some related type','1','0',17),(108,'0',NULL,'PrgMenu',116,NULL,'Programm Menu','Menu object - simply header and common point of Menu Items','0','0',17),(109,'0',NULL,'PrgMenuItem',116,NULL,'Programm Menu Item','Programm Menu Item','0','0',17),(116,'0',NULL,'PrgComponent',1232,NULL,'PrgComponent',NULL,'0','1',17),(130,'0',NULL,'EntityConcept',1232,NULL,'Concept','Anything Type - The main semantic classifier of all concepts of the world','0','1',17),(132,'0',NULL,'ChangeConcept',1232,NULL,'Type of Changes',NULL,'0','0',17),(134,'0',NULL,'Particular',1228,NULL,'Object','Consistent element - Object in common OO sence','0','0',17),(143,'0','4F5EF862-BBC9-4C07-9586-C84233E2','WindowSettings',1227,NULL,'Window size and position','Window size and position for User (and optional context)','0','0',17),(148,'0','44F785B6-283C-4C12-B403-CFE6FDB3','RelationKind',1232,NULL,'Relation Kind',NULL,'0','1',17),(180,'0','4CD8A809-D9F0-4F80-B0BC-13381E0B','PrgView',116,NULL,'View of this Type','Interface View of some Type','0','0',17),(411,'0','BCAAC4EF-A898-491C-B949-950E2271','PrgViewField',116,NULL,'PrgViewField','Attributes inclusion into UI View','0','0',17),(453,'0','D6E11BB3-4F97-4C15-B897-19174F4D','ListSettings',1227,NULL,'Table View size and position','Table View size and position for User (and optional context)','0','0',17),(971,'0','80B792DF-9B18-42D0-8BD0-5FC0C124','EnityInChangeRole',1232,NULL,'Role in Activity','Roles that any entity play in some activity','0','0',17),(1194,'0','4D6E30DA-77F8-4E2A-BC8D-C5E4B7F9A05E','Entity',4330,NULL,'Thing ','Any Thing - some real or abstract entity of the world','0','1',17),(1228,'0','1BC18337-74E8-4F5A-BBB6-6850DF2D3A3B','Substance',1194,NULL,'Entity Instances','Anything Existing: Objects and their relations','0','1',17),(1227,'0','88B68D70-6D1F-462C-BB21-C33062C261D9','Structure',1228,NULL,'Structure','Relations, Links, Roles, week Compositions of Objects','0','1',17),(1232,'0','924BA1D7-9073-476C-B2C7-23CF3013D593','Abstraction',1194,NULL,'Abstraction','Any Concepts, Taxonomies, Knowledge, Information...','0','1',17),(1236,'0','D2D27F73-9A9F-4B6B-8E87-9501A55864F1','Primitive',1232,NULL,'Change','Changes of any other Thing (Instance or Abstraction). May be primitive, or complicated.','1','1',17),(1238,'0','A6BC54D0-0010-4237-8D74-9679C815A070','Change',NULL,NULL,'Primitive Types',NULL,'0','1',17),(1234,'0','7396F164-F351-4D45-8B21-5FB42F7117E5','Event',1238,NULL,'Event','Some changes that happends beyond any actor participation','0','1',17),(1235,'0','8C58CFE1-C363-43F5-A739-A0DB5E2408AE','Transaction',1238,NULL,'Trtansaction','Changes that is result of some activity','0','1',17),(1241,'0','79DE5A1F-20D7-4689-BC76-6314D47D67C0','Process',1238,NULL,'Process','Complex of Transactions','0','1',17),(1504,'0','CDD8E711-32B8-4548-BF7F-01DC135A2BDD','PrgVersion',116,NULL,NULL,NULL,'1','1',17),(1624,'0','ACE3B0C0-4CE6-43F3-8E16-C39D97E273F4','RelationConcept',1232,NULL,NULL,NULL,'0','0',17),(1767,'0','FDA8BF01-A6C5-4522-B505-BDFBD4B6543E','PrgClass',116,NULL,NULL,NULL,'0','0',17),(1828,'0','3345A14E-3E30-49E8-B6C8-7A2C444A8418','DataBaseStore',116,NULL,NULL,NULL,'0','0',17),(2541,'0','52D17CAF-7874-4A5E-A187-58FAF9A8F56C','UserRights',1227,NULL,'User Rights',NULL,'0','0',17),(2802,'0','1FFBCD95-5906-4C89-AB43-A507DD07094F','Classifiers',1232,NULL,NULL,NULL,'0','1',17),(3220,'0','E9EFE3F2-E398-4BE5-BFE9-18E1CB9455F8','Roles',1227,NULL,NULL,NULL,'0','0',NULL),(3244,'0','08E37EB6-7CAA-47E4-897E-665CF2976939','Information',3960,NULL,NULL,NULL,'0','1',NULL),(3262,'0','45AC2400-3481-4491-8134-259FE3418A71','Tangible',134,NULL,NULL,NULL,'0','1',NULL),(3960,'0','21FC156A-C950-4D0B-AAC0-1D3267BA9647','Intangible',134,NULL,NULL,NULL,'0','1',NULL),(4312,'0','378E5420-1B49-440D-9B8B-907BEA5F1837','Relations',1194,NULL,NULL,NULL,'0','1',NULL),(4330,'0','69974859-1E60-4A96-B1AC-8DD8202E6ACB','Anything',NULL,NULL,NULL,NULL,'0','1',NULL);
/*!40000 ALTER TABLE `concept` ENABLE KEYS */;
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
INSERT INTO `outformat` (`Code`, `Ds`, `Img`) VALUES ('e4d0d665-35bc-46dd-9152-3cfc01edf853','TUFW','$2a$10$xOMQ1ukq4KSuQLtXE82hOer/y5uPyaU/oRr5SX8WuGff2xNsWp.NS'),('f66bb9f2-c8a2-4a28-927c-35726d2504b7','anonymous','$2a$10$/Gxha31n6doqk27jcqx4t.PuhThfAxIbUIB4ybzEEh7HJ3xW4Zx62');
/*!40000 ALTER TABLE `outformat` ENABLE KEYS */;
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
INSERT INTO `prgviewfield` (`ID`, `Del`, `SysCode`, `Title`, `ForPrgView`, `ForRelation`, `Odr`, `UIPath`, `Mandatory`, `Hidden`, `ViewOnly`, `InList`, `ControlType`, `ShowTitle`, `Editable`, `Hint`, `DataSourceView`, `ValueField`, `DisplayField`, `PickListWidth`, `CreateFromMethods`) VALUES (297,'0','ID',NULL,292,42,1,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(298,'0','UID',NULL,292,43,20,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(299,'0','SysCode',NULL,292,44,30,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(300,'0','Del',NULL,292,45,40,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(301,'0','Installation',NULL,292,46,50,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(302,'0','AnyType',NULL,292,47,60,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(303,'0','BaseConcept',NULL,292,48,75,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(304,'0','Prg',NULL,292,49,80,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(305,'0','Primitive',NULL,292,50,90,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(306,'0','Abstract',NULL,292,51,100,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(307,'0','Category',NULL,292,52,110,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(308,'0','PrgVersion',NULL,292,55,125,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(309,'0','Actual',NULL,292,56,130,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(310,'0','Dated',NULL,292,57,140,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(311,'0','Description',NULL,292,58,150,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(312,'0','Notes',NULL,292,59,160,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(313,'0','PrgPackage',NULL,292,60,170,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(314,'0','PrgType',NULL,292,61,180,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(315,'0','ExprToString',NULL,292,64,190,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(316,'0','ExprFrom',NULL,292,65,200,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(317,'0','ExprWhere',NULL,292,66,210,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(318,'0','ExprGroup',NULL,292,67,230,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(319,'0','ExprHaving',NULL,292,68,240,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(320,'0','ExprOrder',NULL,292,69,220,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(321,'0','ID',NULL,293,70,0,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(322,'0','UID',NULL,293,71,20,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(323,'0','SysCode',NULL,293,72,30,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(324,'0','Del',NULL,293,73,1,NULL,'1','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1566,'0','SysCode',NULL,1547,1528,10,NULL,'1','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(327,'0','BackLinkRelation',NULL,293,81,125,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(329,'0','DisplayName',NULL,293,77,330,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(330,'0','PrgAttributeNotes',NULL,293,78,340,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(331,'0','RelationKind',NULL,293,79,110,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(332,'0','RelatedConcept',NULL,293,80,100,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(333,'0','CrossConcept',NULL,293,82,130,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(334,'0','CrossRelation',NULL,293,83,140,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(335,'0','IsPublic',NULL,293,84,390,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(336,'0','ExprEval',NULL,293,85,400,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(337,'0','ExprDefault',NULL,293,86,410,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(338,'0','ExprValidate',NULL,293,87,420,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(339,'0','LinkFilter',NULL,293,88,370,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(340,'0','CopyValue',NULL,293,89,430,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(341,'0','CopyLinked',NULL,293,90,440,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(342,'0','DeleteLinked',NULL,293,91,450,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(344,'0','InheritedFrom',NULL,293,93,115,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(345,'0','Modified',NULL,293,94,350,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(346,'0','Historical',NULL,293,95,200,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(347,'0','Versioned',NULL,293,96,210,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(348,'0','DBTable',NULL,293,97,470,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(349,'0','DBColumn',NULL,293,98,480,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(350,'0','Odr','Order',293,99,180,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(352,'0','Mandatory',NULL,293,101,380,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1486,'0','SysCode',NULL,587,1200,10,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(354,'0','ID',NULL,295,112,0,NULL,'1','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(355,'0','SysCode',NULL,295,113,20,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(356,'0','Description',NULL,295,114,30,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(357,'0','ParentItem',NULL,295,115,10,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(358,'0','ID',NULL,291,118,1,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(359,'0','UID',NULL,291,119,20,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(360,'0','SysCode',NULL,291,120,30,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(361,'0','Del',NULL,291,121,40,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(362,'0','Installation',NULL,291,122,50,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(363,'0','AnyType',NULL,291,123,60,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(365,'0','PrgClassID',NULL,292,125,120,NULL,'0','1','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(366,'0','MainID',NULL,292,126,125,NULL,'0','1','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(367,'0','ForPrgClass',NULL,293,136,320,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(368,'0','PrgClass',NULL,291,137,80,NULL,'0','1','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(369,'0','PrgClass',NULL,292,138,22,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(370,'0','UIForms',NULL,292,139,140,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(371,'0','PrgAttributeID',NULL,293,140,300,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(373,'0','ID',NULL,294,154,1,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(374,'0','Description',NULL,294,155,2,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(375,'0','SysCode',NULL,294,156,3,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(376,'0','DEL',NULL,294,157,999,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1565,'0','UID',NULL,1547,1526,2,NULL,'0','1','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1563,'0','ID',NULL,1547,1520,0,NULL,'0','1','0','0',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1564,'0','Del',NULL,1547,1524,1,NULL,'0','1','0','0',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(380,'0','Notes',NULL,294,161,999,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(392,'0','ID',NULL,296,182,0,NULL,'1','1','0','0',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(393,'0','UID',NULL,296,183,0,NULL,'0','1','0','0',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(394,'0','SysCode',NULL,296,184,0,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(395,'0','Del',NULL,296,185,0,NULL,'0','1','0','0',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(396,'0','InstallationID',NULL,296,186,0,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(397,'0','AnyTypeID',NULL,296,187,0,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(398,'0','PrgClassID',NULL,296,188,0,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(434,'0','PrgAttrID',NULL,293,400,1,NULL,'1','0','0','0',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(435,'0','ForConcept',NULL,293,401,10,NULL,'1','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(439,'0','PrgViewID',NULL,296,404,0,NULL,'1','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(440,'0','ForConcept',NULL,296,406,0,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(441,'0','Notes',NULL,296,436,0,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(452,'0','ID',NULL,451,415,0,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(461,'0','ForPrgView',NULL,451,417,1,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(462,'0','ForRelation',NULL,451,421,2,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(463,'0','Odr','Order',451,423,3,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(464,'0','UIPath',NULL,451,425,4,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(457,'0','Mandatory',NULL,451,427,5,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1485,'0','ID',NULL,587,1201,0,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(459,'0','Hidden',NULL,451,431,7,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(460,'0','InList',NULL,451,433,8,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(555,'0','ID',NULL,552,145,1,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1655,'0','SysCode',NULL,1649,1645,NULL,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(591,'0','Win',NULL,552,172,999,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(597,'0','Context',NULL,552,174,999,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1653,'0','ID',NULL,1649,1634,0,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(646,'0','Position',NULL,552,178,999,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1654,'0','Del',NULL,1649,1643,1,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(589,'0','ForUser',NULL,552,176,999,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(644,'0','Del',NULL,552,166,999,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1712,'0','Notes',NULL,1649,1681,16,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1711,'0','Description',NULL,1649,1679,10,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(645,'0','ForType',NULL,552,171,999,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(826,'0','ID',NULL,551,802,0,NULL,'0','0','0','1','','1','1',NULL,NULL,NULL,NULL,NULL,NULL),(829,'0','Del',NULL,551,806,999,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(831,'0','Win',NULL,551,812,999,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(830,'0','ForType',NULL,551,810,999,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(833,'0','ForUser',NULL,551,816,999,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(832,'0','Context',NULL,551,814,999,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(834,'0','Settings',NULL,551,818,999,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1002,'0','ID',NULL,998,978,0,NULL,'1','0','0','0',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1003,'0','SysCode',NULL,998,980,10,NULL,'1','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1004,'0','Name',NULL,998,996,20,NULL,'1','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1147,'0','SysCode',NULL,451,455,2,NULL,'0','0','1','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1567,'0','Derscription',NULL,1547,1679,20,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1568,'0','Owner',NULL,1547,1532,30,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1569,'0','DateMark',NULL,1547,1534,40,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1570,'0','Actual',NULL,1547,1536,50,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1571,'0','ExprFilter',NULL,1547,1538,60,NULL,'0','0','0','0',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1715,'0','RelationRole',NULL,1649,1665,40,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1714,'0','InheritedFrom',NULL,1649,1663,30,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1718,'0','Domain',NULL,1649,1671,55,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1713,'0','ForConcept',NULL,1649,1658,30,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1717,'0','RelationKind',NULL,1649,1669,55,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1716,'0','RelatedConcept',NULL,1649,1667,50,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1719,'0','BackLinkRelation',NULL,1649,1673,60,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1720,'0','CrossConcept',NULL,1649,1675,70,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1722,'0','Odr','Order',1649,1683,80,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1721,'0','CrossRelation',NULL,1649,1677,73,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1723,'0','Const',NULL,1649,1685,83,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1724,'0','Countable',NULL,1649,1687,86,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1725,'0','Historical',NULL,1649,1689,90,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1726,'0','Versioned',NULL,1649,1691,93,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1727,'0','VersPart',NULL,1649,1693,93,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1728,'0','MainPartID',NULL,1649,1695,98,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1729,'0','Root',NULL,1649,1697,110,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1747,'0','Del',NULL,587,1738,1,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1749,'0','BaseConcept',NULL,587,1602,20,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1748,'0','UID',NULL,587,1740,5,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1750,'0','Description',NULL,587,1604,30,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1752,'0','Primitive',NULL,587,1608,50,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1751,'0','Notes',NULL,587,1606,33,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1754,'0','Author',NULL,587,1612,70,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1753,'0','Abstract',NULL,587,1610,55,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1772,'0','ForRelation',NULL,293,408,310,'IS related','1','0','0','0',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1807,'0','Del',NULL,451,1784,2,NULL,'0','1','0','0',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1857,'0','ID',NULL,1851,1772,0,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1858,'0','Del',NULL,1851,1774,1,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1859,'0','UID',NULL,1851,1801,3,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1860,'0','ForConcept',NULL,1851,1811,10,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1861,'0','PrgVersion',NULL,1851,1814,10,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1862,'0','Description',NULL,1851,1816,10,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1864,'0','ExprToString',NULL,1851,1820,40,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1863,'0','Notes',NULL,1851,1818,33,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1865,'0','DataBaseStore',NULL,1851,1823,45,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1866,'0','ExprFrom',NULL,1851,1836,50,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1868,'0','ExprOrder',NULL,1851,1844,54,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1867,'0','ExprWhere',NULL,1851,1838,52,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1869,'0','ExprGroup',NULL,1851,1840,56,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1870,'0','ExprHaving',NULL,1851,1842,58,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1871,'0','PrgPackage',NULL,1851,1847,70,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(1877,'0','PrgType',NULL,1851,1849,72,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2083,'0','Del','Del',2082,2066,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2084,'0','ID','ID',2082,2065,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2085,'0','UID','UID',2082,2069,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2086,'0','SysCode','SysCode',2082,2071,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2087,'0','Description','Description',2082,2073,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2088,'0','DriverType','DriverType',2082,2075,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2089,'0','ConnectionParams','ConnectionParams',2082,2077,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2093,'0','Del','Del',2092,2066,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2094,'0','ID','ID',2092,2065,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2095,'0','UID','UID',2092,2069,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2096,'0','SysCode','SysCode',2092,2071,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2097,'0','Description','Description',2092,2073,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2098,'0','DriverType','DriverType',2092,2075,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2099,'0','ConnectionParams','ConnectionParams',2092,2077,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2101,'0','Del','Del',2100,2066,1,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2102,'0','ID','ID',2100,2065,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2103,'0','UID','UID',2100,2069,5,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2104,'0','SysCode','SysCode',2100,2071,10,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2105,'0','Description','Description',2100,2073,20,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2106,'0','DriverType','DriverType',2100,2075,30,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2107,'0','ConnectionParams','ConnectionParams',2100,2077,40,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2218,'0','ID','ID',2217,70,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2146,'0','Notes','Note',2140,436,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2144,'0','Del','Del',2140,185,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2143,'0','SysCode','Code',2140,184,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2142,'0','UID','UID',2140,183,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2139,'0','Del','Del',2132,2066,1,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2133,'0','ID','ID',2132,2065,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2134,'0','UID','UID',2132,2069,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2135,'0','SysCode','SysCode',2132,2071,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2136,'0','Description','Description',2132,2073,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2141,'0','ID','ID',2140,182,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2138,'0','ConnectionParams','ConnectionParams',2132,2077,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2219,'0','Del','Del',2217,73,1,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2222,'0','SysCode','Attribute Code',2217,72,30,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2223,'0','Description','Description',2217,2204,40,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2224,'0','Notes','Notes',2217,2206,45,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2228,'0','Domain','Values Set',2217,477,120,NULL,'0','0','0','1','null, ','1','1','Map of possible Values','null, ','ID','SysCode',500,NULL),(2232,'0','Odr','Order',2217,99,180,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2233,'0','Const','Constant',293,475,185,NULL,'0','0','0','1','null, ','1','1','Attribute once initialized cannot be changed in the future','null, ','ID','SysCode',500,NULL),(2234,'0','Countable','Countable',293,92,190,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2235,'0','Historical','Historical attribute',2217,95,200,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2236,'0','Versioned','Versioned',2217,96,210,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2237,'0','Part','Part',2217,481,210,NULL,'0','0','0','1','null, ','1','1','Part of Entity in meta-data sence','null, ','ID','SysCode',500,NULL),(2238,'0','MainPartID','??? MainPartID - MUST DIE?',2217,485,220,NULL,'0','0','0','1','null, ','1','1','What attribute MainID points to','null, ','ID','SysCode',500,NULL),(2239,'0','Root','Root item',2217,487,230,NULL,'0','0','0','1','null, ','1','1','Root for Hierarchy','null, ','ID','SysCode',500,NULL),(2241,'0','ForRelation','MainID',2217,408,310,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2243,'0','DisplayName','Name',2217,77,330,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2244,'0','PrgAttributeNotes','Notes',2217,78,340,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2245,'0','Modified','Modified',2217,94,350,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2246,'0','Size','Size',2217,473,360,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2247,'0','LinkFilter','LinkFilter',2217,88,370,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2248,'0','Mandatory','UIMandatory',2217,101,380,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2249,'0','IsPublic','IsPublic',2217,84,390,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2250,'0','ExprEval','ExprEval',2217,85,400,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2251,'0','ExprDefault','ExprDefault',2217,86,410,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2252,'0','ExprValidate','ExprValidate',2217,87,420,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2253,'0','CopyValue','CopyValue',2217,89,430,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2254,'0','CopyLinked','CopyLinked',2217,90,440,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2255,'0','DeleteLinked','DeleteLinked',2217,91,450,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2256,'0','RelationStructRole','Role of Relation in Concept internal stucture',2217,479,460,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2257,'0','DBTable','DBTable',2217,97,470,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2258,'0','DBColumn','DBColumn',2217,98,480,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',500,NULL),(2213,'0','PrgAttributeID',NULL,2217,140,300,NULL,'0','0','0','0',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2304,'0','RelationRole',NULL,293,2213,20,NULL,'1','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2214,'0','ForPrgClass',NULL,2217,136,320,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2591,'0','ForType',NULL,2572,2551,10,NULL,NULL,NULL,'0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2592,NULL,'ActionType',NULL,2572,2560,20,NULL,NULL,NULL,'0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2593,'0','ForUser',NULL,2572,2562,30,NULL,NULL,NULL,'0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2577,'0','Creteria','Creteria',2572,2564,50,NULL,'0','0','0','1','null, ','1','1','Additional creteria','null, ','ID','SysCode',NULL,NULL),(2573,'0','ID','ID',2572,2547,0,NULL,'0','0','0','1','null, ','1','1','ID of Right','null, ','ID','SysCode',NULL,NULL),(2364,NULL,'Args',NULL,295,2354,80,NULL,NULL,NULL,'0',NULL,NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2363,'0','CalledMethod',NULL,295,2352,70,NULL,'1','1','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2362,NULL,'CalledConcept',NULL,295,2350,60,NULL,NULL,NULL,'0',NULL,NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2361,'0','ForMenu',NULL,295,2347,5,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2341,'0','Odr',NULL,295,2342,15,NULL,'1','1','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2331,'0','RelationStructRole',NULL,293,479,460,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2324,'0','Root','Root item',293,487,230,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2329,'0','Size',NULL,293,473,360,'IS related','0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2322,'0','MainPartID',NULL,293,485,220,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2320,'0','VersPart',NULL,293,481,215,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2307,'0','Notes',NULL,293,2206,45,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2311,'0','Domain',NULL,293,477,120,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(2306,'0','Description',NULL,293,2204,40,NULL,'0','0','0','1',NULL,'1','1',NULL,NULL,NULL,NULL,NULL,NULL),(3182,'0','ID','null',3181,3089,0,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',NULL,NULL),(3183,'0','Del','null',3181,3096,1,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',NULL,NULL),(3184,'0','UID','null',3181,3098,2,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',NULL,NULL),(3185,'0','SysCode','null',3181,3100,2,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',NULL,NULL),(3186,'0','Description','null',3181,3102,20,NULL,'0','0','0','1','null, ','1','1','null','null, ','ID','SysCode',NULL,NULL);
/*!40000 ALTER TABLE `prgviewfield` ENABLE KEYS */;
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
  `CalledMethod` bigint(20) DEFAULT NULL,
  `Args` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prgmenuitem`
--

LOCK TABLES `prgmenuitem` WRITE;
/*!40000 ALTER TABLE `prgmenuitem` DISABLE KEYS */;
INSERT INTO `prgmenuitem` (`ID`, `ParentItem`, `Odr`, `ForMenu`, `SysCode`, `Description`, `CalledConcept`, `CalledMethod`, `Args`) VALUES (104,NULL,3000,NULL,'MetaData','MetaProgramming section',NULL,NULL,NULL),(105,104,3300,NULL,'PrgComponent','Program Components',9,NULL,NULL),(106,104,3010,103,'ConceptPrgClass','Concepts with IS extencion',14,0,NULL),(146,1917,2050,NULL,'RelationKind','Assosiations Types',NULL,NULL,NULL),(434,105,3320,103,'PrgView','Presentation Views',NULL,NULL,NULL),(1442,1917,2010,NULL,'Concept','Concepts - Ontology view',130,NULL,NULL),(1917,NULL,2000,NULL,'Master Data','Master Data section',NULL,NULL,NULL),(3193,NULL,100,103,'WorkArea','Applications',NULL,NULL,NULL),(3205,3193,3000,103,'ALM','ALM - Application Lifecycle Management',NULL,NULL,NULL),(3206,3193,201,103,'CRM','CRM - Customer Relations Management',NULL,NULL,NULL),(3208,3193,700,103,'EAM','EAM - Enterprise Assets Management',NULL,NULL,NULL),(3209,3205,10,103,'Products','Product construction',NULL,NULL,NULL),(3211,3205,20,103,'Development','Development process',NULL,NULL,NULL),(3213,3205,40,103,'ImplementProjects','Implementation projects',NULL,NULL,NULL),(3214,3205,50,103,'Support','Customer support process',NULL,NULL,NULL),(3215,3208,10,103,'Assets','Assets list',NULL,1,NULL),(3216,3206,40,103,'Customers','Customers',NULL,1,NULL),(3217,3206,10,103,'Incidents','Incidents',NULL,1,NULL),(3218,3193,4000,103,'ERP','ERP - Full-featured Enterpise-wide application',NULL,0,NULL),(3219,3218,700,103,'EAM','EAM - Enterprise Assets Management',NULL,0,NULL);
/*!40000 ALTER TABLE `prgmenuitem` ENABLE KEYS */;
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
INSERT INTO `imgname` (`ID`, `NameCode`, `ImgCode`) VALUES (2487,'anonymous','f66bb9f2-c8a2-4a28-927c-35726d2504b7'),(2498,'TUFW','e4d0d665-35bc-46dd-9152-3cfc01edf853');
/*!40000 ALTER TABLE `imgname` ENABLE KEYS */;
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
  `UID` char(32) DEFAULT NULL,
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
INSERT INTO `prgclass` (`ID`, `Del`, `UID`, `ForConcept`, `PrgVersion`, `Description`, `Notes`, `ExprToString`, `DataBaseStore`, `ExprFrom`, `ExprWhere`, `ExprOrder`, `ExprGroup`, `ExprHaving`, `PrgPackage`, `PrgType`) VALUES (15,'0',NULL,14,333,'Concept with Class','Complex which represents Concept and related PrgClass','SysCode',1469,'CBM.Concept c INNER JOIN CBM.PrgClass cv ON cv.ForConcept = c.ID and cv.Del=0 INNER JOIN CBM.PrgVersion vers on vers.ID=cv.PrgVersion and vers.Actual=1 and vers.Del=0',NULL,'c.SysCode',NULL,NULL,'',''),(19,'0',NULL,18,333,'Integer',NULL,NULL,NULL,NULL,NULL,'ID',NULL,NULL,'',''),(21,'0',NULL,20,333,'Big Integer',NULL,NULL,NULL,NULL,NULL,'ID',NULL,NULL,'',''),(23,'0',NULL,22,333,'Decimal',NULL,NULL,NULL,NULL,NULL,'ID',NULL,NULL,'',''),(25,'0',NULL,24,333,'Big Decimal',NULL,NULL,NULL,NULL,NULL,'ID',NULL,NULL,'',''),(27,'0',NULL,26,333,'Money','Money',NULL,NULL,NULL,NULL,'ID',NULL,NULL,'',''),(29,'0',NULL,28,333,'String',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'CBMCore',''),(31,'0',NULL,30,333,'Short String888',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',''),(33,'0',NULL,32,333,'Long String',NULL,NULL,NULL,NULL,NULL,'ID',NULL,NULL,'',''),(35,'0',NULL,34,333,'Text',NULL,NULL,NULL,NULL,NULL,'ID',NULL,NULL,'',''),(37,'0',NULL,36,333,'Date',NULL,NULL,NULL,NULL,NULL,'ID',NULL,NULL,'',''),(39,'0',NULL,38,333,'Date Time',NULL,NULL,NULL,NULL,NULL,'ID',NULL,NULL,'',''),(41,'0',NULL,40,333,'DateTime Precize',NULL,NULL,NULL,NULL,NULL,'ID',NULL,NULL,'',''),(54,'0',NULL,53,333,'Boolean',NULL,NULL,NULL,NULL,NULL,'ID',NULL,NULL,'',''),(63,'0',NULL,62,333,'Programm Attributes','Attribute that model some Accosiation of this (any) object and some related type','SysCode',1469,'CBM.Relation r INNER JOIN CBM.PrgAttribute rv ON rv.ForRelation=r.ID',NULL,'r.Odr, r.ID',NULL,NULL,'',''),(110,'0',NULL,108,333,'Programm Menu','Menu object - simply header and common point of Menu Items',NULL,1469,'CBM.PrgMenu',NULL,'ID',NULL,NULL,'',''),(111,'0',NULL,109,333,'Programm Menu Item','Programm Menu Item',NULL,1469,'CBM.PrgMenuItem',NULL,'Odr',NULL,NULL,'',''),(117,'0',NULL,116,333,'PrgComponent',NULL,NULL,1469,'CBM.PrgComponent pc',NULL,'ID',NULL,NULL,'',''),(131,'0',NULL,130,333,'Entity Categories','Anything Type - The main semantic classifier of all concepts of the world',NULL,1469,'CBM.Concept c',NULL,'c.SysCode',NULL,NULL,'',''),(133,'0',NULL,132,333,'Kinds of Changes',NULL,NULL,1469,'CBM.ChangeType',NULL,'ID',NULL,NULL,'',''),(135,'0',NULL,134,333,'Consistent Object','Consistent element - Object in common sence',NULL,1469,'CBM.Object',NULL,'ID',NULL,NULL,'',''),(144,'0',NULL,143,333,'Window size and position for User','Window size and position for User (and optional context)',NULL,1469,'CBM.WindowSettings ws',NULL,'ws.ID',NULL,NULL,NULL,NULL),(149,'0',NULL,148,333,'Relation Kind','Kinds of Relations (Attributes) - generalized meaning of semantically the same attributes ',NULL,1469,'CBM.RelationKind rk',NULL,'rk.ID',NULL,NULL,NULL,NULL),(181,'0',NULL,180,333,'View of this Type','Interface View of some Type',NULL,1469,'CBM.PrgView cv',NULL,'cv.SysCode',NULL,NULL,NULL,NULL),(412,'0',NULL,411,333,'PrgViewField','Attributes inclusion into UI View',NULL,1469,'CBM.PrgViewField cvf INNER JOIN CBM.Relation r on r.ID = cvf.ForRelation',NULL,'cvf.Odr',NULL,NULL,NULL,NULL),(454,'0',NULL,453,333,'Table View size and position for User','Table View size and position for User (and optional context)',NULL,1469,'CBM.ListSettings ls',NULL,'ls.ID',NULL,NULL,NULL,NULL),(972,'0',NULL,971,333,'Role of Entity in Activity','Roles that any entity play in some activity',NULL,1469,'CBM.Role r',NULL,'ID',NULL,NULL,NULL,NULL),(1195,'0',NULL,1194,333,'Everything exists in reality or in thoughts','Any Thing - some real or abstract entity of the world',NULL,NULL,NULL,NULL,'ID',NULL,NULL,'',''),(1230,'0',NULL,1228,333,'Anything that exits in the world beyond anybody\'s  mind','Anything Existing: Objects and their relations',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1229,'0',NULL,1227,333,'Structure','Relations, Links, Roles, week Compositions of Objects',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1233,'0',NULL,1232,333,'Abstraction','Any Abstractions, Concepts, Taxonomies, Knowledge, Information, Thoughts, Plans, ...',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1239,'0',NULL,1238,333,'Any Change in Substanses and their Relations','Any changes in Instances or Abstractions. Changes of any other Thing (Instance or Abstraction). May be primitive, or complicated.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1237,'0',NULL,1236,333,'Scalar Types','Primitive value-types',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1235,'0',NULL,1234,333,'Event','Some changes that happends beyond any actor participation',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1234,'0',NULL,1235,333,'Transaction','Changes that is result of some activity',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1242,'0',NULL,1241,333,'Process','Complex of Transactions',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(1625,'0',NULL,1624,333,'Relation Concept','Description of Properties, associations of Concept with other (including Primitive properties)',NULL,NULL,'CBM.Relation r',NULL,'r.Odr, r.ID',NULL,NULL,NULL,NULL),(1505,'0',NULL,1504,333,'Programm Versions',NULL,NULL,NULL,'CBM.PrgVersion pv',NULL,'pv.ID',NULL,NULL,NULL,NULL),(1768,'0',NULL,1767,333,'Program Class Metadata','Information System related properties of Concept - for work with that concept instances in IS','Code',NULL,'CBM.PrgClass pc INNER JOIN CBM.PrgVersion vers on vers.ID=pc.PrgVersion and vers.Actual=1 and vers.Del=0','pc.Del=0','pc.Description',NULL,NULL,'',''),(1829,'0',NULL,1828,333,'DataBaseStore','DataBaseStore','SysCode',NULL,'CBM.DataBaseStore dbs','dbs.Del=0','dbs.SysCode',NULL,NULL,'',''),(2542,'0',NULL,2541,333,'Right for something','The most abstract kind of Rights - as permission of Somebody make any Activitieson Something',NULL,NULL,'CBM.Right r',NULL,'r.ForType, r.ForUser, r.ID',NULL,NULL,NULL,NULL),(2803,'0',NULL,2802,333,'Main classifiers','Main (in Aristotle sense) classifiers of everything',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3221,'0',NULL,3220,333,'Roles','Role-related sets of some entity properties',NULL,NULL,'CBM.ListSettings ls',NULL,'ls.ID',NULL,NULL,NULL,NULL),(3245,'0',NULL,3244,333,'Information','Information as Intangible Substance ',NULL,NULL,'CBM.PrgComponent pc',NULL,'ID',NULL,NULL,'',''),(3263,'0',NULL,3262,333,'Tangible object','Tangible object',NULL,NULL,'CBM.PrgComponent pc',NULL,'ID',NULL,NULL,'',''),(3961,'0',NULL,3960,333,'Intangible object','Intangible object',NULL,NULL,'CBM.PrgComponent pc',NULL,'ID',NULL,NULL,'',''),(4313,'0',NULL,4312,333,'Associations','Any Associations, relations, even properties (which are the kind of associations), roles (which are complicated kind of associations too), so on... ',NULL,NULL,NULL,NULL,'ID',NULL,NULL,'',''),(4331,'0',NULL,4330,333,'Anything','All system (even world) inventory',NULL,NULL,NULL,NULL,'ID',NULL,NULL,'','');
/*!40000 ALTER TABLE `prgclass` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `right`
--

DROP TABLE IF EXISTS `right`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `right` (
  `ID` bigint(20) NOT NULL,
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
INSERT INTO `relation` (`ID`, `Del`, `ForConcept`, `InheritedFrom`, `RelationRole`, `RelatedConcept`, `RelationKind`, `Domain`, `BackLinkRelation`, `CrossConcept`, `CrossRelation`, `SysCode`, `Description`, `Notes`, `Odr`, `Const`, `Countable`, `Historical`, `Versioned`, `VersPart`, `MainPartID`, `Root`) VALUES (42,'0',14,116,NULL,20,150,NULL,NULL,NULL,NULL,'ID','c.ID',NULL,1,'0','0','0','0',NULL,NULL,NULL),(43,'0',14,116,NULL,30,150,NULL,NULL,NULL,NULL,'UID','c.UID',NULL,20,'0','0','0','0',NULL,NULL,NULL),(44,'0',14,116,NULL,30,150,NULL,NULL,NULL,NULL,'SysCode','c.SysCode',NULL,30,'0','0','0','0',NULL,NULL,NULL),(45,'0',14,116,NULL,53,150,NULL,NULL,NULL,NULL,'Del','c.Del',NULL,40,'0','0','0','0',NULL,NULL,NULL),(48,'0',14,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'BaseConcept','c.BaseConcept',NULL,75,'0','0','0','0',NULL,NULL,NULL),(50,'0',14,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Primitive','c.Primitive',NULL,90,'0','0','0','0',NULL,NULL,NULL),(51,'0',14,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Abstract','c.Abstract',NULL,100,'0','0','0','0',NULL,NULL,NULL),(55,'0',14,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'ConceptVersion','cv.ConceptVersion',NULL,125,'0','0','0','0',NULL,NULL,NULL),(58,'0',14,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'VersDescription','cv.VersDescription',NULL,150,'0','0','0','0',NULL,NULL,NULL),(59,'0',14,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'VersNotes','cv.VersNotes',NULL,160,'0','0','0','0',NULL,NULL,NULL),(60,'0',14,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'PrgPackage','cv.PrgPackage',NULL,170,'0','0','0','0',NULL,NULL,NULL),(61,'0',14,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'PrgType','cv.PrgType',NULL,180,'0','0','0','0',NULL,NULL,NULL),(64,'0',14,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprToString','cv.ExprToString',NULL,190,'0','0','0','0',NULL,NULL,NULL),(65,'0',14,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprFrom','cv.ExprFrom',NULL,200,'0','0','0','0',NULL,NULL,NULL),(66,'0',14,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprWhere','cv.ExprWhere',NULL,210,'0','0','0','0',NULL,NULL,NULL),(67,'0',14,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprGroup','cv.ExprGroup',NULL,230,'0','0','0','0',NULL,NULL,NULL),(68,'0',14,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprHaving','cv.ExprHaving',NULL,240,'0','0','0','0',NULL,NULL,NULL),(69,'0',14,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'ExprOrder','cv.ExprOrder',NULL,220,'0','0','0','0',NULL,NULL,NULL),(70,'0',62,116,NULL,20,150,NULL,NULL,NULL,NULL,'ID','r.ID',NULL,0,'0','0','0','0',NULL,NULL,NULL),(72,'0',62,116,NULL,30,150,NULL,NULL,NULL,NULL,'SysCode','r.SysCode',NULL,30,'0','0','0','0',NULL,NULL,NULL),(73,'0',62,116,NULL,53,150,NULL,NULL,NULL,NULL,'Del','r.Del',NULL,1,'0','0','0','0',NULL,NULL,NULL),(81,'0',62,NULL,NULL,62,151,NULL,NULL,NULL,NULL,'BackLinkRelation','rv.BackLinkRelation',NULL,125,'0','0','0','0',NULL,NULL,NULL),(77,'0',62,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'DisplayName','rv.DisplayName',NULL,330,'0','0','0','0',NULL,NULL,NULL),(78,'0',62,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'PrgAttributeNotes','rv.VersNotes',NULL,340,'0','0','0','0',NULL,NULL,NULL),(79,'0',62,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'RelationKind','rv.RelationKind',NULL,110,'0','0','0','0',NULL,NULL,NULL),(80,'0',62,NULL,NULL,14,151,NULL,NULL,NULL,NULL,'RelatedConcept','rv.RelatedConcept',NULL,100,'0','0','0','0',NULL,NULL,NULL),(82,'0',62,NULL,NULL,14,151,NULL,NULL,NULL,NULL,'CrossConcept','rv.CrossConcept',NULL,130,'0','0','0','0',NULL,NULL,NULL),(83,'0',62,NULL,NULL,62,151,NULL,NULL,NULL,NULL,'CrossRelation','rv.CrossRelation',NULL,140,'0','0','0','0',NULL,NULL,NULL),(84,'0',62,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'IsPublic','rv.IsPublic',NULL,390,'0','0','0','0',NULL,NULL,NULL),(85,'0',62,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprEval','rv.ExprEval',NULL,400,'0','0','0','0',NULL,NULL,NULL),(86,'0',62,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprDefault','rv.ExprDefault',NULL,410,'0','0','0','0',NULL,NULL,NULL),(87,'0',62,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprValidate','rv.ExprValidate',NULL,420,'0','0','0','0',NULL,NULL,NULL),(88,'0',62,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'LinkFilter','rv.LinkFilter',NULL,370,'0','0','0','0',NULL,NULL,NULL),(89,'0',62,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'CopyValue','rv.CopyValue',NULL,430,'0','0','0','0',NULL,NULL,NULL),(90,'0',62,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'CopyLinked','rv.CopyLinked',NULL,440,'0','0','0','0',NULL,NULL,NULL),(91,'0',62,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'DeleteLinked','rv.DeleteLinked',NULL,450,'0','0','0','0',NULL,NULL,NULL),(92,'0',62,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Countable','rv.Countable',NULL,190,'0','0','0','0',NULL,NULL,NULL),(93,'0',62,NULL,NULL,14,151,NULL,NULL,NULL,NULL,'InheritedFrom','rv.InheritedFrom',NULL,115,'0','0','0','0',NULL,NULL,NULL),(94,'0',62,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Modified','rv.Modified',NULL,350,'0','0','0','0',NULL,NULL,NULL),(95,'0',62,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Historical','rv.Historical',NULL,200,'0','0','0','0',NULL,NULL,NULL),(96,'0',62,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Versioned','rv.Versioned',NULL,210,'0','0','0','0',NULL,NULL,NULL),(97,'0',62,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'DBTable','rv.DBTable',NULL,470,'0','0','0','0',NULL,NULL,NULL),(98,'0',62,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'DBColumn','rv.DBColumn',NULL,480,'0','0','0','0',NULL,NULL,NULL),(99,'0',62,NULL,NULL,18,150,NULL,NULL,NULL,NULL,'Odr','rv.Seqn',NULL,180,'0','0','0','0',NULL,NULL,NULL),(473,'0',62,NULL,NULL,18,150,NULL,NULL,NULL,NULL,'Size','rv.Size',NULL,360,'0','0','0','0',NULL,NULL,NULL),(101,'0',62,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Mandatory','rv.Mandatory',NULL,380,'0','0','0','0',NULL,NULL,NULL),(470,'0',14,NULL,NULL,62,152,NULL,401,NULL,NULL,'Attributes',NULL,NULL,500,'0','0','0','0',NULL,NULL,NULL),(112,'0',109,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'ID','ID',NULL,0,'0','0','0','0',NULL,NULL,NULL),(113,'0',109,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'SysCode','SysCode',NULL,20,'0','0','0','0',NULL,NULL,NULL),(114,'0',109,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'Description','Name',NULL,30,'0','0','0','0',NULL,NULL,NULL),(115,'0',109,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'ParentItem','ParentID',NULL,10,'0','0','0','0',NULL,NULL,NULL),(118,'0',116,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'ID','ID',NULL,1,'0','0','0','0',NULL,NULL,NULL),(119,'0',116,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'UID','UID',NULL,20,'0','0','0','0',NULL,NULL,NULL),(120,'0',116,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'SysCode','SysCode',NULL,30,'0','0','0','0',NULL,NULL,NULL),(121,'0',116,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Del','Del','Deleted flag',40,'0','0','0','0',NULL,NULL,NULL),(122,'0',116,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'Installation','InstallationID',NULL,50,'0','0','0','0',NULL,NULL,NULL),(123,'0',116,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'AnyType','AnyTypeID',NULL,60,'0','0','0','0',NULL,NULL,NULL),(125,'0',14,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'PrgClassID','cv.ID',NULL,120,'0','0','0','0',NULL,NULL,NULL),(126,'0',14,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'MainID','cv.MainID',NULL,125,'0','0','0','0',NULL,NULL,NULL),(136,'0',62,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'ForPrgClass','rv.ForConceptVers',NULL,320,'0','0','0','0',NULL,NULL,NULL),(137,'0',116,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'PrgClass','PrgClassID',NULL,80,'0','0','0','0',NULL,NULL,NULL),(138,'0',14,116,NULL,20,151,NULL,NULL,NULL,NULL,'DataBaseStore','cv.DataBaseStore',NULL,22,'0','0','0','0',NULL,NULL,NULL),(140,'0',62,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'PrgAttributeID','rv.ID',NULL,300,'0','0','0','0',NULL,NULL,NULL),(145,'0',143,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'ID','ws.ID','',1,'0','0','0','0',NULL,NULL,NULL),(154,'0',148,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'ID','ak.ID',NULL,0,'0','0','0','0',NULL,NULL,NULL),(155,'0',148,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'Description','ak.UID',NULL,20,'0','0','0','0',NULL,NULL,NULL),(156,'0',148,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'SysCode','ak.SysCode',NULL,10,'0','0','0','0',NULL,NULL,NULL),(157,'0',148,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Del','ak.Del',NULL,1,'0','0','0','0',NULL,NULL,NULL),(1524,'0',1504,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Del',NULL,NULL,999,'0','0','0','0',NULL,NULL,NULL),(1520,'0',1504,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'ID',NULL,NULL,0,'0','1','1','1',NULL,NULL,NULL),(161,'0',148,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'Notes','ak.Note',NULL,30,'0','0','0','0',NULL,NULL,NULL),(1608,'0',130,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Primitive',NULL,NULL,50,'0','0','0','0',NULL,NULL,NULL),(1610,'0',130,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Abstract',NULL,NULL,55,'0','0','0','0',NULL,NULL,NULL),(166,'0',143,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Del','ws.Del',NULL,999,'0','0','0','0',NULL,NULL,NULL),(1606,'0',130,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'Notes',NULL,NULL,33,'0','0','0','0',NULL,NULL,NULL),(1604,'0',130,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'Description',NULL,NULL,30,'0','0','0','0',NULL,NULL,NULL),(1602,'0',130,NULL,NULL,130,151,NULL,NULL,NULL,NULL,'BaseConcept',NULL,NULL,20,'0','0','0','0',NULL,NULL,NULL),(171,'0',143,NULL,NULL,30,151,NULL,NULL,NULL,NULL,'ForType','ws.ForType',NULL,999,'0','0','0','0',NULL,NULL,NULL),(172,'0',143,NULL,NULL,30,151,NULL,NULL,NULL,NULL,'Win','ws.Win','Window for which stored settings',999,'0','0','0','0',NULL,NULL,NULL),(174,'0',143,NULL,NULL,28,151,NULL,NULL,NULL,NULL,'Context','ws.Context','Additional Context for this parameters ',999,'0','0','0','0',NULL,NULL,NULL),(176,'0',143,NULL,NULL,30,151,NULL,NULL,NULL,NULL,'ForUser','ws.ForUser',NULL,999,'0','0','0','0',NULL,NULL,NULL),(178,'0',143,NULL,NULL,30,151,NULL,NULL,NULL,NULL,'Position','ws.Position',NULL,999,'0','0','0','0',NULL,NULL,NULL),(182,'0',180,116,NULL,20,150,NULL,NULL,NULL,NULL,'ID','cv.ID',NULL,0,'0','0','0','0',NULL,NULL,NULL),(183,'0',180,116,NULL,30,150,NULL,NULL,NULL,NULL,'UID','cv.UID',NULL,0,'0','0','0','0',NULL,NULL,NULL),(184,'0',180,116,NULL,30,150,NULL,NULL,NULL,NULL,'SysCode','cv.SysCode',NULL,0,'0','0','0','0',NULL,NULL,NULL),(185,'0',180,116,NULL,53,150,NULL,NULL,NULL,NULL,'Del','cv.Del',NULL,0,'0','0','0','0',NULL,NULL,NULL),(401,'0',62,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'ForConcept','r.ForConcept',NULL,10,'0','0','0','0',NULL,NULL,NULL),(406,'0',180,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'ForConcept','cv.ForConcept',NULL,0,'0','0','0','0',NULL,NULL,NULL),(408,'0',62,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'ForRelation',NULL,NULL,310,NULL,'0','0','0',NULL,NULL,NULL),(415,'0',411,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'ID','cvf.ID',NULL,0,'0','0','0','0',NULL,NULL,NULL),(417,'0',411,NULL,NULL,180,151,NULL,NULL,NULL,NULL,'ForPrgView','cvf.ForConceptView',NULL,0,'0','0','0','0',NULL,NULL,NULL),(421,'0',411,NULL,NULL,1624,151,NULL,NULL,NULL,NULL,'ForRelation','cvf.ForRelation',NULL,2,'0','0','0','0',NULL,NULL,NULL),(423,'0',411,NULL,NULL,18,150,NULL,NULL,NULL,NULL,'Odr','cvf.Seqn','Sequence in Class',0,'0','0','0','0',NULL,NULL,NULL),(425,'0',411,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'UIPath','cvf.UIPath',NULL,3,'0','0','0','0',NULL,NULL,NULL),(427,'0',411,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Mandatory','cvf.Mandatory',NULL,3,'0','0','0','0',NULL,NULL,NULL),(431,'0',411,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Hidden','cvf.Hidden',NULL,3,'0','0','0','0',NULL,NULL,NULL),(433,'0',411,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'InList','cvf.InList',NULL,3,'0','0','0','0',NULL,NULL,NULL),(436,'0',180,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'Notes','cv.Notes',NULL,0,'0','0','0','0',NULL,NULL,NULL),(455,'0',411,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'SysCode','cvf.SysCode',NULL,2,'0','0','0','0',NULL,NULL,NULL),(475,'0',62,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Const','rv.Const','Attribute once initialized cannot be changed in the future',185,'0','0','0','0',NULL,NULL,NULL),(477,'0',62,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'Domain','rv.Domain','Map of possible Values',120,'0','0','0','0',NULL,NULL,NULL),(479,'0',62,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'RelationStructRole','rv.RelationStructRole',NULL,460,'0','0','0','0',NULL,NULL,NULL),(481,'0',62,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'VersPart',NULL,NULL,215,NULL,'0','0','0',NULL,NULL,NULL),(485,'0',62,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'MainPartID','rv.MainPartID','What attribute MainID points to',220,'0','0','0','0',NULL,NULL,NULL),(487,'0',62,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'Root','rv.Root','Root for Hierarchy',230,'0','0','0','0',NULL,NULL,NULL),(489,'0',411,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'ControlType','cvf.ControlType',NULL,20,'0','0','0','0',NULL,NULL,NULL),(491,'0',411,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'ShowTitle','cvf.ShowTitle',NULL,30,'0','0','0','0',NULL,NULL,NULL),(493,'0',411,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Editable','cvf.Editable',NULL,999,'0','0','0','0',NULL,NULL,NULL),(495,'0',411,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'DataSourceView','cvf.DataSourceView',NULL,999,'0','0','0','0',NULL,NULL,NULL),(497,'0',411,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'ValueField','cvf.ValueField',NULL,999,'0','0','0','0',NULL,NULL,NULL),(499,'0',411,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'DisplayField','cvf.DisplayField',NULL,999,'0','0','0','0',NULL,NULL,NULL),(501,'0',411,NULL,NULL,18,150,NULL,NULL,NULL,NULL,'PickListWidth','cvf.PickListWidth',NULL,999,'0','0','0','0',NULL,NULL,NULL),(503,'0',411,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'ViewOnly','cvf.ViewOnly',NULL,999,'0','0','0','0',NULL,NULL,NULL),(802,'0',453,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'ID','ls.ID',NULL,0,'0','0','0','0',NULL,NULL,NULL),(1612,'0',130,NULL,NULL,130,151,NULL,NULL,NULL,NULL,'Author',NULL,NULL,70,'0','0','0','0',NULL,NULL,NULL),(806,'0',453,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Del','ls.Del',NULL,999,'0','0','0','0',NULL,NULL,NULL),(1634,'0',1624,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'ID',NULL,NULL,0,'0',NULL,NULL,'0',NULL,NULL,NULL),(810,'0',453,NULL,NULL,30,151,NULL,NULL,NULL,NULL,'ForType','ls.ForType',NULL,999,'0','0','0','0',NULL,NULL,NULL),(812,'0',453,NULL,NULL,30,151,NULL,NULL,NULL,NULL,'Win','ls.Win','Window for which stored settings',999,'0','0','0','0',NULL,NULL,NULL),(814,'0',453,NULL,NULL,28,151,NULL,NULL,NULL,NULL,'Context','ls.Context','Additional Context for this parameters ',999,'0','0','0','0',NULL,NULL,NULL),(816,'0',453,NULL,NULL,30,151,NULL,NULL,NULL,NULL,'ForUser','ls.ForUser',NULL,999,'0','0','0','0',NULL,NULL,NULL),(818,'0',453,NULL,NULL,30,151,NULL,NULL,NULL,NULL,'Settings','ls.Settings',NULL,999,'0','0','0','0',NULL,NULL,NULL),(978,'0',971,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'ID','r.ID',NULL,0,'0','0','0','0',NULL,NULL,NULL),(980,'0',971,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'SysCode','r.SysCode',NULL,10,'0','0','0','0',NULL,NULL,NULL),(996,'0',971,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'Name','r.Name',NULL,20,'0','0','0','0',NULL,NULL,NULL),(1201,'0',130,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'ID','ID','ID',0,'0','0','0','0',NULL,NULL,NULL),(1200,'0',130,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'SyCode','SysCode','Concept Code',10,'0','0','0','0',NULL,NULL,NULL),(1526,'0',1504,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'UID',NULL,NULL,999,'0','0','0','0',NULL,NULL,NULL),(1528,'0',1504,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'SysCode',NULL,NULL,999,'0','0','0','0',NULL,NULL,NULL),(1530,'0',1504,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'Description',NULL,NULL,999,'0','0','0','0',NULL,NULL,NULL),(1532,'0',1504,NULL,NULL,30,151,NULL,NULL,NULL,NULL,'Owner',NULL,NULL,999,'0','0','0','0',NULL,NULL,NULL),(1534,'0',1504,NULL,NULL,38,150,NULL,NULL,NULL,NULL,'DateMark',NULL,NULL,999,'0','0','0','0',NULL,NULL,NULL),(1536,'0',1504,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Actual',NULL,NULL,999,'0','0','0','0',NULL,NULL,NULL),(1538,'0',1504,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprFilter',NULL,NULL,999,'0','0','0','0',NULL,NULL,NULL),(1643,'0',1624,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Del',NULL,NULL,1,'0','1','1','0',NULL,NULL,NULL),(1645,'0',1624,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'SysCode',NULL,NULL,10,'0','1','1','0',NULL,NULL,NULL),(1658,'0',1624,NULL,NULL,130,151,NULL,NULL,NULL,NULL,'ForConcept',NULL,NULL,30,'0','1','1','1',NULL,NULL,NULL),(1663,'0',1624,NULL,NULL,130,151,NULL,NULL,NULL,NULL,'InheritedFrom',NULL,NULL,30,'0','1','1','1',NULL,NULL,NULL),(1665,'0',1624,NULL,NULL,130,151,NULL,NULL,NULL,NULL,'RelationRole',NULL,NULL,40,'0','1','1','1',NULL,NULL,NULL),(1667,'0',1624,NULL,NULL,130,151,NULL,NULL,NULL,NULL,'RelatedConcept',NULL,NULL,50,'0','1','1','1',NULL,NULL,NULL),(1669,'0',1624,NULL,NULL,148,151,NULL,NULL,NULL,NULL,'RelationKind',NULL,NULL,55,'0','1','1','1',NULL,NULL,NULL),(1671,'0',1624,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'Domain',NULL,NULL,55,'0','0','0','0',NULL,NULL,NULL),(1673,'0',1624,NULL,NULL,1624,151,NULL,NULL,NULL,NULL,'BackLinkRelation',NULL,NULL,60,'0','1','1','1',NULL,NULL,NULL),(1675,'0',1624,NULL,NULL,130,151,NULL,NULL,NULL,NULL,'CrossConcept',NULL,NULL,70,'0','1','1','1',NULL,NULL,NULL),(1677,'0',1624,NULL,NULL,1624,151,NULL,NULL,NULL,NULL,'CrossRelation',NULL,NULL,73,'0','1','1','1',NULL,NULL,NULL),(1679,'0',1624,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'Description',NULL,NULL,10,'0','1','1','0',NULL,NULL,NULL),(1681,'0',1624,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'Notes',NULL,NULL,16,'0','1','1','0',NULL,NULL,NULL),(1683,'0',1624,NULL,NULL,18,150,NULL,NULL,NULL,NULL,'Odr',NULL,NULL,80,'0','1','1','0',NULL,NULL,NULL),(1685,'0',1624,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Const',NULL,NULL,83,'0','0','0','0',NULL,NULL,NULL),(1687,'0',1624,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Countable',NULL,NULL,86,'0','0','0','0',NULL,NULL,NULL),(1689,'0',1624,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Historical',NULL,NULL,90,'0','0','0','0',NULL,NULL,NULL),(1691,'0',1624,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Versioned',NULL,NULL,93,'0','0','0','0',NULL,NULL,NULL),(1693,'0',1624,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'VersPart',NULL,NULL,93,'0','0','0','0',NULL,NULL,NULL),(1695,'0',1624,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'MainPartID',NULL,NULL,98,'0','0','0','0',NULL,NULL,NULL),(1697,'0',1624,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'Root',NULL,NULL,110,'0','0','0','0',NULL,NULL,NULL),(1738,'0',130,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Del',NULL,NULL,1,'0','0','0','0',NULL,NULL,NULL),(1740,'0',130,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'UID',NULL,NULL,5,'0','0','0','0',NULL,NULL,NULL),(1772,'0',1767,116,NULL,20,150,NULL,NULL,NULL,NULL,'ID',NULL,NULL,0,'0','0','0','0',NULL,NULL,NULL),(1774,'0',1767,116,NULL,53,150,NULL,NULL,NULL,NULL,'Del',NULL,NULL,1,'0','0','0','0',NULL,NULL,NULL),(1784,'0',411,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Del',NULL,NULL,0,'0','0','0','0',NULL,NULL,NULL),(1801,'0',1767,116,NULL,30,150,NULL,NULL,NULL,NULL,'UID',NULL,NULL,3,'0','0','0','0',NULL,NULL,NULL),(1811,'0',1767,NULL,NULL,130,151,NULL,NULL,NULL,NULL,'ForConcept',NULL,NULL,10,'0','0','0','0',NULL,NULL,NULL),(1814,'0',1767,NULL,NULL,1504,151,NULL,NULL,NULL,NULL,'PrgVersion',NULL,NULL,10,'0','0','0','0',NULL,NULL,NULL),(1816,'0',1767,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'Description',NULL,NULL,10,'0','0','0','0',NULL,NULL,NULL),(1818,'0',1767,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'Notes',NULL,NULL,33,'0','0','0','0',NULL,NULL,NULL),(1820,'0',1767,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'ExprToString',NULL,NULL,40,'0','0','0','0',NULL,NULL,NULL),(1823,'0',1767,NULL,NULL,1828,151,NULL,NULL,NULL,NULL,'DataBaseStore',NULL,NULL,45,'0','0','0','0',NULL,NULL,NULL),(1836,'0',1767,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprFrom',NULL,NULL,50,'0','0','0','0',NULL,NULL,NULL),(1838,'0',1767,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprWhere',NULL,NULL,52,'0','0','0','0',NULL,NULL,NULL),(1840,'0',1767,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprGroup',NULL,NULL,56,'0','0','0','0',NULL,NULL,NULL),(1842,'0',1767,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprHaving',NULL,NULL,58,'0','0','0','0',NULL,NULL,NULL),(1844,'0',1767,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprOrder',NULL,NULL,54,'0','0','0','0',NULL,NULL,NULL),(1847,'0',1767,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'PrgPackage',NULL,NULL,70,'0','0','0','0',NULL,NULL,NULL),(1849,'0',1767,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'PrgType',NULL,NULL,72,'0','0','0','0',NULL,NULL,NULL),(2065,'0',1828,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'ID',NULL,NULL,0,'0',NULL,NULL,NULL,NULL,NULL,NULL),(2066,'0',1828,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'Del',NULL,NULL,1,'0','1','1','1',NULL,NULL,NULL),(2069,'0',1828,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'UID',NULL,NULL,3,'0','1','1','1',NULL,NULL,NULL),(2071,'0',1828,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'SysCode',NULL,NULL,10,'0','1','1','1',NULL,NULL,NULL),(2073,'0',1828,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'Description',NULL,NULL,20,'0','1','1','1',NULL,NULL,NULL),(2075,'0',1828,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'DriverType',NULL,NULL,30,'0','1','1','1',NULL,NULL,NULL),(2077,'0',1828,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'ConnectionParams',NULL,NULL,40,'0','1','1','1',NULL,NULL,NULL),(2342,'0',109,NULL,NULL,18,150,NULL,NULL,NULL,NULL,'Odr','Order','Order of menu items',15,'1','0','0','0',NULL,NULL,NULL),(2204,'0',62,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'Description',NULL,NULL,40,'0','0','0','0',NULL,NULL,NULL),(2206,'0',62,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'Notes',NULL,NULL,45,'0','0','0','0',NULL,NULL,NULL),(2213,'0',62,NULL,NULL,130,151,NULL,NULL,NULL,NULL,'RelationRole',NULL,NULL,20,'0','0','0','0',NULL,NULL,NULL),(2347,'0',109,NULL,NULL,108,151,NULL,NULL,NULL,NULL,'ForMenu','ForMenu',NULL,5,'0','0','0','0',NULL,NULL,NULL),(2350,'0',109,NULL,NULL,130,151,NULL,NULL,NULL,NULL,'CalledConcept','Called concept',NULL,60,'0','0','0','0',NULL,NULL,NULL),(2352,'0',109,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'CalledMethod','Called Method',NULL,70,'0','0','0','0',NULL,NULL,NULL),(2354,'0',109,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'Args','Args',NULL,80,'0','0','0','0',NULL,NULL,NULL),(2547,'0',2541,1194,NULL,20,150,NULL,NULL,NULL,NULL,'ID','ID of Right',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2551,'0',2541,NULL,NULL,1194,151,NULL,NULL,NULL,NULL,'ForType','On what Right ',NULL,10,'0','0','0','0',NULL,NULL,NULL),(2560,'0',2541,NULL,NULL,132,151,NULL,NULL,NULL,NULL,'ActionType','What ToDo Right',NULL,20,'0','0','0','0',NULL,NULL,NULL),(2562,'0',2541,NULL,NULL,1228,151,NULL,NULL,NULL,NULL,'ForUser','For Whom','For Whom is this Right granted',30,'0','0','0','0',NULL,NULL,NULL),(2564,'0',2541,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'Creteria','Additional Creteria',NULL,50,'0','0','0','0',NULL,NULL,NULL),(2782,'0',1194,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'ID',NULL,NULL,0,'0','0','0','0',NULL,NULL,NULL),(2788,'0',1194,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'Description',NULL,NULL,10,'0','0','1','1',NULL,NULL,NULL),(2792,'0',1194,NULL,NULL,36,150,NULL,NULL,NULL,NULL,'BegDate',NULL,NULL,910,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2913,'0',2901,NULL,NULL,30,151,NULL,NULL,NULL,NULL,'Owner',NULL,NULL,999,'0','0','0','0',NULL,NULL,NULL),(2903,'0',2901,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'ID',NULL,NULL,0,'0','1','1','1',NULL,NULL,NULL),(2905,'0',2901,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Del',NULL,NULL,999,'0','0','0','0',NULL,NULL,NULL),(2911,'0',2901,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'Description',NULL,NULL,999,'0','0','0','0',NULL,NULL,NULL),(2909,'0',2901,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'SysCode',NULL,NULL,999,'0','0','0','0',NULL,NULL,NULL),(2919,'0',2901,NULL,NULL,32,150,NULL,NULL,NULL,NULL,'ExprFilter',NULL,NULL,999,'0','0','0','0',NULL,NULL,NULL),(2907,'0',2901,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'UID',NULL,NULL,999,'0','0','0','0',NULL,NULL,NULL),(2917,'0',2901,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Actual',NULL,NULL,999,'0','0','0','0',NULL,NULL,NULL),(2915,'0',2901,NULL,NULL,38,150,NULL,NULL,NULL,NULL,'DateMark',NULL,NULL,999,'0','0','0','0',NULL,NULL,NULL),(3068,'0',1828,NULL,NULL,34,150,NULL,NULL,NULL,NULL,'Test','Test!!!!!!!!!!!!!!!!!!!!!!!!!!!!!','aeardc???????????????????',12,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3089,'0',108,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'ID',NULL,NULL,0,'0','0','0','0',NULL,NULL,NULL),(3096,'0',108,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Del',NULL,NULL,1,'0','0','0','0',NULL,NULL,NULL),(3098,'0',108,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'UID',NULL,NULL,2,'0','0','0','0',NULL,NULL,NULL),(3100,'0',108,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'SysCode','Sys Code',NULL,2,'0','0','0','0',NULL,NULL,NULL),(3102,'0',108,NULL,NULL,28,150,'Description',NULL,NULL,NULL,'Description','Sys Code',NULL,20,'0','0','0','0',NULL,NULL,NULL),(3224,'0',3220,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Del','ls.Del',NULL,999,'0','0','0','0',NULL,NULL,NULL),(3226,'0',3220,NULL,NULL,30,151,NULL,NULL,NULL,NULL,'ForType','ls.ForType',NULL,999,'0','0','0','0',NULL,NULL,NULL),(3222,'0',3220,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'ID','ls.ID',NULL,0,'0','0','0','0',NULL,NULL,NULL),(3230,'0',3220,NULL,NULL,28,151,NULL,NULL,NULL,NULL,'Context','ls.Context','Additional Context for this parameters ',999,'0','0','0','0',NULL,NULL,NULL),(3228,'0',3220,NULL,NULL,30,151,NULL,NULL,NULL,NULL,'Win','ls.Win','Window for which stored settings',999,'0','0','0','0',NULL,NULL,NULL),(3234,'0',3220,NULL,NULL,30,151,NULL,NULL,NULL,NULL,'Settings','ls.Settings',NULL,999,'0','0','0','0',NULL,NULL,NULL),(3232,'0',3220,NULL,NULL,30,151,NULL,NULL,NULL,NULL,'ForUser','ls.ForUser',NULL,999,'0','0','0','0',NULL,NULL,NULL),(3246,'0',3244,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'ID','ID',NULL,1,'0','0','0','0',NULL,NULL,NULL),(3248,'0',3244,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'UID','UID',NULL,20,'0','0','0','0',NULL,NULL,NULL),(3250,'0',3244,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'SysCode','SysCode',NULL,30,'0','0','0','0',NULL,NULL,NULL),(3256,'0',3244,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'AnyType','AnyTypeID',NULL,60,'0','0','0','0',NULL,NULL,NULL),(3252,'0',3244,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Del','Del','Deleted flag',40,'0','0','0','0',NULL,NULL,NULL),(3258,'0',3244,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'PrgClass','PrgClassID',NULL,80,'0','0','0','0',NULL,NULL,NULL),(3254,'0',3244,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'Installation','InstallationID',NULL,50,'0','0','0','0',NULL,NULL,NULL),(3264,'0',3262,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'ID','ID',NULL,1,'0','0','0','0',NULL,NULL,NULL),(3266,'0',3262,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'UID','UID',NULL,20,'0','0','0','0',NULL,NULL,NULL),(3948,'0',3262,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'SysCode','SysCode',NULL,30,'0','0','0','0',NULL,NULL,NULL),(3952,'0',3262,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'Installation','InstallationID',NULL,50,'0','0','0','0',NULL,NULL,NULL),(3950,'0',3262,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Del','Del','Deleted flag',40,'0','0','0','0',NULL,NULL,NULL),(3956,'0',3262,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'PrgClass','PrgClassID',NULL,80,'0','0','0','0',NULL,NULL,NULL),(3954,'0',3262,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'AnyType','AnyTypeID',NULL,60,'0','0','0','0',NULL,NULL,NULL),(3962,'0',3960,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'ID','ID',NULL,1,'0','0','0','0',NULL,NULL,NULL),(3964,'0',3960,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'UID','UID',NULL,20,'0','0','0','0',NULL,NULL,NULL),(3966,'0',3960,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'SysCode','SysCode',NULL,30,'0','0','0','0',NULL,NULL,NULL),(3968,'0',3960,NULL,NULL,53,150,NULL,NULL,NULL,NULL,'Del','Del','Deleted flag',40,'0','0','0','0',NULL,NULL,NULL),(3970,'0',3960,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'Installation','InstallationID',NULL,50,'0','0','0','0',NULL,NULL,NULL),(3972,'0',3960,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'AnyType','AnyTypeID',NULL,60,'0','0','0','0',NULL,NULL,NULL),(3974,'0',3960,NULL,NULL,20,151,NULL,NULL,NULL,NULL,'PrgClass','PrgClassID',NULL,80,'0','0','0','0',NULL,NULL,NULL),(4240,'0',1194,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'UID','Global Unique ID','Used only for data-synchronization purposes in the moments of data import',2,'0','0','0','0',NULL,NULL,NULL),(4245,'0',1194,116,NULL,53,150,NULL,NULL,NULL,NULL,'Del','cv.Del',NULL,5,'0','0','0','0',NULL,NULL,NULL),(4314,'0',4312,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'ID',NULL,NULL,0,'0','0','0','0',NULL,NULL,NULL),(4316,'0',4312,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'UID','Global Unique ID','Used only for data-synchronization purposes in the moments of data import',2,'0','0','0','0',NULL,NULL,NULL),(4318,'0',4312,116,NULL,53,150,NULL,NULL,NULL,NULL,'Del','cv.Del',NULL,5,'0','0','0','0',NULL,NULL,NULL),(4320,'0',4312,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'Description',NULL,NULL,10,'0','0','1','1',NULL,NULL,NULL),(4322,'0',4312,NULL,NULL,36,150,NULL,NULL,NULL,NULL,'BegDate',NULL,NULL,910,'1','1','1','1',NULL,NULL,NULL),(4332,'0',4330,NULL,NULL,20,150,NULL,NULL,NULL,NULL,'ID',NULL,NULL,0,'0','0','0','0',NULL,NULL,NULL),(4334,'0',4330,NULL,NULL,30,150,NULL,NULL,NULL,NULL,'UID','Global Unique ID','Used only for data-synchronization purposes in the moments of data import',2,'0','0','0','0',NULL,NULL,NULL),(4336,'0',4330,116,NULL,53,150,NULL,NULL,NULL,NULL,'Del','cv.Del',NULL,5,'0','0','0','0',NULL,NULL,NULL),(4338,'0',4330,NULL,NULL,28,150,NULL,NULL,NULL,NULL,'Description',NULL,NULL,10,'0','0','1','1',NULL,NULL,NULL),(4340,'0',4330,NULL,NULL,36,150,NULL,NULL,NULL,NULL,'BegDate',NULL,NULL,910,'1','1','1','1',NULL,NULL,NULL);
/*!40000 ALTER TABLE `relation` ENABLE KEYS */;
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
  `UID` char(36) DEFAULT NULL,
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
INSERT INTO `prgversion` (`ID`, `Del`, `UID`, `SysCode`, `Description`, `Owner`, `DateMark`, `Actual`, `ExprFilter`) VALUES (333,'0',NULL,'CBM default','Initial Default Version',NULL,'2012-09-01 00:00:00','1',NULL);
/*!40000 ALTER TABLE `prgversion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prgcomponent`
--

DROP TABLE IF EXISTS `prgcomponent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prgcomponent` (
  `ID` bigint(20) NOT NULL,
  `UID` char(36) DEFAULT NULL,
  `SysCode` varchar(200) DEFAULT NULL,
  `Del` char(1) DEFAULT '0',
  `InstallationID` bigint(20) DEFAULT NULL,
  `AnyTypeID` bigint(20) DEFAULT NULL,
  `PrgClassID` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prgcomponent`
--

LOCK TABLES `prgcomponent` WRITE;
/*!40000 ALTER TABLE `prgcomponent` DISABLE KEYS */;
INSERT INTO `prgcomponent` (`ID`, `UID`, `SysCode`, `Del`, `InstallationID`, `AnyTypeID`, `PrgClassID`) VALUES (14,NULL,'PrgClass','0',17,10,14),(17,NULL,'CBM','0',17,16,116),(18,NULL,'Integer','0',17,10,14),(20,NULL,'Bigint','0',17,10,14),(22,NULL,'Decimal','0',17,10,14),(24,NULL,'BigDecimal','0',17,10,14),(26,NULL,'Money','0',17,10,14),(28,NULL,'String','0',17,10,14),(30,NULL,'ShortString','0',17,10,14),(32,NULL,'LongString','0',17,10,14),(34,NULL,'Text','0',17,10,14),(36,NULL,'Date','0',17,10,14),(38,NULL,'DateTime','0',17,10,14),(40,NULL,'TimePrecize','0',17,10,14),(42,NULL,'ID','0',17,11,62),(43,NULL,'UID','0',17,11,62),(44,NULL,'SysCode','0',17,11,62),(45,NULL,'Del','0',17,11,62),(46,NULL,'Installation','0',17,11,62),(47,NULL,'AnyType','0',17,11,62),(48,NULL,'Superclass','0',17,11,62),(49,NULL,'Prg','0',17,11,62),(50,NULL,'Primitive','0',17,11,62),(51,NULL,'Abstract','0',17,11,62),(52,NULL,'Category','0',17,11,62),(53,NULL,'Boolean','0',17,10,14),(55,NULL,'PrgClassVersion','0',17,11,62),(56,NULL,'Actual','0',17,11,62),(57,NULL,'Dated','0',17,11,62),(58,NULL,'Name','0',17,11,62),(59,NULL,'Note','0',17,11,62),(60,NULL,'PrgPackage','0',17,11,62),(61,NULL,'PrgType','0',17,11,62),(62,NULL,'PrgAttribute','0',17,10,14),(64,NULL,'ExprToString','0',17,11,62),(65,NULL,'ExprFrom','0',17,11,62),(66,NULL,'ExprWhere','0',17,11,62),(67,NULL,'ExprGroup','0',17,11,62),(68,NULL,'ExprHaving','0',17,11,62),(69,NULL,'ExprOrder','0',17,11,62),(70,NULL,'ID','0',17,11,62),(71,NULL,'UID','0',17,11,62),(72,NULL,'SysCode','0',17,11,62),(73,NULL,'Del','0',17,11,62),(77,NULL,'Name','0',17,11,62),(78,NULL,'Note','0',17,11,62),(79,NULL,'AttributeKind','0',17,11,62),(80,NULL,'PointedClass','0',17,11,62),(81,NULL,'CounterAttribute','0',17,11,62),(82,NULL,'CrossClass','0',17,11,62),(83,NULL,'CrossAttribute','0',17,11,62),(84,NULL,'IsPublic','0',17,11,62),(85,NULL,'ExprEval','0',17,11,62),(86,NULL,'ExprDefault','0',17,11,62),(87,NULL,'ExprValidate','0',17,11,62),(88,NULL,'LinkFilter','0',17,11,62),(89,NULL,'CopyValue','0',17,11,62),(90,NULL,'CopyLinked','0',17,11,62),(91,NULL,'DeleteLinked','0',17,11,62),(92,NULL,'Countable','0',17,11,62),(93,NULL,'InheritedFrom','0',17,11,62),(94,NULL,'Modified','0',17,11,62),(95,NULL,'Historical','0',17,11,62),(96,NULL,'Versioned','0',17,11,62),(97,NULL,'DBTable','0',17,11,62),(98,NULL,'DBColumn','0',17,11,62),(99,NULL,'Seqn','0',17,11,62),(101,NULL,'UIMandatory','0',17,11,62),(470,'12F413D3-B22D-438C-93FB-40C1A7AA','Attributes','0',17,11,62),(103,NULL,'MainMenu','0',17,12,108),(108,NULL,'PrgMenu','0',17,10,14),(109,NULL,'PrgMenuItem','0',17,10,14),(112,NULL,'ID','0',17,11,62),(113,NULL,'SysCode','0',17,11,62),(114,NULL,'Name','0',17,11,62),(115,NULL,'Parent','0',17,11,62),(116,NULL,'PrgComponent','0',17,10,14),(118,NULL,'ID','0',17,11,62),(119,NULL,'UID','0',17,11,62),(120,NULL,'SysCode','0',17,11,62),(121,NULL,'Del','0',17,11,62),(122,NULL,'Installation','0',17,11,62),(123,NULL,'AnyType','0',17,11,62),(126,NULL,'MainID','0',17,11,62),(125,NULL,'PrgClass_VersID','0',17,11,62),(124,NULL,'PrgClassID','0',17,11,62),(127,NULL,'AnyType','0',17,10,14),(130,NULL,'Concept','0',17,10,14),(132,NULL,'ChangeType','0',17,10,14),(134,NULL,'Object','0',17,10,14),(136,NULL,'ForClassVers','0',17,11,62),(137,NULL,'PrgClass','0',17,11,62),(138,NULL,'PrgClass','0',17,11,62),(139,NULL,'UIForms','0',17,11,62),(140,NULL,'PrgAttr_VersID','0',17,11,62),(143,'4F5EF862-BBC9-4C07-9586-C84233E2','WindowSettings','0',17,10,14),(145,NULL,'ID','0',17,11,62),(148,'44F785B6-283C-4C12-B403-CFE6FDB3','AttributeKind','0',17,10,14),(154,'047C181A-0D5D-4EE1-91F8-2CFE1016','ID','0',17,11,62),(155,NULL,'UID','0',17,11,62),(156,NULL,'SysCode','0',17,11,62),(157,NULL,'DEL','0',17,11,62),(158,NULL,'Installation','0',17,11,62),(159,NULL,'AnyType','0',17,11,62),(160,NULL,'PrgClass','0',17,11,62),(161,NULL,'Note','0',17,11,62),(162,'374A053F-99CA-4C8D-A5F3-349A6C29','UID','0',17,11,62),(164,'D0E00B07-7AD9-4991-9F05-7A932922','SysCode','0',17,11,62),(166,'B9F0BE19-BF2B-4992-BB81-12AF4430','Del','0',17,11,62),(167,'55997473-A655-468B-A82C-C51C7FB8','Installation','0',17,11,62),(168,'596811A4-02C0-4193-9DF2-49B5FABD','AnyType','0',17,11,62),(169,'2C743062-0FA0-4086-B120-8AA43523','PrgClass','0',17,11,62),(171,'5778B8BB-C49B-4530-9BE1-C762C102','ForType','0',17,11,62),(172,'BE920744-3352-4597-B639-0785A975','Win','0',17,11,62),(174,'FBDC01CB-4AAC-4DA0-AABD-7B81F0F6','Context','0',17,11,62),(176,'A2816C11-8A06-4E2B-B256-CC1D657E','ForUser','0',17,11,62),(178,'3993FE6E-0CF7-4456-8246-65934A3F','Position','0',17,11,62),(180,'4CD8A809-D9F0-4F80-B0BC-13381E0B','PrgView','0',17,10,14),(182,'F81EC328-D757-45A8-A215-B67697EF','ID','0',17,11,62),(183,'2BC770E6-B6A1-4FF4-9A90-01D58F20','UID','0',17,11,62),(184,'947E6AEE-3779-4CB4-81DE-73E3A9BC','SysCode','0',17,11,62),(185,'1714D960-6DA4-4FE9-A9F9-EBC71AF1','Del','0',17,11,62),(186,'795042F0-B0E1-4F47-93A9-9B62834D','InstallationID','0',17,11,62),(187,'DC3145F1-FB16-4CFA-A84B-169BA14E','AnyTypeID','0',17,11,62),(188,'F2040303-EAC1-4AE8-BA46-ABB58FBF','PrgClassID','0',17,11,62),(291,NULL,'PrgComponent','0',17,1,180),(292,NULL,'PrgClass','0',17,1,180),(293,NULL,'PrgAttribute','0',17,1,180),(294,NULL,'AttributeKind','0',17,10,180),(295,NULL,'PrgMenuItem','0',17,1,180),(296,NULL,'PrgView','0',17,1,180),(400,NULL,'PrgAttrID','0',17,11,62),(401,NULL,'ForClass','0',17,11,62),(404,NULL,'PrgViewID','0',17,11,62),(406,NULL,'ForClass','0',17,11,62),(408,NULL,'MainID','0',17,11,62),(411,'BCAAC4EF-A898-491C-B949-950E2271','PrgViewField','0',17,10,14),(413,'5E6EECC0-301A-4191-BDE8-F22CB5AB','ID','0',17,11,62),(415,'97FAFA7E-7B4B-49EE-A2A0-E5A911C3','ID','0',17,11,62),(417,'7E023E8F-848E-4995-9202-3CC86F65','PrgView','0',17,11,62),(419,'202B6A83-900C-4362-8D52-FCE17AF6','PrgAttr','0',17,11,62),(421,'CD78DFFA-A10F-4B74-BE58-2AC6563A','PrgAttr','0',17,11,62),(423,'01A791B2-D55D-4D77-B0AC-6E72BA04','Seqn','0',17,11,62),(425,'E0F07089-EE84-4BAD-9617-8499E947','UIPath','0',17,11,62),(427,'286249C2-7EA1-4384-93B4-2B1EACFB','Mandatory','0',17,11,62),(455,'C3E31DAD-193C-4DED-8F03-41D2FF66','SysCode','0',17,11,62),(431,'98AD4473-DCFF-4C63-BE69-9C2A5F64','Hidden','0',17,11,62),(433,'D3B3E2EF-CD9B-447B-87ED-473C0755','InList','0',17,11,62),(436,'AA6B3B63-91C2-43AA-96A8-E2AFDB57','Note','0',17,11,62),(489,'72FF144D-EBF9-4BE9-B868-31C02FE0','ControlType','0',17,11,62),(451,'6ABF5F6C-7996-49B3-B7BE-13DC9AFF','PrgViewField','0',17,1,180),(453,'D6E11BB3-4F97-4C15-B897-19174F4D','ListSettings','0',17,10,14),(473,'6971C35E-47C8-4A12-8A4A-0A8AA015','Size','0',17,11,62),(475,'1CA78498-6BE6-46FA-ADFC-E03C03B9','Const','0',17,11,62),(477,'2E10AC40-AB73-4DA1-8942-24D14EEB','Domain','0',17,11,62),(479,'F1FCFF78-57E0-4894-A102-23ACD229','AttrSpecType','0',17,11,62),(481,'8EE985F7-4A4A-45F7-ADB2-7BA69274','Part','0',17,11,62),(485,'9D7073FE-CE20-4FCD-B4DA-B66224B8','MainPartID','0',17,11,62),(487,'C9ACBFD0-FFDB-4645-8F59-AE19D48C','Root','0',17,11,62),(491,'086E4178-9C50-4749-8630-4496C6E4','ShowTitle','0',17,11,62),(493,'AF30FEA3-737C-4025-A5FE-500A7A5A','Editable','0',17,11,62),(495,'ACE3EEDD-10DA-4A26-B60A-A84529DA','DataSourceView','0',17,11,62),(497,'B56DE1AE-03B9-4906-B47F-F0FE16A5','ValueField','0',17,11,62),(499,'B42B5A8D-52D8-448D-8806-B67BAA87','DisplayField','0',17,11,62),(501,'EEF1DA9B-2466-42F8-8B41-5274D5B6','PickListWidth','0',17,11,62),(503,'C5AB1B81-17A7-47B6-9FFB-8E16B0D8','ViewOnly','0',17,11,62),(552,NULL,'WindowSettings','0',17,1,180),(551,'4582FF56-037D-4779-A714-9862D353C77B','ListSettings','0',17,1,180),(587,'9A366218-0C47-4614-A7AA-A15644D072CE','AnyType','0',17,11,62),(593,'5E8CDA97-7CDA-49F5-A146-ECBD88ABF511','AnyObject','0',17,10,180),(601,'121BFB67-8BFE-46E6-93F1-1AD28E561F59','Date','0',17,11,62),(804,'7C7DFF60-1DF3-42DB-A9E5-BA82ED75','UID','0',17,11,62),(802,'2DFA0C4E-6449-4279-AE15-FFE576CB','ID','0',17,11,62),(806,'7F03400C-83CF-40C5-B8E2-B36669F8','Del','0',17,11,62),(808,'8B434C82-6FAD-47F4-8B85-40A7DE7B','InstallationID','0',17,11,62),(810,'7C9E45DD-769B-4B27-ADC9-9248034B','ForType','0',17,11,62),(812,'D313347D-DE5D-4737-9CE1-E0F6FFEF','Win','0',17,11,62),(814,'B93FDF16-3330-4182-BB75-25680779','Context','0',17,11,62),(816,'1024A75A-1EBF-434E-93B5-08D16861','ForUser','0',17,11,62),(818,'336707CB-84F1-43DE-B2C8-720E1A20','Settings','0',17,11,62),(971,'80B792DF-9B18-42D0-8BD0-5FC0C124','Role','0',17,10,14),(978,'0C3D98D5-1E6C-4F59-B0F2-3126129D','ID','0',17,11,62),(980,'08523C67-7C30-4E9D-8198-EC9D5291','SysCode','0',17,11,62),(996,'DE9DD347-855E-4CA8-91C4-B4F36D0A496E','Name','0',17,11,62),(998,'85FCA7D3-ED86-4E63-9973-9B84B13561FF','Role','0',17,1,180),(1194,'4D6E30DA-77F8-4E2A-BC8D-C5E4B7F9A05E','Thing','0',17,10,14),(1201,'C0DBEF11-AB16-414C-979F-27F58B6CC5C2','ID','0',17,0,62),(1200,'E622B87D-F841-4532-9049-0FDA0D59BAF2','SyCode','0',17,0,62),(1228,'1BC18337-74E8-4F5A-BBB6-6850DF2D3A3B','Instance','0',17,NULL,14),(1227,'88B68D70-6D1F-462C-BB21-C33062C261D9','Structure','0',17,NULL,14),(1232,'924BA1D7-9073-476C-B2C7-23CF3013D593','Abstraction','0',NULL,NULL,14),(1233,'91D7BAA2-606C-4350-B3D9-25D3C6E62500','Substance','0',NULL,NULL,14),(1236,'D2D27F73-9A9F-4B6B-8E87-9501A55864F1','Primitive','0',17,NULL,14),(1238,'A6BC54D0-0010-4237-8D74-9679C815A070','Change','0',17,NULL,14),(1234,'7396F164-F351-4D45-8B21-5FB42F7117E5','Event','0',17,NULL,14),(1235,'8C58CFE1-C363-43F5-A739-A0DB5E2408AE','Trtansaction','0',17,NULL,14),(1241,'79DE5A1F-20D7-4689-BC76-6314D47D67C0','Process','0',17,NULL,14);
/*!40000 ALTER TABLE `prgcomponent` ENABLE KEYS */;
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
INSERT INTO `storescheme` (`ID`, `SysCode`, `Description`) VALUES (1355,'RDBMS','Storage in standard Relational DataBase');
/*!40000 ALTER TABLE `storescheme` ENABLE KEYS */;
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
  `UID` char(36) DEFAULT NULL,
  `SysCode` varchar(128) DEFAULT NULL,
  `Description` varchar(400) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prgmenu`
--

LOCK TABLES `prgmenu` WRITE;
/*!40000 ALTER TABLE `prgmenu` DISABLE KEYS */;
INSERT INTO `prgmenu` (`ID`, `Del`, `UID`, `SysCode`, `Description`) VALUES (103,'0',NULL,'Main','Main Menu (Navigator)');
/*!40000 ALTER TABLE `prgmenu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relationkind`
--

DROP TABLE IF EXISTS `relationkind`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `relationkind` (
  `ID` bigint(20) NOT NULL,
  `UID` char(36) DEFAULT NULL,
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
INSERT INTO `relationkind` (`ID`, `UID`, `Del`, `SysCode`, `Description`, `Notes`) VALUES (150,NULL,'0','Value',NULL,'By-value inclusion of some type instance'),(151,NULL,'0','Pointer',NULL,'Many-to-One association'),(152,NULL,'0','BackAggregate','Back-linked aggregated part','One-to-Many association'),(153,NULL,'0','CrossLink',NULL,'Many-to-Many relation'),(2341,NULL,'0','Aggregate','Aggregated entity','Aggregated by link entity, edited and represented in-place with host - main entity'),(2342,NULL,'0','BackLink',NULL,'Aggregated by back-link entity - the most usual case (default meaning) for back-linked things.');
/*!40000 ALTER TABLE `relationkind` ENABLE KEYS */;
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
  `UID` char(36) DEFAULT NULL,
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
INSERT INTO `databasestore` (`ID`, `Del`, `UID`, `Description`, `DriverType`, `ConnectionParams`) VALUES (1469,'0',NULL,'Development','MySQL',NULL);
/*!40000 ALTER TABLE `databasestore` ENABLE KEYS */;
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
-- Table structure for table `listsettings`
--

DROP TABLE IF EXISTS `listsettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `listsettings` (
  `ID` bigint(20) NOT NULL,
  `DEL` char(1) DEFAULT '0',
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
INSERT INTO `listsettings` (`ID`, `DEL`, `ForType`, `Context`, `Settings`, `Win`, `ForUser`) VALUES (850,'0','PrgView','','({selected:\"[{ID:551}]\",field:\"[{name:\\\"SysCode\\\",autoFitWidth:false,width:118},{name:\\\"ForConcept\\\",width:null},{name:\\\"Description\\\",width:null},{name:\\\"Notes\\\",width:null}]\",sort:\"({fieldName:\\\"SysCode\\\",sortDir:\\\"ascending\\\",sortSpecifiers:[{property:\\\"SysCode\\\",direction:\\\"ascending\\\"}]})\",hilite:null,group:\"\"})','TableWindow','TUFW'),(934,'0','PrgComponent','','({selected:\"[]\",field:\"[{name:\\\"SysCode\\\",autoFitWidth:false,width:527}]\",sort:\"({fieldName:null,sortDir:\\\"ascending\\\"})\",hilite:null,group:\"\"})','TableWindow','TUFW'),(1047,'0','RelationKind','','({selected:\"[{ID:152}]\",field:\"[{name:\\\"SysCode\\\",autoFitWidth:false,width:244},{name:\\\"Description\\\",autoFitWidth:false,width:465}]\",sort:\"({fieldName:null,sortDir:\\\"ascending\\\"})\",hilite:null,group:\"\"})','TableWindow','TUFW'),(1502,'0','RelationPrgAttribute','','({selected:\"[]\",field:\"[{name:\\\"SysCode\\\",width:null},{name:\\\"ForConcept\\\",autoFitWidth:false,width:175},{name:\\\"InheritedFrom\\\",width:null},{name:\\\"RelatedConcept\\\",width:null},{name:\\\"Description\\\",width:null},{name:\\\"ForPrgClass\\\",width:null},{name:\\\"DisplayName\\\",width:null},{name:\\\"PrgAttributeNotes\\\",width:null},{name:\\\"DBTable\\\",width:null},{name:\\\"DBColumn\\\",width:null},{name:\\\"Odr\\\",width:null}]\",sort:\"({fieldName:null,sortDir:\\\"ascending\\\"})\",hilite:null,group:\"([{fieldName:\\\"ForConcept\\\",groupingMode:null,groupGranularity:null,groupPrecision:null}])\"})','TableWindow','TUFW'),(1456,'0','ConceptPrgClass','','({\r    selected:\"[{ID:1194}]\", \r    field:\"[{name:\\\"SysCode\\\",autoFitWidth:false,width:247},{name:\\\"Description\\\",autoFitWidth:false,width:290},{name:\\\"BaseConcept\\\",autoFitWidth:false,width:105},{name:\\\"PrgPackage\\\",autoFitWidth:false,width:71},{name:\\\"Notes\\\",autoFitWidth:false,width:466},{name:\\\"VersDescription\\\",visible:false,autoFitWidth:false,width:90},{name:\\\"VersNotes\\\",visible:false,autoFitWidth:false,width:104},{name:\\\"PrgType\\\",autoFitWidth:false,width:124}]\", \r    sort:\"({fieldName:null,sortDir:\\\"ascending\\\"})\", \r    hilite:null, \r    group:\"\", \r    open:\"[\\r    \\\"/4330/1194/1228\\\", \\r    \\\"/4330/1194\\\", \\r    \\\"/4330\\\", \\r    \\\"/\\\"\\r]\"\r})','TableWindow','TUFW'),(1399,'0','Concept','','({\r    selected:\"[{ID:4312}]\", \r    field:\"[{name:\\\"SysCode\\\",autoFitWidth:false,width:244},{name:\\\"BaseConcept\\\",autoFitWidth:false,width:130},{name:\\\"Description\\\",autoFitWidth:false,width:153},{name:\\\"Notes\\\",autoFitWidth:false,width:371}]\", \r    sort:\"({fieldName:\\\"SysCode\\\",sortDir:\\\"ascending\\\",sortSpecifiers:[{property:\\\"SysCode\\\",direction:\\\"ascending\\\"}]})\", \r    hilite:null, \r    group:\"\", \r    open:\"[\\r    \\\"/4330/1194\\\", \\r    \\\"/4330\\\", \\r    \\\"/1238\\\", \\r    \\\"/\\\"\\r]\"\r})','TableWindow','TUFW'),(1882,'0','PrgMenuItem','','({selected:\"[]\",field:\"[{name:\\\"Odr\\\",autoFitWidth:false,width:59},{name:\\\"ParentItem\\\",autoFitWidth:false,width:162},{name:\\\"Description\\\",autoFitWidth:false,width:286},{name:\\\"SysCode\\\",autoFitWidth:false,width:243}]\",sort:\"({fieldName:\\\"Odr\\\",sortDir:\\\"ascending\\\",sortSpecifiers:[{property:\\\"Odr\\\",direction:\\\"ascending\\\"}]})\",hilite:null,group:\"\"})','TableWindow','TUFW'),(1910,'0','PrgVersion','','({selected:\"[{ID:333}]\",field:\"[{name:\\\"SysCode\\\",autoFitWidth:false,width:117},{name:\\\"Description\\\",autoFitWidth:false,width:293},{name:\\\"Owner\\\",autoFitWidth:false,width:203},{name:\\\"DateMark\\\",autoFitWidth:false,width:204},{name:\\\"Actual\\\",autoFitWidth:false,width:50}]\",sort:\"({fieldName:null,sortDir:\\\"ascending\\\"})\",hilite:null,group:\"\"})','TableWindow','TUFW'),(1948,'0','PrgClass','','({\r    selected:\"[{ID:1829}]\", \r    field:\"[{name:\\\"ForConcept\\\",width:null},{name:\\\"Description\\\",width:null},{name:\\\"Notes\\\",width:null},{name:\\\"PrgPackage\\\",width:null},{name:\\\"PrgType\\\",width:null}]\", \r    sort:\"({fieldName:null,sortDir:\\\"ascending\\\"})\", \r    hilite:null, \r    group:\"\", \r    open:\"[\\r    \\\"/\\\"\\r]\"\r})','TableWindow','TUFW'),(2583,'0','ConceptPrgClass','','({\r    selected:\"[{ID:2541}]\", \r    field:\"[{name:\\\"SysCode\\\",autoFitWidth:false,width:194},{name:\\\"BaseConcept\\\",autoFitWidth:false,width:145},{name:\\\"Description\\\",autoFitWidth:false,width:145},{name:\\\"Notes\\\",autoFitWidth:false,width:145},{name:\\\"VersDescription\\\",autoFitWidth:false,width:145},{name:\\\"VersNotes\\\",autoFitWidth:false,width:145},{name:\\\"PrgPackage\\\",autoFitWidth:false,width:145},{name:\\\"PrgType\\\",autoFitWidth:false,width:149}]\", \r    sort:\"({fieldName:null,sortDir:\\\"ascending\\\"})\", \r    hilite:null, \r    group:\"\", \r    open:\"[\\r    \\\"/1194/1228/1227\\\", \\r    \\\"/1194/1228\\\", \\r    \\\"/1194\\\", \\r    \\\"/\\\"\\r]\"\r})','TableWindow','6ade0790-48a9-40df-8750-ec40ce6fb391'),(2881,'0','Relation','','({selected:\"[]\",field:\"[{name:\\\"ForConcept\\\",width:null},{name:\\\"Odr\\\",width:null},{name:\\\"SysCode\\\",width:null},{name:\\\"InheritedFrom\\\",width:null},{name:\\\"RelatedConcept\\\",width:null},{name:\\\"Description\\\",width:null}]\",sort:\"({fieldName:\\\"ForConcept\\\",sortDir:\\\"ascending\\\",sortSpecifiers:[{property:\\\"ForConcept\\\",direction:\\\"ascending\\\"}]})\",hilite:null,group:\"([{fieldName:\\\"ForConcept\\\",groupingMode:null,groupGranularity:null,groupPrecision:null}])\"})','TableWindow','TUFW'),(3988,'0','ListSettings','','({selected:\"[]\",field:\"[{name:\\\"ID\\\",width:null},{name:\\\"ForType\\\",width:null},{name:\\\"Win\\\",width:null},{name:\\\"Context\\\",autoFitWidth:false,width:77},{name:\\\"ForUser\\\",width:null},{name:\\\"Settings\\\",width:null}]\",sort:\"({fieldName:null,sortDir:\\\"ascending\\\"})\",hilite:null,group:\"\"})','TableWindow','TUFW');
/*!40000 ALTER TABLE `listsettings` ENABLE KEYS */;
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
INSERT INTO `windowsettings` (`ID`, `DEL`, `ForType`, `Win`, `Context`, `ForUser`, `Position`) VALUES (1120,'0','PrgView','TableWindow','','TUFW','{\"T\":2, \"L\":2, \"W\":700, \"H\":500}'),(1119,'0','PrgAttribute','TableWindow','','TUFW','{\"T\":23, \"L\":77, \"W\":1000, \"H\":525}'),(789,'0','PrgComponent','FormWindow','','TUFW','{\"T\":75, \"L\":457, \"W\":624, \"H\":158}'),(785,'0','PrgComponent','TableWindow','','TUFW','{\"T\":35, \"L\":234, \"W\":653, \"H\":542}'),(783,'0','PrgAttribute','TableWindow','','TUFW','{\"T\":45, \"L\":125, \"W\":1093, \"H\":482}'),(779,'0','PrgAttribute','FormWindow','','TUFW','{\"T\":62.86363983154297, \"L\":129.66363525390625, \"W\":902, \"H\":446}'),(771,'0','PrgClass','TableWindow','','TUFW','{\"T\":20, \"L\":41, \"W\":1167, \"H\":579}'),(775,'0','PrgClass','FormWindow','','TUFW','{\"T\":49, \"L\":62.50909423828125, \"W\":1070, \"H\":485}'),(777,'0','PrgView','FormWindow','','TUFW','{\"T\":10, \"L\":130, \"W\":970, \"H\":578}'),(776,'0','PrgView','TableWindow','','TUFW','{\"T\":5, \"L\":300, \"W\":779, \"H\":563}'),(947,'0','AttributeKind','TableWindow','','TUFW','{\"T\":26, \"L\":233, \"W\":784, \"H\":475}'),(1371,'0','Concept','TableWindow','','TUFW','{\"T\":5, \"L\":135, \"W\":1016, \"H\":588}'),(1373,'0','Relation','TableWindow','','TUFW','{\"T\":40, \"L\":80, \"W\":909, \"H\":500}'),(1374,'0','Concept','FormWindow','','TUFW','{\"T\":10, \"L\":150, \"W\":1060, \"H\":555}'),(1449,'0','ConceptPrgClass','FormWindow','','TUFW','{\"T\":50, \"L\":110, \"W\":1018, \"H\":461}'),(1444,'0','ConceptPrgClass','TableWindow','','TUFW','{\"T\":27, \"L\":0, \"W\":1225, \"H\":562}'),(1501,'0','RelationPrgAttribute','TableWindow','','TUFW','{\"T\":10, \"L\":155, \"W\":1002, \"H\":571}'),(1557,'0','PrgViewField','FormWindow','','TUFW','{\"T\":27, \"L\":85, \"W\":1025, \"H\":491}'),(1574,'0','RelationPrgAttribute','FormWindow','','TUFW','{\"T\":0, \"L\":122, \"W\":1052, \"H\":619}'),(1987,'0','RelationKind','TableWindow','','TUFW','{\"T\":50, \"L\":245, \"W\":740, \"H\":296}'),(2659,'0','RelationKind','FormWindow','','TUFW','{\"T\":41, \"L\":227, \"W\":674, \"H\":196}'),(2925,'0','PrgVersion','TableWindow','','TUFW','{\"T\":32, \"L\":191, \"W\":764, \"H\":480}'),(3073,'0','Relation','FormWindow','','TUFW','{\"T\":2, \"L\":205, \"W\":793, \"H\":543}'),(3078,'0','PrgVersion','FormWindow','','TUFW','{\"T\":55, \"L\":265, \"W\":612, \"H\":100}'),(3084,'0','PrgMenuItem','TableWindow','','TUFW','{\"T\":10, \"L\":320, \"W\":785, \"H\":545}'),(3118,'0','PrgMenuItem','FormWindow','','TUFW','{\"T\":75, \"L\":224, \"W\":702, \"H\":368}'),(3119,'0','PrgMenu','TableWindow','','TUFW','{\"T\":53, \"L\":190, \"W\":718, \"H\":441}'),(3144,'0','Object','TableWindow','','TUFW','{\"T\":11, \"L\":130, \"W\":700, \"H\":500}'),(3986,'0','ListSettings','TableWindow','','TUFW','{\"T\":0, \"L\":0, \"W\":1098, \"H\":500}'),(4019,'0','DataBaseStore','TableWindow','','TUFW','{\"T\":20, \"L\":145, \"W\":700, \"H\":500}');
/*!40000 ALTER TABLE `windowsettings` ENABLE KEYS */;
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
  `ForConcept` bigint(20) DEFAULT NULL,
  `SysCode` varchar(200) DEFAULT NULL,
  `Description` varchar(400) DEFAULT NULL,
  `Notes` varchar(2000) DEFAULT NULL,
  `UID` char(36) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prgview`
--

LOCK TABLES `prgview` WRITE;
/*!40000 ALTER TABLE `prgview` DISABLE KEYS */;
INSERT INTO `prgview` (`ID`, `Del`, `ForConcept`, `SysCode`, `Description`, `Notes`, `UID`) VALUES (291,'0',116,'PrgComponent',NULL,'Program Components Default View',NULL),(292,'0',14,'ConceptPrgClass',NULL,'Programm Class View',NULL),(293,'0',62,'RelationPrgAttribute',NULL,'Default View of PrgAttribute',NULL),(294,'0',148,'RelationKind',NULL,'RelationKind',NULL),(295,'0',109,'PrgMenuItem',NULL,'Prg Menu Item default View',NULL),(296,'0',180,'PrgView',NULL,'View for Prg View itself',NULL),(451,'0',411,'PrgViewField',NULL,'The View for \"View Items\" themself',NULL),(552,'0',143,'WindowSettings',NULL,'UI View for Window size and position.',NULL),(551,'0',453,'ListSettings',NULL,'UI View for Table View size and position',NULL),(587,'0',130,'Concept',NULL,'UI View for Concept',NULL),(593,'0',134,'AnyObject',NULL,'UI View for Object',NULL),(601,'0',36,'Date',NULL,'UI View for Date',NULL),(998,'0',971,'Role',NULL,'UI View for Role in Activity',NULL),(1520,'0',NULL,'PrgClassVersion',NULL,NULL,'BB25E445-FF1A-41CB-8FE6-0C1AC5E7E900'),(1547,'0',1504,'PrgVersion',NULL,NULL,'1396D2DA-ECE6-4057-A4F8-728F206C39D1'),(1649,'0',1624,'Relation',NULL,NULL,'98BF317C-BF00-4B21-B543-65A12A5193DD'),(1851,'0',1767,'PrgClass',NULL,NULL,'6A2F340F-BDFC-4350-80C3-62BF6801F4E5'),(2100,'0',1828,'DataBaseStore','DataBaseStore','DataBaseStore','202d3dbd-e2dd-4887-8c02-7b0e423ba173'),(2132,'0',1828,'DataBaseStore','DataBaseStore','DataBaseStore','29e42ef7-a44b-4297-a865-53bc4ddf8a4b'),(2140,'0',180,'PrgView','View of this Type','Interface View of some Type','ad9fe9fb-6367-43c8-b070-e584ee002914'),(2130,'0',NULL,NULL,NULL,NULL,'427F9E13-8CA0-4A62-BF02-91C7C3E85AE6'),(2217,'0',62,'RelationPrgAttribute_reserved','Programm Attributes','Attribute that model some Accosiation of this (any) object and some related type','a1ebd4d1-eb7e-4278-b7de-99d9462de094'),(2572,'0',2541,'UserRights','Right forSomething','The most abstract kind of Rights - as permission of Somebody make any Activitieson Something','2aa340db-42e4-49e2-a8fa-7b671a6aaae4'),(2570,'0',NULL,NULL,NULL,NULL,'CCCFA14A-12EF-4351-88FF-3B19C2FA868E'),(3181,'0',108,'PrgMenu','Programm Menu','Menu object - simply header and common point of Menu Items','d372f978-a8de-4052-b3f0-280f9257ffd7');
/*!40000 ALTER TABLE `prgview` ENABLE KEYS */;
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
-- Table structure for table `entitytype`
--

DROP TABLE IF EXISTS `entitytype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `entitytype` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entitytype`
--

LOCK TABLES `entitytype` WRITE;
/*!40000 ALTER TABLE `entitytype` DISABLE KEYS */;
INSERT INTO `entitytype` (`ID`, `UID`, `SYSCODE`, `DEL`, `PRGCLASSID`, `INSTALLATIONID`, `PARENTID`, `CODE`, `NAME`, `ACTUAL`) VALUES (9,NULL,'PrgComponent','0',NULL,NULL,7,'PrgComponent','Programm Component type','1'),(10,NULL,'PrgClass','0',NULL,NULL,9,'PrgClass','Program Class ','1'),(11,NULL,'PrgAttribute','0',NULL,NULL,9,'PrgAttribute','Program Class Attribute','1'),(12,NULL,'PrgMenu','0',NULL,NULL,9,'PrgMenu','Program Menu','1'),(13,NULL,'PrgMenuItem','0',NULL,NULL,9,'PrgMenuItem','Menu Items','1'),(16,NULL,'PrgInstallation','0',NULL,NULL,9,'PrgInstallation','PrgInstallation','1');
/*!40000 ALTER TABLE `entitytype` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role` (
  `ID` bigint(20) NOT NULL,
  `SysCode` varchar(200) DEFAULT NULL,
  `Name` varchar(1000) DEFAULT NULL,
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
  `Locale` char(2) DEFAULT NULL,
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
INSERT INTO `startsession` (`idSession`, `Counter`, `Moment`, `TmpKey`, `Locale`, `Who`, `FirstKey`, `SystemInstance`) VALUES ('39a230b1-38aa-48f5-bb73-a063cf327c8c',73,'2014-01-30 00:44:44','RAnX6nknSI5aZUOa','fr','TUFW','n:90802391530145703649493900445145210668820514833830222352635586930706792567230390441578254374974383112818584086272489840482428602945180373712666945115611569879760248519998768804809422678555328863290285009330480270844929113568335407087585522330635381680636982678660780629276473817399690014780012030162635489419, e:65537, d:84894562403323583620175469764795191926860237810904972980347594763342803316781477844985647501683100789961900952411222210291588687127272182713524295101528395991651596351241202156909528289844532847664921198912672645460002250099522103858495433817148116926183767880994514213296278657510026237557234272908050134553, p:13296002879832583123296375420656146740341325971548149182018962816993634317246513027214651668534782367136408943185801807678397048597284709432296878580937941, q:6829299929520551045019517517509955450121079487508263376374945905838786165433915602238185479729587361198160163019761831431257061640776831984225579602644959, pe:5781003128932197935491862880687198092162077659326250987100879586649276132107655045401551784410312091666569614661632703813051007824276787086276447734315373, pq:226021202483026003885550658337719049869731928657177216890569566348235762894642155442797569396424538603213595275796319825051445240075757947019016466395119, k:2706637064709261169900848668384140190651814403722052128405444843048071667172028080702149820279271681326926258010246551884091747650846731362148073197044169','CBM');
/*!40000 ALTER TABLE `startsession` ENABLE KEYS */;
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
INSERT INTO `identifier` (`ID`) VALUES (4426);
/*!40000 ALTER TABLE `identifier` ENABLE KEYS */;
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
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prgattribute`
--

LOCK TABLES `prgattribute` WRITE;
/*!40000 ALTER TABLE `prgattribute` DISABLE KEYS */;
INSERT INTO `prgattribute` (`ID`, `Del`, `ForRelation`, `ForPrgClass`, `Modified`, `Size`, `LinkFilter`, `Mandatory`, `IsPublic`, `ExprEval`, `ExprDefault`, `ExprValidate`, `CopyValue`, `CopyLinked`, `DeleteLinked`, `RelationStructRole`, `Part`, `Root`, `DisplayName`, `Notes`, `DBTable`, `DBColumn`) VALUES (189,'0',42,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','1',NULL,NULL,NULL,'ID',NULL,'CBM.Concept','c.ID'),(190,'0',43,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'UID',NULL,'CBM.Concept','c.UID'),(191,'0',44,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Class Code',NULL,'CBM.Concept','c.SysCode'),(192,'0',45,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Del',NULL,'CBM.Concept','c.Del'),(195,'0',48,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Base Concept',NULL,'CBM.Concept','c.BaseConcept'),(197,'0',50,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Primitive',NULL,'CBM.Concept','c.Primitive'),(198,'0',51,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Abstract',NULL,'CBM.Concept','c.Abstract'),(200,'0',55,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'PrgClassVersion',NULL,'CBM.PrgClass','cv.PrgVersion'),(203,'0',58,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Name',NULL,'CBM.PrgClass','cv.Description'),(204,'0',59,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Note',NULL,'CBM.PrgClass','cv.Notes'),(205,'0',60,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'PrgPackage',NULL,'CBM.PrgClass','cv.PrgPackage'),(206,'0',61,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'PrgType',NULL,'CBM.PrgClass','cv.PrgType'),(207,'0',64,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'ExprToString',NULL,'CBM.PrgClass','cv.ExprToString'),(208,'0',65,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'ExprFrom',NULL,'CBM.PrgClass','cv.ExprFrom'),(209,'0',66,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'ExprWhere',NULL,'CBM.PrgClass','cv.ExprWhere'),(210,'0',67,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'ExprGroup',NULL,'CBM.PrgClass','cv.ExprGroup'),(211,'0',68,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'ExprHaving',NULL,'CBM.PrgClass','cv.ExprHaving'),(212,'0',69,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'ExprOrder',NULL,'CBM.PrgClass','cv.ExprOrder'),(213,'0',70,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'ID',NULL,'CBM.Relation','r.ID'),(215,'0',72,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Attribute Code',NULL,'CBM.Relation','r.SysCode'),(216,'0',73,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Del',NULL,'CBM.Relation','r.Del'),(219,'0',81,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'CounterAttribute',NULL,'CBM.Relation','r.BackLinkRelation'),(221,'0',77,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Name',NULL,'CBM.PrgAttribute','rv.DisplayName'),(222,'0',78,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Notes',NULL,'CBM.PrgAttribute','rv.Notes'),(223,'0',79,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'AttributeKind',NULL,'CBM.Relation','r.RelationKind'),(224,'0',80,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'PointedClass',NULL,'CBM.Relation','r.RelatedConcept'),(225,'0',82,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'CrossClass',NULL,'CBM.Relation','r.CrossConcept'),(226,'0',83,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'CrossAttribute',NULL,'CBM.Relation','r.CrossRelation'),(227,'0',84,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'IsPublic',NULL,'CBM.PrgAttribute','rv.IsPublic'),(228,'0',85,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'ExprEval',NULL,'CBM.PrgAttribute','rv.ExprEval'),(229,'0',86,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'ExprDefault',NULL,'CBM.PrgAttribute','rv.ExprDefault'),(230,'0',87,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'ExprValidate',NULL,'CBM.PrgAttribute','rv.ExprValidate'),(231,'0',88,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'LinkFilter',NULL,'CBM.PrgAttribute','rv.LinkFilter'),(232,'0',89,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'CopyValue',NULL,'CBM.PrgAttribute','rv.CopyValue'),(233,'0',90,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'CopyLinked',NULL,'CBM.PrgAttribute','rv.CopyLinked'),(234,'0',91,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'DeleteLinked',NULL,'CBM.PrgAttribute','rv.DeleteLinked'),(235,'0',92,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Countable',NULL,'CBM.Relation','r.Countable'),(236,'0',93,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'InheritedFrom',NULL,'CBM.Relation','r.InheritedFrom'),(237,'0',94,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Modified',NULL,'CBM.PrgAttribute','rv.Modified'),(238,'0',95,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Historical attribute',NULL,'CBM.Relation','r.Historical'),(239,'0',96,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Versioned',NULL,'CBM.Relation','r.Versioned'),(240,'0',97,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'DBTable',NULL,'CBM.PrgAttribute','rv.DBTable'),(241,'0',98,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'DBColumn',NULL,'CBM.PrgAttribute','rv.DBColumn'),(242,'0',99,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Sequence',NULL,'CBM.Relation','r.Odr'),(244,'0',101,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'UIMandatory',NULL,'CBM.PrgAttribute','rv.Mandatory'),(471,'0',470,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Attributes',NULL,NULL,NULL),(246,'0',112,111,'0',NULL,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'ID',NULL,'CBM.PrgMenuItem','ID'),(247,'0',113,111,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'SysCode',NULL,'CBM.PrgMenuItem','SysCode'),(248,'0',114,111,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Name',NULL,'CBM.PrgMenuItem','Description'),(249,'0',115,111,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Parent',NULL,'CBM.PrgMenuItem','ParentItem'),(250,'0',118,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','1',NULL,NULL,NULL,'ID',NULL,'CBM.PrgComponent','ID'),(251,'0',119,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'UID',NULL,'CBM.PrgComponent','UID'),(252,'0',120,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Code',NULL,'CBM.PrgComponent','SysCode'),(253,'0',121,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Del','Deleted flag','CBM.PrgComponent','Del'),(254,'0',122,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Installation',NULL,'CBM.PrgComponent','InstallationID'),(255,'0',123,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'AnyType',NULL,'CBM.PrgComponent','AnyTypeID'),(257,'0',125,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'ID of version part of Programm Classes (PrgClass)',NULL,'CBM.PrgClass','cv.ID'),(258,'0',126,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'MainID',NULL,'CBM.PrgClass','cv.ForConcept'),(259,'0',136,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'For which Class and it\'s Version this attribute belongs',NULL,'CBM.PrgAttribute','rv.ForPrgClass'),(260,'0',137,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Prg Class',NULL,'CBM.PrgComponent','PrgClassID'),(261,'0',138,15,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Prg Class',NULL,'CBM.PrgClass','cv.DataBaseStore'),(263,'0',140,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Relation version part  ID',NULL,'CBM.PrgAttribute','rv.ID'),(264,'0',145,144,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'ID of Windows Settings','','CBM.windowsettings','ws.ID'),(265,'0',154,149,'0',NULL,NULL,'0','0',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'ID of Association Type',NULL,'CBM.RelationKind','rk.ID'),(266,'0',155,149,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Description',NULL,'CBM.RelationKind','rk.Description'),(267,'0',156,149,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'SysCode',NULL,'CBM.RelationKind','rk.SysCode'),(268,'0',157,149,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Del',NULL,'CBM.RelationKind','rk.Del'),(1521,'0',1520,1505,'0',NULL,NULL,'0',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'CBM.PrgVersion','pv.ID'),(1525,'0',1524,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.PrgVersion','pv.Del'),(1527,'0',1526,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.PrgVersion','pv.UID'),(1529,'0',1528,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.PrgVersion','pv.SysCode'),(272,'0',161,149,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Description',NULL,'CBM.RelationKind','rk.Notes'),(273,'0',162,144,'1',NULL,NULL,'1','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'UID',NULL,'CBM.windowsettings','ws.UID'),(274,'0',164,144,'0',NULL,NULL,'1','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'System Code',NULL,'CBM.windowsettings','ws.SysCode'),(275,'0',166,144,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Del',NULL,'CBM.windowsettings','ws.Del'),(276,'0',167,144,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Installation',NULL,'CBM.windowsettings','ws.InstallationID'),(277,'0',168,144,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Type',NULL,'CBM.windowsettings','ws.AnyTypeID'),(278,'0',169,144,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Class that provide work with this Entity',NULL,'CBM.windowsettings','ws.PrgClassID'),(279,'0',171,144,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'For which type this settings',NULL,'CBM.windowsettings','ws.ForType'),(280,'0',172,144,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Window','Window for which stored settings','CBM.windowsettings','ws.Win'),(281,'0',174,144,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Context','Additional Context for this parameters ','CBM.windowsettings','ws.Context'),(282,'0',176,144,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'For User',NULL,'CBM.windowsettings','ws.ForUser'),(283,'0',178,144,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Position',NULL,'CBM.windowsettings','ws.Position'),(284,'0',182,181,'1',NULL,NULL,'1','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'ID',NULL,'CBM.PrgView','cv.ID'),(285,'0',183,181,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'UID',NULL,'CBM.PrgView','cv.UID'),(286,'0',184,181,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Code',NULL,'CBM.PrgView','cv.SysCode'),(287,'0',185,181,'0',NULL,NULL,'0','0',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Del',NULL,'CBM.PrgView','cv.Del'),(403,'0',401,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Concept to which Relation belongs',NULL,'CBM.Relation','r.ForConcept'),(407,'0',406,181,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'ForClass',NULL,'CBM.PrgView','cv.ForConcept'),(409,'0',408,63,'0',NULL,NULL,'0','0',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'MainID',NULL,'CBM.PrgAttribute','rv.ForRelation'),(416,'0',415,412,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'ID',NULL,'CBM.PrgViewField','cvf.ID'),(418,'0',417,412,'1',NULL,NULL,'1','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'PrgView',NULL,'CBM.PrgViewField','cvf.ForPrgView'),(422,'0',421,412,'0',NULL,NULL,'1','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Attribute',NULL,'CBM.PrgViewField','cvf.ForRelation'),(424,'0',423,412,'0',NULL,NULL,'1','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Sequence','Sequence in Class','CBM.PrgViewField','cvf.Odr'),(426,'0',425,412,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'UI Root',NULL,'CBM.PrgViewField','cvf.UIPath'),(428,'0',427,412,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Mandatory',NULL,'CBM.PrgViewField','cvf.Mandatory'),(456,'0',455,412,'0',NULL,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Code',NULL,'CBM.PrgViewField','cvf.SysCode'),(432,'0',431,412,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Hidden',NULL,'CBM.PrgViewField','cvf.Hidden'),(434,'0',433,412,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'InList',NULL,'CBM.PrgViewField','cvf.InList'),(437,'0',436,181,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Note',NULL,'CBM.PrgView','cv.Notes'),(474,'0',473,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Size',NULL,'CBM.PrgAttribute','rv.Size'),(476,'0',475,63,'0',NULL,NULL,'0','1',NULL,'false',NULL,'1','1','1',NULL,NULL,NULL,'Constant','Attribute once initialized cannot be changed in the future','CBM.Relation','r.Const'),(478,'0',477,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','1',NULL,NULL,NULL,'Values Set','Map of possible Values','CBM.Relation','r.Domain'),(480,'0',479,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Role of Relation in Concept internal stucture',NULL,'CBM.PrgAttribute','rv.RelationStructRole'),(482,'0',481,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Part','Part of Entity in meta-data sence','CBM.Relation','r.VersPart'),(486,'0',485,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'??? MainPartID - MUST DIE?','What attribute MainID points to','CBM.Relation','r.MainPartID'),(488,'0',487,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Root','Root for Hierarchy','CBM.Relation','r.Root'),(490,'0',489,412,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'ControlType',NULL,'CBM.PrgViewField','cvf.ControlType'),(492,'0',491,412,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'ShowTitle',NULL,'CBM.PrgViewField','cvf.ShowTitle'),(494,'0',493,412,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Editable',NULL,'CBM.PrgViewField','cvf.Editable'),(496,'0',495,412,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'DataSourceView',NULL,'CBM.PrgViewField','cvf.DataSourceView'),(498,'0',497,412,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'ValueField',NULL,'CBM.PrgViewField','cvf.ValueField'),(500,'0',499,412,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'DisplayField',NULL,'CBM.PrgViewField','cvf.DisplayField'),(502,'0',501,412,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'PickListWidth',NULL,'CBM.PrgViewField','cvf.PickListWidth'),(504,'0',503,412,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'ViewOnly',NULL,'CBM.PrgViewField','cvf.ViewOnly'),(803,'0',802,454,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'ID',NULL,'CBM.ListSettings','ls.ID'),(805,'0',804,454,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'UID',NULL,'CBM.ListSettings','ls.UID'),(807,'0',806,454,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Del',NULL,'CBM.ListSettings','ls.Del'),(809,'0',808,454,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Installation',NULL,'CBM.ListSettings','ls.InstallationID'),(811,'0',810,454,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'For which type this settings',NULL,'CBM.ListSettings','ls.ForType'),(813,'0',812,454,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Window','Window for which stored settings','CBM.ListSettings','ls.Win'),(815,'0',814,454,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Context','Additional Context for this parameters ','CBM.ListSettings','ls.Context'),(817,'0',816,454,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'For User',NULL,'CBM.ListSettings','ls.ForUser'),(819,'0',818,454,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'List Settings',NULL,'CBM.ListSettings','ls.Settings'),(979,'0',978,972,'0',NULL,NULL,'0','0',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'CBM.Role','r.ID'),(981,'0',980,972,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.Role','r.SysCode'),(997,'0',996,972,NULL,NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,NULL,NULL,'CBM.Role','r.Name'),(1203,'0',1201,131,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'ID of Concept','ID','CBM.Concept','c.ID'),(1202,'0',1200,131,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Concept Code','Concept Code','CBM.Concept','c.SysCode'),(1531,'0',1530,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Description',NULL,'CBM.PrgVersion','pv.Description'),(1533,'0',1532,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.PrgVersion','pv.Owner'),(1535,'0',1534,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.PrgVersion','pv.DateMark'),(1537,'0',1536,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.PrgVersion','pv.Actual'),(1539,'0',1538,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.PrgVersion','pv.ExprFilter'),(1603,'0',1602,131,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,NULL,NULL,'CBM.Concept','c.BaseConcept'),(1605,'0',1604,131,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,NULL,NULL,'CBM.Concept','c.Description'),(1607,'0',1606,131,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,NULL,NULL,'CBM.Concept','c.Notes'),(1609,'0',1608,131,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,NULL,NULL,'CBM.Concept','c.Primitive'),(1611,'0',1610,131,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,NULL,NULL,'CBM.Concept','c.Abstract'),(1613,'0',1612,131,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,NULL,NULL,'CBM.Concept','c.Author'),(1635,'0',1634,1625,'1',NULL,NULL,'0',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'ID',NULL,'CBM.Relation','r.ID'),(1644,'0',1643,1625,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Del',NULL,'CBM.Relation','r.Del'),(1646,'0',1645,1625,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'SysCode',NULL,'CBM.Relation','r.SysCode'),(1659,'0',1658,1625,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Concept for which this Relation belongs',NULL,'CBM.Relation','r.ForConcept'),(1664,'0',1663,1625,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'InheritedFrom',NULL,'CBM.Relation','r.InheritedFrom'),(1666,'0',1665,1625,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'InheritedFrom',NULL,'CBM.Relation','r.RelationRole'),(1668,'0',1667,1625,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'RelatedConcept',NULL,'CBM.Relation','r.RelatedConcept'),(1670,'0',1669,1625,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'RelationKind',NULL,'CBM.Relation','r.RelationKind'),(1672,'0',1671,1625,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Domain',NULL,'CBM.Relation','r.Domain'),(1674,'0',1673,1625,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'BackLinkRelation',NULL,'CBM.Relation','r.BackLinkRelation'),(1676,'0',1675,1625,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'CrossConcept',NULL,'CBM.Relation','r.CrossConcept'),(1678,'0',1677,1625,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'CrossRelation',NULL,'CBM.Relation','r.CrossRelation'),(1680,'0',1679,1625,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Description',NULL,'CBM.Relation','r.Description'),(1682,'0',1681,1625,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Notes',NULL,'CBM.Relation','r.Notes'),(1684,'0',1683,1625,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Seqn',NULL,'CBM.Relation','r.Odr'),(1686,'0',1685,1625,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Const',NULL,'CBM.Relation','r.Const'),(1688,'0',1687,1625,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Countable',NULL,'CBM.Relation','r.Countable'),(1690,'0',1689,1625,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Historical',NULL,'CBM.Relation','r.Historical'),(1692,'0',1691,1625,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Versioned',NULL,'CBM.Relation','r.Versioned'),(1694,'0',1693,1625,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'VersPart',NULL,'CBM.Relation','r.VersPart'),(1696,'0',1695,1625,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'MainPartID','Name of field in the main part ','CBM.Relation','r.MainPartID'),(1698,'0',1697,1625,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Root','Root in hierarchy (optional, for hierarchical data only)','CBM.Relation','r.Root'),(1739,'0',1738,131,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Del',NULL,'CBM.Concept','c.Del'),(1741,'0',1740,131,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'UID','Concept Code','CBM.Concept','c.UID'),(1771,'0',1772,1768,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'ID',NULL,'CBM.PrgClass','pc.ID'),(1775,'0',1774,1768,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Del',NULL,'CBM.PrgClass','pc.Del'),(1785,'0',1784,412,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','0',NULL,NULL,NULL,'Del',NULL,'CBM.PrgViewField','cvf.Del'),(1802,'0',1801,1768,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'UID',NULL,'CBM.PrgClass','pc.UID'),(1812,'0',1811,1768,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'ForConcept',NULL,'CBM.PrgClass','pc.ForConcept'),(1815,'0',1814,1768,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'PrgVersion',NULL,'CBM.PrgClass','pc.PrgVersion'),(1817,'0',1816,1768,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Description',NULL,'CBM.PrgClass','pc.Description'),(1819,'0',1818,1768,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Notes',NULL,'CBM.PrgClass','pc.Notes'),(1821,'0',1820,1768,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'ExprToString',NULL,'CBM.PrgClass','pc.ExprToString'),(1824,'0',1823,1768,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'DataBaseStore',NULL,'CBM.PrgClass','pc.DataBaseStore'),(1837,'0',1836,1768,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','1','1',NULL,NULL,NULL,'ExprFrom',NULL,'CBM.PrgClass','pc.ExprFrom'),(1839,'0',1838,1768,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','1','1',NULL,NULL,NULL,'ExprWhere',NULL,'CBM.PrgClass','pc.ExprWhere'),(1841,'0',1840,1768,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','1','1',NULL,NULL,NULL,'ExprGroup',NULL,'CBM.PrgClass','pc.ExprGroup'),(1843,'0',1842,1768,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','1','1',NULL,NULL,NULL,'ExprHaving',NULL,'CBM.PrgClass','pc.ExprHaving'),(1845,'0',1844,1768,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','1','1',NULL,NULL,NULL,'ExprOrder',NULL,'CBM.PrgClass','pc.ExprOrder'),(1848,'0',1847,1768,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','1','1',NULL,NULL,NULL,'PrgPackage',NULL,'CBM.PrgClass','pc.PrgPackage'),(1850,'0',1849,1768,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','1','1',NULL,NULL,NULL,'PrgType',NULL,'CBM.PrgClass','pc.PrgType'),(2066,'0',2065,1829,NULL,NULL,NULL,'0',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'ID',NULL,'CBM.DataBaseStore ','dbs.ID'),(2065,'0',2066,1829,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Del','Delete flag','CBM.DataBaseStore ','dbs.Del'),(2070,'0',2069,1829,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'UID','Global ID, used for external data exchange','CBM.DataBaseStore ','dbs.UID'),(2072,'0',2071,1829,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Code','Permanent code','CBM.DataBaseStore ','dbs.SysCode'),(2074,'0',2073,1829,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Description','Short Description for this data store','CBM.DataBaseStore ','dbs.Description'),(2076,'0',2075,1829,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'DriverType','Name of DBMS','CBM.DataBaseStore ','dbs.DriverType'),(2078,'0',2077,1829,'1',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Connection Parameters','Connection string as usial','CBM.DataBaseStore ','dbs.ConnectionParams'),(2205,'0',2204,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Description',NULL,'CBM.Relation','r.Description'),(2207,'0',2206,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Notes',NULL,'CBM.Relation','r.Notes'),(2214,'0',2213,63,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Concept to which Relation belongs',NULL,'CBM.Relation','r.RelationRole'),(2341,'0',2342,111,'0',4,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Order',NULL,'CBM.PrgMenuItem','Odr'),(2348,'0',2347,111,'0',0,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'For Menu',NULL,'CBM.PrgMenuItem','ForMenu'),(2351,'0',2350,111,'0',120,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Name',NULL,'CBM.PrgMenuItem','CalledConcept'),(2353,'0',2352,111,'0',200,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Called Method',NULL,'CBM.PrgMenuItem','CalledMethod'),(2355,'0',2354,111,'0',400,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Args',NULL,'CBM.PrgMenuItem','Args'),(2548,'0',2547,2542,'1',NULL,NULL,'1','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'ID','ID of Right','CBM.Right','ID'),(2552,'0',2551,2542,'0',20,NULL,'1','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'For Type','Right for What','CBM.Right','ForType'),(2561,'0',2560,2542,'0',20,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Action Type','To Do What','CBM.Right','ActionType'),(2563,'0',2562,2542,'0',20,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'For User','For Whom is this Right granted','CBM.Right','ForUser'),(2565,'0',2564,2542,'0',2000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Creteria','Additional creteria','CBM.Right','Creteria'),(2767,'0',2766,1195,'0',NULL,NULL,'0','0',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'ID','Identifier',NULL,NULL),(2783,'0',2782,1195,'0',NULL,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'ID','Identifier',NULL,NULL),(2789,'0',2788,1195,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Name',NULL,NULL,NULL),(2793,'0',2792,1195,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2914,'0',2913,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.PrgVersion','pv.Owner'),(2904,'0',2903,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.PrgVersion','pv.ID'),(2906,'0',2905,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.PrgVersion','pv.Del'),(2912,'0',2911,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Description',NULL,'CBM.PrgVersion','pv.Description'),(2910,'0',2909,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.PrgVersion','pv.SysCode'),(2908,'0',2907,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.PrgVersion','pv.UID'),(2920,'0',2919,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.PrgVersion','pv.ExprFilter'),(2916,'0',2915,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.PrgVersion','pv.DateMark'),(2918,'0',2917,1505,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,'CBM.PrgVersion','pv.Actual'),(3090,'0',3089,110,'0',NULL,NULL,'1','0',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,NULL,NULL,'CBM.PrgMenu','ID'),(3097,'0',3096,110,'0',1,NULL,'1','0',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,NULL,NULL,'CBM.PrgMenu','Del'),(3099,'0',3098,110,'0',36,NULL,'1','0',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,NULL,NULL,'CBM.PrgMenu','UID'),(3101,'0',3100,110,'0',200,NULL,'1','0',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,NULL,NULL,'CBM.PrgMenu','SysCode'),(3103,'0',3102,110,'0',2000,NULL,'1','0',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,NULL,NULL,'CBM.PrgMenu','Description'),(3225,'0',3224,454,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Del',NULL,'CBM.ListSettings','ls.Del'),(3227,'0',3226,454,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'For which type this settings',NULL,'CBM.ListSettings','ls.ForType'),(3223,'0',3222,454,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'ID',NULL,'CBM.ListSettings','ls.ID'),(3231,'0',3230,454,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Context','Additional Context for this parameters ','CBM.ListSettings','ls.Context'),(3229,'0',3228,454,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Window','Window for which stored settings','CBM.ListSettings','ls.Win'),(3235,'0',3234,454,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'List Settings',NULL,'CBM.ListSettings','ls.Settings'),(3233,'0',3232,454,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'For User',NULL,'CBM.ListSettings','ls.ForUser'),(3247,'0',3246,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','1',NULL,NULL,NULL,'ID',NULL,'CBM.PrgComponent','ID'),(3249,'0',3248,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'UID',NULL,'CBM.PrgComponent','UID'),(3251,'0',3250,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Code',NULL,'CBM.PrgComponent','SysCode'),(3255,'0',3254,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Installation',NULL,'CBM.PrgComponent','InstallationID'),(3257,'0',3256,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'AnyType',NULL,'CBM.PrgComponent','AnyTypeID'),(3253,'0',3252,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Del','Deleted flag','CBM.PrgComponent','Del'),(3259,'0',3258,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Prg Class',NULL,'CBM.PrgComponent','PrgClassID'),(3265,'0',3264,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','1',NULL,NULL,NULL,'ID',NULL,'CBM.PrgComponent','ID'),(3267,'0',3266,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'UID',NULL,'CBM.PrgComponent','UID'),(3949,'0',3948,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Code',NULL,'CBM.PrgComponent','SysCode'),(3953,'0',3952,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Installation',NULL,'CBM.PrgComponent','InstallationID'),(3951,'0',3950,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Del','Deleted flag','CBM.PrgComponent','Del'),(3957,'0',3956,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Prg Class',NULL,'CBM.PrgComponent','PrgClassID'),(3955,'0',3954,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'AnyType',NULL,'CBM.PrgComponent','AnyTypeID'),(3963,'0',3962,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','1',NULL,NULL,NULL,'ID',NULL,'CBM.PrgComponent','ID'),(3965,'0',3964,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'UID',NULL,'CBM.PrgComponent','UID'),(3967,'0',3966,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Code',NULL,'CBM.PrgComponent','SysCode'),(3969,'0',3968,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Del','Deleted flag','CBM.PrgComponent','Del'),(3971,'0',3970,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Installation',NULL,'CBM.PrgComponent','InstallationID'),(3973,'0',3972,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'AnyType',NULL,'CBM.PrgComponent','AnyTypeID'),(3975,'0',3974,117,'0',NULL,NULL,'0','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,'Prg Class',NULL,'CBM.PrgComponent','PrgClassID'),(4241,'0',4240,1195,'0',36,NULL,'1','0',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'ID','Identifier',NULL,NULL),(4246,'0',4245,181,'0',1,NULL,'0','0',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Del',NULL,'CBM.PrgView','cv.Del'),(4315,'0',4314,1195,'0',NULL,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'ID','Identifier',NULL,NULL),(4317,'0',4316,1195,'0',36,NULL,'1','0',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'ID','Identifier',NULL,NULL),(4319,'0',4318,181,'0',1,NULL,'0','0',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Del',NULL,'CBM.PrgView','cv.Del'),(4321,'0',4320,1195,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Name',NULL,NULL,NULL),(4323,'0',4322,1195,'1',NULL,NULL,'1','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4333,'0',4332,1195,'0',NULL,NULL,'1','1',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'ID','Identifier',NULL,NULL),(4335,'0',4334,1195,'0',36,NULL,'1','0',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'ID','Identifier',NULL,NULL),(4337,'0',4336,181,'0',1,NULL,'0','0',NULL,NULL,NULL,'0','0','0',NULL,NULL,NULL,'Del',NULL,'CBM.PrgView','cv.Del'),(4339,'0',4338,1195,'0',1000,NULL,'0','1',NULL,NULL,NULL,'1','0','0',NULL,NULL,NULL,'Name',NULL,NULL,NULL),(4341,'0',4340,1195,'1',NULL,NULL,'1','1',NULL,NULL,NULL,'1','1','1',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `prgattribute` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-01-30  0:48:21
