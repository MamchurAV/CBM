INSERT INTO cbm.concept(
            id, del, baseconcept, hiercode, syscode, description, 
            notes, source, primitive, abstract, abnormalinherit, ishierarchy, 
            actual, prgversion, prgpackage, prgtype, prgdescription, prgnotes, 
            exprtostring, exprtostringdetailed, menuadditions, createfrommethods, 
            dbstorage, exprfrom, exprwhere, exprorder, exprgroup, exprhaving)
    SELECT c.id, c.del, c.baseconcept, c.hiercode, c.syscode, c.description, 
            c.notes, c.source, c.primitive, c.abstract, c.abnormalinherit, coalesce(pk.ishierarchy, '0'), 
            'Actual', pk.prgversion, pk.prgpackage, pk.prgtype, pk.description, pk.notes, 
            pk.exprtostring, pk.exprtostringdetailed, pk.menuadditions, pk.createfrommethods, 
            pk.databasestore, pk.exprfrom, pk.exprwhere, pk.exprorder, pk.exprgroup, pk.exprhaving 
    FROM cbm.concept_1 c
    LEFT JOIN cbm.prgclass pk on pk.forconcept = c.id ORDER BY hiercode NULLS FIRST, syscode;

----- DRAFTS ----------
Select * 
--DELETE
from  cbm.prgclass where id = '8fa72a56-0ca9-4763-ba6e-c4a7af4fd3ce'; 
forconcept =   
(Select forconcept from cbm.prgclass group by forconcept having count(forconcept) > 1);

Update cbm.prgclass set ishierarchy = 0 where ishierarchy is null;


    

--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------
INSERT INTO cbm.relation(
            id, del, odr, forconcept, relatedconcept, syscode, description, 
            notes, prgnotes, relationkind, relationkind_link, relationrole, 
            domain, ispublic, mandatory, const, countable, backlinkrelation, 
            linkfilter, crossconcept, crossrelation, crosslinkfilter, relationstructrole, 
            hierarchylink, root, versioned, historical, part, verspart, mainpartid, 
            size, exprdefault, exprvalidate, expreval, exprfunctions, dbtable, 
            dbcolumn, copyvalue, copylinked, deletelinked, copyfilter)
SELECT  
	    id, del, odr, forconcept, relatedconcept, syscode, description, 
            notes, prgnotes, relationkind, relationkind_link, relationrole, 
            domain, ispublic, mandatory, const, countable, backlinkrelation, 
            linkfilter, crossconcept, crossrelation, crosslinkfilter, relationstructrole, 
            hierarchylink, root, versioned, historical, part, verspart, mainpartid, 
            size, exprdefault, exprvalidate, expreval, exprfunctions, dbtable, 
            dbcolumn, copyvalue, copylinked, deletelinked, copyfilter
FROM ( 
   SELECT
            r.id, r.del, r.odr, r.forconcept, r.relatedconcept, r.syscode, r.description, 
            r.notes, pa.notes as prgnotes, r.relationkind, r.relationkind_link, r.relationrole, 
            r.domain, r.ispublic, pa.mandatory, r.const, r.countable, r.backlinkrelation, 
            pa.linkfilter, r.crossconcept, r.crossrelation, crosslinkfilter, relationstructrole, 
            hierarchylink, pa.root, r.versioned, r.historical, pa.part, r.verspart, pa.mainpartid, 
            size, exprdefault, exprvalidate, expreval, exprfunctions, dbtable, 
            dbcolumn, copyvalue, copylinked, deletelinked, copyfilter,
            row_number() OVER (PARTITION BY r.id ) as dub
     FROM cbm.relation_1 r
     LEFT JOIN cbm.prgattribute pa ON pa.forrelation = r.id 
     WHERE exists (SELECT * FROM cbm.concept c WHERE c.id = r.forconcept)
 -- TEST --> AND r.id = 'fc71e486-67d5-4649-aa15-fe33848b51df'
  ) inner_query
  WHERE inner_query.dub = 1   
 ORDER BY forconcept, odr;



----- DRAFTS ----------
   
SELECT  r.id
     FROM cbm.relation_1 r
     LEFT JOIN cbm.prgattribute pa ON pa.forrelation = r.id 
WHERE exists (SELECT * FROM cbm.concept c WHERE c.id = r.forconcept)
     GROUP BY r.id HAVING count(r.id) > 1;

SELECT r.forconcept, c.syscode, r.syscode, pa.forrelation, dbtable, dbcolumn
FROM cbm.relation_1 r
INNER JOIN cbm.concept c ON c.id = r.forconcept
LEFT JOIN cbm.prgattribute pa ON pa.forrelation = r.id 
WHERE r.id = 'fc71e486-67d5-4649-aa15-fe33848b51df'

r.id in ('d173c903-cec3-40a4-a227-a626a5e57449',
'4149dfc8-2af3-11e4-b4f7-5ff9758a2365',
'afdb509f-2438-4839-ab5b-eac33779683a',
'415d8f1e-2af3-11e4-9855-376a5a0a9fa3',
'417228de-2af3-11e4-a5f3-6b3efcf4ce87',
'41537cd6-2af3-11e4-b842-6f425321db5c',
'cbabd793-8103-4123-9121-269779540b80',
'afdb50a7-ad6b-46be-be4e-85f814f9945b',
'4159e594-2af3-11e4-87d2-772a4ce7c9fa',
'7b2358ea-4e82-43be-8920-b58e1b424e04',
'afdb5097-caec-4dd3-9d91-3c9de0eae531',
'415ddd3e-2af3-11e4-bf97-4f615f209374',
'41597064-2af3-11e4-b0ca-d703b182a802',
'415a33b4-2af3-11e4-a1e9-cffc53f35d16',
'415b9344-2af3-11e4-bc2b-8fd070a469f1',
'415b4524-2af3-11e4-9ba8-a39782739606',
'c7344d55-8df2-4fc1-a4e3-1d7558b19e5e',
'415d40fe-2af3-11e4-a89c-a7848f611a71',
'fc71e486-67d5-4649-aa15-fe33848b51df'
)
ORDER BY r.id, dbtable, dbcolumn;

