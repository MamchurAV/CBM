SELECT hint, title, id, displayfield, editable, odr, uipath, inlist, 
       controltype, mandatory, syscode, hidden, viewonly, showtitle, 
       valuefield, picklistwidth, createfrommethods, datasourceview, 
       del, picklistfields, forrelation, forprgview, colspan, rowspan, 
       forprgattribute
  FROM cbm.prgviewfield 
  WHERE forprgview = 'd9e32c2c-19e9-454f-83dc-2a9ca3c7ea3c' -- controltype = 'SpacerItem';

  --Delete from cbm.prgviewfield WHERE forrelation = 'd9d80e15-2914-4d7d-84b0-a3dbad2e9bbb'
--SELECT * from cbm.relation WHERE id in ('d9d9428e-1ed4-4f0f-9ce6-be651272355d', 'd9d80e15-2914-4d7d-84b0-a3dbad2e9bbb')