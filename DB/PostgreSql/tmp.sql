Select * from cbm.prgattribute pa
--left join cbm.relation r on r.id = pa.forrelation 
--left join cbm.concept c on c.id = r.forconcept 
where pa.dbtable = 'CBM.Concept' 
order by pa.forrelation;