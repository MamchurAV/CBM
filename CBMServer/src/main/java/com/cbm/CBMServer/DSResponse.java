/**
 * 
 */
package com.cbm.CBMServer;

import java.util.List;
import java.util.Map;

/**
 * @author Alexander Mamchur
 * Represents unified client response (no JDBC references).
 */
public class DSResponse {
	
    public int totalRows; 
    public int retCode;
    public String retMsg = "OK"; 
    
    /** Материализованные строки данных: каждая строка — Map<columnAlias, value> */
    public List<Map<String, Object>> dataRows; 
    
    /** Возвращаемое число из executeUpdate (affected rows) */
    public int updateCount;
    
    /** Для транзакций — ссылаемся на PgTransaction */
    public transient Object transaction;
}
