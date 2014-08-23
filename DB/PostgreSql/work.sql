ALTER TABLE cbm.outformat ADD COLUMN uid uuid DEFAULT uuid_generate_v1();
ALTER TABLE cbm.concept
    ALTER COLUMN author TYPE uuid USING uuid_generate_v1(),
    ALTER COLUMN concept DROP DEFAULT,
    ALTER COLUMN concept TYPE uuid USING '8c707308-2ae5-11e4-9888-8f6cc0796951';

Select uuid_generate_v1();

ALTER TABLE cbm.databasestore ALTER COLUMN id TYPE uuid USING '63916a66-2ae8-11e4-901f-3b693d05ce21';

ALTER TABLE cbm.entitykind
    ALTER COLUMN id TYPE uuid USING uuid_generate_v1(),
    ALTER COLUMN parent TYPE uuid USING null,
    ALTER COLUMN source TYPE uuid USING null,
 --   ALTER COLUMN concept DROP DEFAULT,
    ALTER COLUMN concept TYPE uuid USING null;
    
ALTER TABLE cbm.imgname
    ALTER COLUMN id TYPE uuid USING uuid_generate_v1();
ALTER TABLE cbm.outformat
    ALTER COLUMN code TYPE uuid USING (Select code from cbm.outformat);    

--ALTER TABLE cbm.prgview ADD COLUMN uid uuid DEFAULT uuid_generate_v1();
ALTER TABLE cbm.relationkind ADD COLUMN uid uuid DEFAULT uuid_generate_v1();
ALTER TABLE cbm.relation ADD COLUMN urelatedconcept uuid;
ALTER TABLE cbm.relation ADD COLUMN uinheritedfrom uuid;
ALTER TABLE cbm.relation ADD COLUMN uforconcept uuid;
ALTER TABLE cbm.windowsettings
--    ALTER COLUMN calledconcept DROP DEFAULT,
    ALTER COLUMN id TYPE uuid USING uuid_generate_v1();
    ALTER COLUMN concept TYPE uuid USING null;
    ALTER COLUMN foruser TYPE uuid USING null,
    ALTER COLUMN fortype TYPE uuid USING null;

    
    