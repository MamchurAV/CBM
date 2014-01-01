/**
 * 
 */
package CBMPersistence;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

import CBMServer.I_IDProvider;

/**
 * @author user
 *
 */
public class DB2IDProvider implements I_IDProvider {

	static String dbURL;
	static Connection dbCon;

	static {
		try 
		{
			Class.forName("com.ibm.db2.jcc.DB2Driver");
			// Define the data source for the driver
			dbURL = "jdbc:db2://localhost:50000/CBM_TMP"; // <<< TODO Tern this to configurable  
			dbCon = DriverManager.getConnection(dbURL, "CBM", "cbm");
		} catch (Exception e) 
		{
			e.printStackTrace();
		}
	}

	/**
	 * ------------ Interface implementation -----------------------
	 */
	@Override
	public long GetID(int pool) 
	{
		long out = 0l;
		if (pool<1)
		{
			return -1;
		}
		try
		{
			Statement statement = dbCon.createStatement();
			dbCon.setAutoCommit(false);
			dbCon.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED);
			ResultSet rs = statement.executeQuery("SELECT id FROM cbm.identifier");
			rs.next();
			out = rs.getLong(1) + 1;
			statement.executeUpdate("UPDATE cbm.identifier SET id=id+" + String.valueOf(pool));
			statement.executeUpdate("COMMIT");
		} catch (Exception e) {
			e.printStackTrace();
		}

		return out;
	}
}
