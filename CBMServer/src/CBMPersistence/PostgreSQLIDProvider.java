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
public class PostgreSQLIDProvider implements I_IDProvider {

	static String dbURL;
	static Connection dbCon;

	static {
		try 
		{
			Class.forName("org.postgresql.Driver");
			// Define the data source for the driver
			dbURL = "jdbc:postgresql://localhost/CBM";
			dbCon = DriverManager.getConnection(dbURL, "CBM", "zxgauvs2");
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
