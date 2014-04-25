/**
 * Persistent storage Metadata
 */
package CBMMeta;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import CBMServer.DSRequest;

/**
 * @author Alexander Mamchur
 * Interface that must be provided by MetaData component concerning Data Storage information.
 */
public interface I_StorageMetaData {

	public String getDataBase(DSRequest req);
	public SelectTemplate getSelect(String code) throws SQLException;
	public SelectTemplate getSelect(DSRequest req) throws SQLException;
	public MetaClass getMetaClass(String code) throws SQLException;
//	public InsertTemplate getInsert(String dataType) throws SQLException;
//	public UpdateTemplate getUpdate(String dataType) throws SQLException;
//	public DeleteTemplate getDelete(String dataType) throws SQLException;
	public Map<String,String[]> getColumnsInfo(DSRequest req) throws SQLException;
	public List<String> getDelete(DSRequest req) throws SQLException;

}
