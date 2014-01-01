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
 *
 */
public interface I_StorageMetaData {

	public String getDataBase(DSRequest req);
	public SelectTemplate getSelect(DSRequest req) throws SQLException;
//	public InsertTemplate getInsert(String dataType) throws SQLException;
//	public UpdateTemplate getUpdate(String dataType) throws SQLException;
//	public DeleteTemplate getDelete(String dataType) throws SQLException;
	public Map<String,String[]> getColumnsInfo(DSRequest req) throws SQLException;
	public List<String> getDelete(DSRequest req) throws SQLException;

}
