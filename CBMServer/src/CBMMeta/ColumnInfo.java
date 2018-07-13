package CBMMeta;

public class ColumnInfo {
	public String sysCode;
	public String dbTable;
	public String dbColumn;
	public String relatedType;
	
	/**
	 * Partly initialising constructor
	 * @param sysCode
	 * @param dbColumn
	 * @param relatedType
	 */
	public ColumnInfo(String sysCode, String dbColumn, String relatedType){
		this.sysCode = sysCode;
		this.dbColumn = dbColumn;
		this.relatedType = relatedType;
	}
	
	/**
	 * Full constructor
	 * @param sysCode
	 * @param dbTable
	 * @param dbColumn
	 * @param relatedType
	 */
	public ColumnInfo(String sysCode, String dbTable, String dbColumn, String relatedType){
		this.sysCode = sysCode;
		this.dbTable = dbTable;
		this.dbColumn = dbColumn;
		this.relatedType = relatedType;
	}
}
