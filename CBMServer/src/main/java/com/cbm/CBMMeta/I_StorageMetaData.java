/**
 * Persistent storage Metadata
 */
package com.cbm.CBMMeta;

import java.util.List;
import java.util.Map;

import com.cbm.CBMServer.DSRequest;

/**
 * @author Alexander Mamchur
 * Interface that must be provided by MetaData component concerning Data Storage information.
 */
public interface I_StorageMetaData {

	public String getDataBase(DSRequest req);
	public SelectTemplate getSelect(String code);
	public SelectTemplate getSelect(DSRequest req);
	public Map<String,String[]> getColumnsInfo(DSRequest req);
	public List<String> getDelete(DSRequest req);

}
