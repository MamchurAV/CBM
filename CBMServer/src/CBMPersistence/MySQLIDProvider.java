/**
 * 
 */
package CBMPersistence;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import CBMServer.I_IDProvider;

/**
 * @author user
 *
 */
public class MySQLIDProvider implements I_IDProvider {

	static String dbURL;
	static Connection dbCon;

	static {
		try 
		{
			Class.forName("com.mysql.jdbc.Driver").newInstance();			
			// Define the data source for the driver
			dbURL = "jdbc:mysql://localhost/CBM?"; // <<< TODO Turn this to configurable  
			dbCon = DriverManager.getConnection(dbURL, "CBM", "cbm");
			dbCon.setAutoCommit(false);
			dbCon.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED);
		} catch (SQLException ex) {
			// handle any errors
			System.out.println("SQLException: " + ex.getMessage());
			System.out.println("SQLState: " + ex.getSQLState());
			System.out.println("VendorError: " + ex.getErrorCode());
		} catch (Exception ex) {
			ex.printStackTrace();
		}	
	}

	/**
	 * ------------ Interface implementation -----------------------
	 */
	@Override
	public long GetID(int pool) 
	{
		long out = 0l;
		long next;
		Statement stmt1 = null;
		Statement stmt2 = null;
		ResultSet rs = null;
		if (pool<1)
		{
			return -1;
		}
		try
		{
			stmt1 = dbCon.createStatement();
			rs = stmt1.executeQuery("SELECT id FROM cbm.identifier");
			rs.next();
			out = rs.getLong(1);
			next = out + pool; 
			stmt2 = dbCon.createStatement();
			stmt2.executeUpdate("UPDATE cbm.identifier SET id=" + String.valueOf(next));
//			stmt.executeUpdate("COMMIT");
			dbCon.commit();
		} catch (Exception e) {
			e.printStackTrace();
		}finally {
		    try { if (rs != null) rs.close(); } catch (Exception e) {};
		    try { if (stmt1 != null) stmt1.close(); } catch (Exception e) {};
		    try { if (stmt2 != null) stmt2.close(); } catch (Exception e) {};
//		    try { if (conn != null) conn.close(); } catch (Exception e) {};
		}

		return (out + 1);
	}
}
