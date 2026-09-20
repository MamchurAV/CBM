package com.cbm.CBMPersistence;

import com.cbm.Main;
import io.vertx.core.Vertx;
import io.vertx.ext.jdbc.JDBCClient;

import javax.sql.DataSource;
import com.zaxxer.hikari.HikariDataSource;

public class ConnectionPool {
	
    private static String dbURL;
    private static String dbUs;
    private static String dbCred;
    
    private static JDBCClient jdbcClient;
    private static DataSource dataSource;
    private static Vertx vertx;
    
    /**
     * Инициализация пула при старте Vert.x.
     * Вызвать один раз из CBMVerticle.start().
     */
    public static void init(Vertx vertxInstance) {
    	ConnectionPool.vertx = vertxInstance;
    	
        dbURL = Main.getParam("primaryDBUrl");
        dbUs = Main.getParam("primaryDBUs");
        dbCred = Main.getParam("primaryDBCred");
        
        // Создаём DataSource для работы с PostgreSQL
        dataSource = new HikariDataSource();
        ((HikariDataSource) dataSource).setJdbcUrl(dbURL);
        ((HikariDataSource) dataSource).setUsername(dbUs);
        ((HikariDataSource) dataSource).setPassword(dbCred);
        ((HikariDataSource) dataSource).setDriverClassName("org.postgresql.Driver");
        ((HikariDataSource) dataSource).setMaximumPoolSize(10);
        
        // Создаём JDBCClient для работы с PostgreSQL
        jdbcClient = JDBCClient.createShared(vertxInstance, new io.vertx.core.json.JsonObject()
            .put("url", dbURL)
            .put("user", dbUs)
            .put("password", dbCred)
            .put("driver_class", "org.postgresql.Driver")
            .put("max_pool_size", 10)
        );
    }
    
    public static JDBCClient getJDBCClient() {
        if (jdbcClient == null) {
            throw new IllegalStateException("ConnectionPool not initialized. Call ConnectionPool.init(vertx) first.");
        }
        return jdbcClient;
    }
    
    public static DataSource getDataSource() {
        if (dataSource == null) {
            throw new IllegalStateException("ConnectionPool not initialized. Call ConnectionPool.init(vertx) first.");
        }
        return dataSource;
    }
    
    /**
     * Закрыть пул при остановке Vert.x.
     */
    public static void shutdown() {
        if (jdbcClient != null) {
            jdbcClient.close();
        }
        if (dataSource != null) {
            ((HikariDataSource) dataSource).close();
        }
    }
}
