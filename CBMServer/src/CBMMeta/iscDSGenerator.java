/**
 * @author Alexander Mamchur
 *
 */
package CBMMeta;

import java.sql.SQLException;
import java.util.HashMap;
import java.io.*;

import org.restlet.resource.ServerResource;
import org.restlet.Request;
import org.restlet.resource.Post;


import CBMPersistence.I_DataBase;
import CBMPersistence.PostgreSqlDataBase;
import CBMServer.DSResponce;

/**
 * Generation of specific for Isomorphic SmartClient client-side metadata ("DataSource") from CBM metadata 
 *
 */
public class iscDSGenerator  extends ServerResource
{
//	static I_DataBase metaDB = new MySQLDataBase(); // TODO Turn to configuration initialization
//	static I_DataBase metaDB = new DB2DataBase(); // TODO Turn to configuration initialization
	static I_DataBase metaDB = new PostgreSqlDataBase(); // TODO Turn to configuration initialization
	Request request;
	public iscDSGenerator() 
	{
		request = Request.getCurrent();
		String req = request.toString();
		req = request.getEntityAsText();
		req = req.substring( req.indexOf("=")+1, req.length());
		
        try 
        {
			generateDS(req);
		} 
        catch (SQLException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}


	@Post("json") 
	public void generateDS(String forView) throws SQLException, IOException 
	{

		SelectTemplate mdForSelect = new SelectTemplate();
		DSResponce metaResponce = null;
		PrintWriter out = new PrintWriter(new FileWriter("C:/CBM/CBM/CBMClient/CBMCore/" + forView + ".js")); // TODO refactor to configurable path 
		long forViewId=0;
		long forPrgClassId=0;

		/**
		 * ---- DS Header -------------
		 */
		mdForSelect.from = "CBM.PrgView pv "
				+ "inner join CBM.Concept c on c.ID=pv.ForConcept "
				+ "inner join CBM.PrgClass pc on pc.ForConcept=c.ID and pc.del='0' " 
				+ "inner join CBM.PrgVersion vers on pc.PrgVersion=vers.ID and vers.Actual='1' and vers.Del='0'";
		mdForSelect.where = "pv.SysCode = '" + forView + "'  and pv.del = '0'";
		
		mdForSelect.columns = new HashMap<String,String>(3); 
		mdForSelect.columns.put("IDPrgClass", "pc.ID");
		mdForSelect.columns.put("IDViev", "pv.ID");
		mdForSelect.columns.put("SysCode", "c.SysCode");
		mdForSelect.columns.put("Title", "c.Description");
		mdForSelect.columns.put("ExprToString", "pc.ExprToString");
		
		try
		{
			metaResponce = metaDB.doSelect(mdForSelect, null);
		}
		catch (Exception ex){ ex.printStackTrace(System.err); }
		
		if (metaResponce != null && metaResponce.data != null )
		{
			while (metaResponce.data.next())
			{
				forPrgClassId = metaResponce.data.getLong("IDPrgClass");
				forViewId = metaResponce.data.getLong("IDViev");
				out.println("isc.CBMDataSource.create({");
				out.println("ID:" + metaResponce.data.getString("SysCode"));
				out.println("title:" + metaResponce.data.getString("Title"));
				out.println("dbName: Window.default_DB,"); 
				out.println("titleField: " + metaResponce.data.getString("ExprToString") + " ,"); 
				out.println("infoField: " + metaResponce.data.getString("ExprToString") + " ,"); 
			}
			out.println("fields: [");
			
			/**
			 * ---- DS Fields -------------
			 */
			mdForSelect.from = "CBM.PrgViewField pvf "
					+ "inner join CBM.Relation r on r.ID=pvf.ForRelation and r.del='0'"
					+ "inner join CBM.Concept c on c.ID=r.RelatedConcept and c.del='0'"
					+ "inner join CBM.PrgAttribute pa on pa.ForRelation=r.ID  and pa.ForPrgClass=" + String.valueOf(forPrgClassId) + " and pa.dbcolumn is not null "
					+ "inner join CBM.RelationKind rkind on rkind.ID = r.RelationKind";
			mdForSelect.where = "pvf.ForPrgView=" + String.valueOf(forViewId) + " and pvf.del='0'";
			mdForSelect.orderby = "pvf.Odr, r.Odr, pa.ID"; // Must exist and be an ID at least
			
			mdForSelect.columns = new HashMap<String,String>(24); 
			mdForSelect.columns.put("SysCode", "pvf.SysCode");
			mdForSelect.columns.put("PointedClass", "c.SysCode");
			mdForSelect.columns.put("Name", "pa.DisplayName");
			mdForSelect.columns.put("Size", "pa.Size");
			mdForSelect.columns.put("Hidden", "pvf.Hidden");
			mdForSelect.columns.put("ShowTitle", "pvf.ShowTitle");
			mdForSelect.columns.put("Mandatory", "pvf.Mandatory");
			mdForSelect.columns.put("ExprDefault", "pa.ExprDefault");
			mdForSelect.columns.put("AttributeKind", "rkind.SysCode");
			mdForSelect.columns.put("Root", "pa.Root");
			mdForSelect.columns.put("DBColumn", "pa.DBColumn");
			mdForSelect.columns.put("Editable", "pvf.Editable");
			mdForSelect.columns.put("ViewOnly", "pvf.ViewOnly");
			mdForSelect.columns.put("Domain", "r.Domain");
			mdForSelect.columns.put("ControlType", "pvf.ControlType");
			mdForSelect.columns.put("UIPath", "pvf.UIPath");
			mdForSelect.columns.put("DataSourceView", "pvf.DataSourceView");
			mdForSelect.columns.put("LinkFilter", "pa.LinkFilter");
			mdForSelect.columns.put("ValueField", "pvf.ValueField");
			mdForSelect.columns.put("DisplayField", "pvf.DisplayField");
			mdForSelect.columns.put("PickListWidth", "pvf.PickListWidth");
			mdForSelect.columns.put("InList", "pvf.InList");
			mdForSelect.columns.put("CopyValue", "pa.CopyValue");
			mdForSelect.columns.put("CopyLinked", "pa.CopyLinked");
			mdForSelect.columns.put("DeleteLinked", "pa.DeleteLinked");
			mdForSelect.columns.put("AttrSpecType", "pa.RelationStructRole");
			mdForSelect.columns.put("Part", "pa.Part");
			mdForSelect.columns.put("MainPartID", "r.MainPartID");

			try
			{
				metaResponce = metaDB.doSelect(mdForSelect, null);
			}
			catch (Exception ex){ ex.printStackTrace(System.err); }
			
			if (metaResponce != null && metaResponce.data != null)
			{
				boolean first = true;
				while (metaResponce.data.next()) 
				{
					if (!first) {out.println(", {"); }
					else {
						first = false;
						out.println("{"); 
					}
					out.println("	name: \"" + metaResponce.data.getString("SysCode") + "\","); 
					out.println("	title: \"" + metaResponce.data.getString("Name") + "\","); 
					if (metaResponce.data.getString("ShowTitle").equals("0")) {
						out.println("	showTitle: false,"); 
					}
					if (metaResponce.data.getInt("Size") != 0) {
						out.println("	length: "	+ metaResponce.data.getInt("Size") + ","); // Universal
					}
					if (metaResponce.data.getString("Hidden").equals("1")) {
						out.println("	hidden: true,"); 
					}
					if (metaResponce.data.getString("Mandatory").equals("1")) {
						out.println("	required: true,");
					} 
//					else {
//						out.println("required:false,");
//					}
					if (metaResponce.data.getString("ExprDefault") != null) {
						out.println("	defaultValue: \""	+ metaResponce.data.getString("ExprDefault") + "\",");
					}
					if (metaResponce.data.getString("AttributeKind").equals("Pointer")) {
						out.println("	foreignKey: \"" + metaResponce.data.getString("PointedClass")	+ ".ID\",");
					}
					if (metaResponce.data.getInt("Root") > 0) {
						out.println("	rootValue: " + metaResponce.data.getInt("Root") + ",");
					}
					if (metaResponce.data.getString("DBColumn") == null) {
						out.println("	canSave: false,");
					} 
//					else {
//						out.println("canSave:true,");
//					}
					if (metaResponce.data.getString("Editable").equals("0")) {
						out.println("	canEdit: false,");
					} 
//					else {
//						out.println("canEdit:true,");
//					}
					if (metaResponce.data.getString("ViewOnly").equals("1")) {
						out.println("	ignore: true,");
					} 
//					else {
//						out.println("ignore:false,");
//					}
					if (metaResponce.data.getString("Domain") != null) {
						out.println("	valueMap: \""	+ metaResponce.data.getString("Domain") + "\",");
					}				
					if (metaResponce.data.getString("UIPath") != null) {
						out.println("	UIPath: \"" + metaResponce.data.getString("UIPath") + "\",");
					}
					if (metaResponce.data.getString("ControlType") != null) {
						out.println("	editorType: \"" + metaResponce.data.getString("ControlType") + "\",");
					}
					if (metaResponce.data.getString("DataSourceView") != null) {
						out.println("	optionDataSource: \""	+ metaResponce.data.getString("DataSourceView") + "\",");
					}
					if (metaResponce.data.getString("LinkFilter") != null) {
						out.println("	optionCriteria: \""	+ metaResponce.data.getString("LinkFilter") + "\",");
					}
					if (metaResponce.data.getString("ValueField") != null) {
						out.println("	valueField: \"" + metaResponce.data.getString("ValueField") + "\",");
					}
					if (metaResponce.data.getString("DisplayField") != null) {
						out.println("	displayField: \""	+ metaResponce.data.getString("DisplayField") + "\",");
					}
					if (metaResponce.data.getInt("PickListWidth") > 0) {
						out.println("	pickListWidth: " + metaResponce.data.getInt("PickListWidth") + ",");
					}
//					out.println("pickListFields:" + metaResponce.data.getString("name") + "}");  // TODO <<< Dedfined by corresponding DataSourceView
//					// --- CBM - specific fields
					if (metaResponce.data.getString("InList").equals("1")) {
						out.println("	inList: true,"); 
					}
					if (metaResponce.data.getString("AttrSpecType") != null) {
						out.println("	copyValue: \"" + metaResponce.data.getString("CopyValue") + "\",");
					}
					if (metaResponce.data.getString("AttrSpecType") != null) {
						out.println("	copyLinked: \"" + metaResponce.data.getString("CopyLinked") + "\",");
					}
					if (metaResponce.data.getString("AttrSpecType") != null) {
						out.println("	deleteLinked: \"" + metaResponce.data.getString("DeleteLinked") + "\",");
					}
					if (metaResponce.data.getString("AttrSpecType") != null) {
						out.println("	relationStructRole: \"" + metaResponce.data.getString("AttrSpecType") + "\",");
					}
					if (metaResponce.data.getString("Part") != null) {
						out.println("	part: \"" + metaResponce.data.getString("Part") + "\",");
					}
					if (metaResponce.data.getString("MainPartID") != null) {
						out.println("	mainPartID: \"" + metaResponce.data.getString("MainPartID") + "\",");
					}
					String type = metaResponce.data.getString("PointedClass");
					switch (type) {
						case "Integer": case "Bigint": 
							out.println("	type: \"localeInt\""); break;
						case "Decimal": case "BigDecimal": 
							out.println("	type: \"localeFloat\""); break;
						case "Money": out.println("	type: \"localeCurrency\""); break;
						case "StandardString": case "LongString": case "ShortString": 
							out.println("	type: \"text\""); break;
						case "StandardMlString": case "LongMlString": case "ShortMlString": 
							out.println("	type: \"multiLangText\""); break;
						case "Text": 
							out.println("	type: \"multiLangText\""); break;
						case "Boolean": out.println("type: \"boolean\""); break;
						case "Date": 
							out.println("	type: \"date\""); break;
						case "DateTime": 
							out.println("	type: \"datetime\""); break;
						case "TimePrecize":
							out.println("	type: \"time\""); break;
						default: out.println("	type: \""	+ metaResponce.data.getString("PointedClass") + "\"");
					}
					out.print("}"); 
				}
			}
			out.println("] })");
		}
		
		
		/**
		 * ---- The End -----------
		 */
		out.close(); 
	}

}
