Select * from CBM.PrgAttribute where dbtable = 'CBM.PrgAttribute' and dbcolumn = 'pa.ForPrgClass';
Select * from CBM.relation where ID in ('4141a24a-2af3-11e4-b9d8-ab5ea4954360', '41928296-2af3-11e4-95a9-5f6cd83e83f6');

"d0295cce-2aed-11e4-9461-7bea4d4454e4" -- class
"d01dc3dc-2aed-11e4-a968-f71f82da7dfd" -- class (bad?)
"4141a24a-2af3-11e4-b9d8-ab5ea4954360" -- Relation 
"41928296-2af3-11e4-95a9-5f6cd83e83f6" -- Relation REAL!!!

Select r.* 
from CBM.Concept c 
inner join CBM.Relation r on r.ForConcept=c.ID and r.del='0'
inner join CBM.PrgAttribute pa on pa.ForRelation=r.ID  and pa.ForPrgClass='d0295cce-2aed-11e4-9461-7bea4d4454e4' and pa.dbcolumn is not null 
where c.SysCode='PrgAttribute'
order by SysCode;

Select pc.* 
from CBM.PrgView pv
inner join CBM.Concept c on c.ID=pv.ForConcept 
inner join CBM.PrgClass pc on pc.ForConcept=c.ID and pc.del='0' and pc.actual = '1'
where pv.SysCode = 'PrgAttribute' and pv.del='0' and pv.actual = '1';

Select * 
from CBM.PrgViewField pvf 
inner join CBM.Relation r on r.ID=pvf.ForRelation and r.del='0'
inner join CBM.PrgAttribute pa on pa.ForRelation=r.ID  and pa.ForPrgClass='d0295cce-2aed-11e4-9461-7bea4d4454e4' and pa.dbcolumn is not null 
inner join  CBM.Concept c on c.ID=r.RelatedConcept 
where pvf.ForPrgView='22e330fe-2af1-11e4-b652-176ac8ba7304' and pvf.del='0'
order by pvf.Odr, r.Odr, pa.ID;

Select pvf.syscode, pa.dbcolumn, pa.dbtable, c.SysCode, r.Versioned, pa.ForRelation 
from  CBM.PrgView pv 
inner join  CBM.PrgViewField pvf on pvf.ForPrgView=pv.ID and pvf.Del='0' 
inner join  CBM.Relation r on r.ID=pvf.ForRelation and r.Del='0' 
inner join CBM.PrgClass pc on pc.ForConcept=pv.ForConcept and pc.del='0' and pc.actual = '1' 
inner join  CBM.Concept c on c.ID=r.RelatedConcept 
inner join  CBM.PrgAttribute pa on pa.ForRelation=r.ID and pa.ForPrgClass=pc.ID and pa.dbtable is not null 
where pv.syscode='PrgAttribute' and pv.del='0' and pv.actual = '1'
order by pa.dbtable, pvf.Odr, r.Odr;

