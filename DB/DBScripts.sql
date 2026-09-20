-- DROP TABLE cbm.concept_2;

CREATE TABLE cbm.concept_2
(
  id uuid NOT NULL,
  del character(1) NOT NULL DEFAULT 0,
  baseconcept uuid,
  hiercode character varying(2000),
  
  syscode character varying(200),
  description character varying(400),
  notes character varying(4000),
  source uuid,
  primitive character(1) NOT NULL DEFAULT 0,
  abstract character(1) NOT NULL DEFAULT 0,
  abnormalinherit character(1) NOT NULL DEFAULT 0,
  ishierarchy character(1) NOT NULL DEFAULT 0,
  actual character varying(100),

  prgversion uuid,
  prgpackage character varying(120),
  prgtype character varying(120),
  prgdescription character varying(400),
  prgnotes character varying(4000),
  exprtostring character varying(2000),
  exprtostringdetailed character varying(2000),
  menuadditions character varying(8000),
  createfrommethods character varying(8000),

  dbstorage uuid,
  exprfrom character varying(4000),
  exprwhere character varying(4000),
  exprorder character varying(1000),
  exprgroup character varying(1000),
  exprhaving character varying(2000),
  
  CONSTRAINT pk_concept_2 PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE cbm.concept_2
  OWNER TO "CBM";


CREATE TABLE cbm.relation
(
  id uuid NOT NULL,
  del character(1) DEFAULT 0,
  odr smallint DEFAULT 999,
  forconcept uuid,
  relatedconcept uuid,
  syscode character varying(200),
  description character varying(400),
  notes character varying(2000),
  prgnotes character varying(2000),
  relationkind character varying(40) DEFAULT 'Value'::character varying,
  relationkind_link uuid,
  relationrole uuid,
  domain character varying(2000),
 
  ispublic character(1) DEFAULT 1,
  mandatory character(1) DEFAULT 0,
  const character(1) DEFAULT 0,
  countable character(1) DEFAULT 0,
  
  backlinkrelation uuid,
  linkfilter character varying(4000),
  crossconcept uuid,
  crossrelation uuid,
  crosslinkfilter character varying(4000),
  
  relationstructrole character varying(45),
  hierarchylink character(1) DEFAULT 0,
  root uuid,
  versioned character(1) DEFAULT 0,
  historical character(1) DEFAULT 0,
  part character varying(40),
  verspart character varying(120),
  mainpartid character varying(120),
---------------

  size integer,
  exprdefault character varying(2000),
  exprvalidate character varying(2000),
  expreval character varying(4000),
  exprfunctions character varying(4000),
  
  dbtable character varying(2000),
  dbcolumn character varying(2000),
  
  copyvalue character(1) DEFAULT 1,
  copylinked character(1) DEFAULT 1,
  deletelinked character(1) DEFAULT 1,
  copyfilter character varying(2000),
----------
  
  CONSTRAINT pk_relation2 PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE cbm.relation
  OWNER TO "CBM";

