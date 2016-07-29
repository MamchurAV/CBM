Select * 
--DELETE
from  cbm.prgclass where id = '8fa72a56-0ca9-4763-ba6e-c4a7af4fd3ce'; 
forconcept =   
(Select forconcept from cbm.prgclass group by forconcept having count(forconcept) > 1);

Update cbm.prgclass set ishierarchy = 0 where ishierarchy is null;


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


