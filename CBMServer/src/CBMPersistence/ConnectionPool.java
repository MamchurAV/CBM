package CBMPersistence;

import javax.sql.DataSource;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import CBMServer.CBMStart;


public class ConnectionPool {
	
	private  static String dbDriver;
	private  static String dbURL;
	private  static String dbUs;
	private  static String dbCred;
	
    private static DataSource datasource;
    
    static {
        dbDriver = CBMStart.getParam("primaryDBDriver");
    	dbURL = CBMStart.getParam("primaryDBUrl");
    	dbUs = CBMStart.getParam("primaryDBUs");
    	dbCred = CBMStart.getParam("primaryDBCred");

    	// Initialize single instance of DataSource, that represents Connection Pol to clients
	    HikariConfig config = new HikariConfig();

	    config.setDriverClassName(dbDriver);
	    config.setJdbcUrl(dbURL);
	    config.setUsername(dbUs);
	    config.setPassword(dbCred);
	    
	    config.setMaximumPoolSize(10);
	    config.setAutoCommit(true); // <<< TODO: switch to managed transactions (broken when Conn.Pool become been used)
	    
	    config.setConnectionTestQuery("SELECT 1");

//	    config.addDataSourceProperty("cachePrepStmts", "true");
//	    config.addDataSourceProperty("prepStmtCacheSize", "250");
//	    config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
	    
	    datasource = new HikariDataSource(config);
    }
    
	
    public ConnectionPool(String a_dbDriver, String a_dbUrl, String a_dbUs, String a_dbCred){
        dbDriver = a_dbDriver;
		dbURL = a_dbUrl;
		dbUs = a_dbUs;
		dbCred = a_dbCred;
	}

   
    public static DataSource getDataSource()  {
		return datasource;
    }
}
