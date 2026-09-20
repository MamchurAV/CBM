/**
 * @author Alexander Mamchur
 */
package com.cbm.CBMPersistence;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.cbm.CBMMeta.ColumnInfo;
import com.cbm.CBMMeta.SelectTemplate;
import com.cbm.CBMServer.DSRequest;
import com.cbm.CBMServer.DSResponse;
import com.cbm.CBMUtils.StringHelper;

import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.json.JsonArray;
import io.vertx.ext.jdbc.JDBCClient;
import io.vertx.ext.sql.SQLConnection;

/**
 * DataBase operations on PostgreSQL DBMS (Vert.x async via JDBCClient).
 */
public class PostgreSqlDataBase implements I_DataBaseAsync {

    private static final String ID = "id";

    // ======================== doSelect ========================
    @Override
    public void doSelect(SelectTemplate selTempl, DSRequest dsRequest,
                         Handler<AsyncResult<DSResponse>> resultHandler) {
        
        String sqlCount = "";
        StringBuilder sqlBuilder = new StringBuilder();
        
        try {
            // --- Build select part ---
            String selectPart = "";
            for (ColumnInfo entry : selTempl.columns) {
                if (!entry.dbColumn.equals("null")) {
                    selectPart += entry.dbColumn + " as \"" + entry.sysCode + "\", ";
                }
            }
            
            if (selectPart.length() < 2) {
                DSResponse response = new DSResponse();
                response.retCode = -1;
                response.retMsg = "No metadata for <" + dsRequest.dataSource + "> found.";
                resultHandler.handle(Future.succeededFuture(response));
                return;
            }
            
            selectPart = selectPart.substring(0, selectPart.length() - 2);
            
            // --- From ---
            String fromPart = selTempl.from;
            
            // --- Where ---
            String wherePart = "1=1 ";
            if (selTempl.where != null) {
                wherePart = selTempl.where;
            }
            wherePart += SqlFormatter.prepareWhere(selTempl, dsRequest);
            
            // --- Group by ---
            String groupPart = "";
            if (selTempl.groupby != null) {
                groupPart = selTempl.groupby;
            }
            
            // --- Having ---
            String havingPart = "";
            if (groupPart.length() > 0 && selTempl.having != null) {
                havingPart = selTempl.having;
            }
            
            // --- Order by ---
            String orderPart = "";
            if (dsRequest != null && dsRequest.sortBy != null && !dsRequest.sortBy.isEmpty()) {
                for (int i = 0; i < dsRequest.sortBy.size(); i++) {
                    String odrCol = dsRequest.sortBy.get(i);
                    String desc = "";
                    if (odrCol.startsWith("-")) {
                        desc = " desc";
                        odrCol = odrCol.substring(1);
                    }
                    final String odrColName = odrCol;
                    String col = selTempl.columns.stream()
                            .filter(c -> c.sysCode.equals(odrColName))
                            .findFirst()
                            .get()
                            .dbColumn;
                    if (col != null) {
                        orderPart += col + desc + ", ";
                    }
                }
            }
            
            if (orderPart.length() == 0 && !StringHelper.IsNullOrWhiteSpace(selTempl.orderby)) {
                orderPart += selTempl.orderby;
            } else {
                String firstTableAlias = fromPart.split(" ")[1];
                orderPart += firstTableAlias + ".id";
            }
            
            // --- Build main query ---
            sqlBuilder.append("SELECT ").append(selectPart).append(" FROM ").append(fromPart);
            sqlBuilder.append(" WHERE ").append(wherePart);
            
            if (groupPart.isEmpty()) {
                // NOP
            } else {
                sqlBuilder.append(" GROUP BY ").append(groupPart);
                if (!havingPart.isEmpty()) {
                    sqlBuilder.append(" HAVING ").append(havingPart);
                }
            }
            
            sqlBuilder.append(" ORDER BY ").append(orderPart);
            
            // --- Paging ---
            boolean needCount = false;
            if (dsRequest != null && dsRequest.endRow != 0) {
                needCount = true;
                sqlCount = "SELECT count(*) FROM " + fromPart + 
                           (wherePart.length() > 0 ? " WHERE " + wherePart : "");
                
                sqlBuilder.append(" LIMIT ").append(dsRequest.endRow - dsRequest.startRow)
                          .append(" OFFSET ").append(dsRequest.startRow);
            }
            
            JDBCClient client = ConnectionPool.getJDBCClient();
            
            if (needCount) {
                // Извлекаем имена колонок из selectPart для конвертации результатов
                final String[] columnNames = parseColumnNames(selectPart);
                
                // Сначала считаем общее количество
                client.query(sqlCount, countRs -> {
                    if (countRs.succeeded()) {
                        final int[] totalRows = {0};
                        if (!countRs.result().getResults().isEmpty()) {
                            totalRows[0] = ((Number) ((JsonArray) countRs.result().getResults().get(0)).getValue(0)).intValue();
                        }
                        
                        // Теперь основной запрос
                        client.query(sqlBuilder.toString(), rowSet -> {
                            if (rowSet.succeeded()) {
                                DSResponse response = new DSResponse();
                                response.totalRows = totalRows[0];
                                response.retCode = 0;
                                response.dataRows = convertJsonArrayToMapList(rowSet.result().getResults(), columnNames);
                                resultHandler.handle(Future.succeededFuture(response));
                            } else {
                                DSResponse response = new DSResponse();
                                response.retCode = -1;
                                response.retMsg = "SELECT error: " + rowSet.cause().getMessage();
                                resultHandler.handle(Future.succeededFuture(response));
                            }
                        });
                    } else {
                        DSResponse response = new DSResponse();
                        response.retCode = -1;
                        response.retMsg = "COUNT error: " + countRs.cause().getMessage();
                        resultHandler.handle(Future.succeededFuture(response));
                    }
                });
            } else {
                String[] columnNames = parseColumnNames(selectPart);
                client.query(sqlBuilder.toString(), rowSet -> {
                    if (rowSet.succeeded()) {
                        DSResponse response = new DSResponse();
                        response.totalRows = rowSet.result().getResults().size();
                        response.retCode = 0;
                        response.dataRows = convertJsonArrayToMapList(rowSet.result().getResults(), columnNames);
                        resultHandler.handle(Future.succeededFuture(response));
                    } else {
                        DSResponse response = new DSResponse();
                        response.retCode = -1;
                        response.retMsg = "SELECT error: " + rowSet.cause().getMessage();
                        resultHandler.handle(Future.succeededFuture(response));
                    }
                });
            }
            
        } catch (Exception e) {
            DSResponse response = new DSResponse();
            response.retCode = -1;
            response.retMsg = "doSelect build error: " + e.getMessage();
            resultHandler.handle(Future.succeededFuture(response));
        }
    }

    // ======================== doInsert ========================
    @Override
    public void doInsert(Map<String, String[]> insTempl, DSRequest dsRequest,
                         Handler<AsyncResult<DSResponse>> resultHandler) {
        
        try {
            // Discover tables
            List<String> tables = new ArrayList<>();
            if (dsRequest.data != null && dsRequest.data.data != null) {
                for (Map.Entry<String, Object> entry : dsRequest.data.data.entrySet()) {
                    String[] colInfo = insTempl.get(entry.getKey());
                    if (colInfo != null) {
                        String table = colInfo[1].toLowerCase();
                        if (!tables.contains(table)) {
                            tables.add(table);
                        }
                    }
                }
            }
            
            // Process each table
            executeInsertForTables(tables, insTempl, dsRequest, 0, resultHandler);
            
        } catch (Exception e) {
            DSResponse response = new DSResponse();
            response.retCode = -1;
            response.retMsg = "doInsert error: " + e.getMessage();
            resultHandler.handle(Future.succeededFuture(response));
        }
    }
    
    /**
     * Вспомогательный метод для вставки в несколько таблиц.
     */
    private void executeInsertForTables(List<String> tables, Map<String, String[]> insTempl,
                                        DSRequest dsRequest, int tableIdx,
                                        Handler<AsyncResult<DSResponse>> resultHandler) {
        
        if (tableIdx >= tables.size()) {
            // Все таблицы обработаны
            DSResponse response = new DSResponse();
            response.retCode = 0;
            resultHandler.handle(Future.succeededFuture(response));
            return;
        }
        
        String table = tables.get(tableIdx);
        String sql = "INSERT INTO " + table + " (";
        String columnsPart = "";
        String valuesPart = "";
        JsonArray params = new JsonArray();
        
        String idValue = null;
        
        if (dsRequest.data != null && dsRequest.data.data != null) {
            for (Map.Entry<String, Object> entry : dsRequest.data.data.entrySet()) {
                String[] colInfo = insTempl.get(entry.getKey());
                if (colInfo != null && colInfo[1].toLowerCase().equals(table)) {
                    columnsPart += colInfo[0] + ", ";
                    
                    if (entry.getValue() == null) {
                        params.addNull();
                        valuesPart += "null, ";
                    } else {
                        String val = entry.getValue().toString();
                        
                        if (colInfo[0].toLowerCase().equals(ID)) {
                            idValue = val;
                        }
                        
                        if (colInfo[2].equals("Boolean")) {
                            if (val.equals("true")) { val = "1"; }
                            else if (val.equals("false")) { val = "0"; }
                        }
                        
                        if (val.equalsIgnoreCase("null") ||
                            colInfo[2].equals("Integer") ||
                            colInfo[2].equals("Bigint") ||
                            colInfo[2].equals("Decimal") ||
                            colInfo[2].equals("Money") ||
                            colInfo[2].equals("BigDecimal")) {
                            params.add(val);
                            valuesPart += val + ", ";
                        } else {
                            params.add(val);
                            valuesPart += "?, ";
                        }
                    }
                }
            }
        }
        
        if (columnsPart.length() < 2) {
            DSResponse response = new DSResponse();
            response.retCode = -1;
            response.retMsg = "No columns for table <" + table + ">";
            resultHandler.handle(Future.succeededFuture(response));
            return;
        }
        
        // Handle ID
        if (!columnsPart.toUpperCase().startsWith("ID, ")) {
            columnsPart = "id, " + columnsPart;
            if (idValue == null) idValue = "0";
            valuesPart = "?, " + valuesPart;
            params.add(0, idValue);
        }
        
        sql += columnsPart.substring(0, columnsPart.length() - 2) + 
               ") VALUES (" + valuesPart.substring(0, valuesPart.length() - 2) + ")";
        
        final String sqlInsert = sql;
        
        JDBCClient client = ConnectionPool.getJDBCClient();
        
        client.getConnection(connRes -> {
            if (connRes.succeeded()) {
                SQLConnection connection = connRes.result();
                try {
                    java.sql.Connection jdbcConnection = connection.unwrap();
                    java.sql.PreparedStatement pstmt = jdbcConnection.prepareStatement(sqlInsert);
                    
                    // Set parameters
                    if (params != null) {
                        for (int i = 0; i < params.size(); i++) {
                            pstmt.setObject(i + 1, params.getValue(i));
                        }
                    }
                    
                    pstmt.executeUpdate();
                    pstmt.close();
                    connection.close();
                    
                    // Переходим к следующей таблице
                    executeInsertForTables(tables, insTempl, dsRequest, tableIdx + 1, resultHandler);
                } catch (Exception e) {
                    try { connection.close(); } catch (Exception ex) {}
                    DSResponse response = new DSResponse();
                    response.retCode = -1;
                    response.retMsg = "INSERT error in table <" + table + ">: " + e.getMessage();
                    resultHandler.handle(Future.succeededFuture(response));
                }
            } else {
                DSResponse response = new DSResponse();
                response.retCode = -1;
                response.retMsg = "INSERT error: " + connRes.cause().getMessage();
                resultHandler.handle(Future.succeededFuture(response));
            }
        });
    }

    // ======================== doUpdate ========================
    @Override
    public void doUpdate(Map<String, String[]> updTempl, DSRequest dsRequest,
                         Handler<AsyncResult<DSResponse>> resultHandler) {
        
        try {
            List<String> tables = new ArrayList<>();
            
            if (dsRequest.data != null && dsRequest.data.data != null) {
                for (Map.Entry<String, Object> entry : dsRequest.data.data.entrySet()) {
                    String sysCode = entry.getKey();
                    if (!dsRequest.data.data.containsKey(sysCode)) continue;
                    
                    Object v1 = dsRequest.data.data.get(sysCode);
                    Object v2 = (dsRequest.oldValues != null) ? dsRequest.oldValues.get(sysCode) : null;
                    
                    if ((v1 != null && v1.equals(v2)) || (v1 == null && v2 == null)) {
                        continue;
                    }
                    
                    String[] colInfo = updTempl.get(sysCode);
                    if (colInfo != null) {
                        String table = colInfo[1].toLowerCase();
                        if (!tables.contains(table)) {
                            tables.add(table);
                        }
                    }
                }
            }
            
            executeUpdateForTables(tables, updTempl, dsRequest, 0, resultHandler);
            
        } catch (Exception e) {
            DSResponse response = new DSResponse();
            response.retCode = -1;
            response.retMsg = "doUpdate error: " + e.getMessage();
            resultHandler.handle(Future.succeededFuture(response));
        }
    }
    
    private void executeUpdateForTables(List<String> tables, Map<String, String[]> updTempl,
                                        DSRequest dsRequest, int tableIdx,
                                        Handler<AsyncResult<DSResponse>> resultHandler) {
        
        if (tableIdx >= tables.size()) {
            DSResponse response = new DSResponse();
            response.retCode = 0;
            resultHandler.handle(Future.succeededFuture(response));
            return;
        }
        
        String table = tables.get(tableIdx);
        String sql = "UPDATE " + table + " SET ";
        String updatePart = "";
        String wherePart = "";
        JsonArray params = new JsonArray();
        
        String idValue = null;
        
        if (dsRequest.data != null && dsRequest.data.data != null) {
            for (Map.Entry<String, Object> entry : dsRequest.data.data.entrySet()) {
                String[] colInfo = updTempl.get(entry.getKey());
                if (colInfo != null && colInfo[1].toLowerCase().equals(table)) {
                    String colName = colInfo[0];
                    
                    if (colName.toLowerCase().equals(ID) ||
                        entry.getKey().toLowerCase().equals(ID)) {
                        idValue = entry.getValue().toString();
                        wherePart += "id = ?";
                        params.add(idValue);
                    } else {
                        if (entry.getValue() == null) {
                            updatePart += colName + " = null, ";
                        } else {
                            String val = entry.getValue().toString();
                            if (colInfo[2].equals("Boolean")) {
                                if (val.equals("true")) { val = "1"; }
                                else if (val.equals("false")) { val = "0"; }
                            }
                            
                            if (val.equalsIgnoreCase("null") ||
                                colInfo[2].equals("Integer") ||
                                colInfo[2].equals("Bigint") ||
                                colInfo[2].equals("Decimal") ||
                                colInfo[2].equals("Money") ||
                                colInfo[2].equals("BigDecimal")) {
                                params.add(val);
                                updatePart += colName + " = ?, ";
                            } else {
                                params.add(val);
                                updatePart += colName + " = ?, ";
                            }
                        }
                    }
                }
            }
        }
        
        if (updatePart.length() < 2) {
            DSResponse response = new DSResponse();
            response.retCode = -1;
            response.retMsg = "No columns to update in table <" + table + ">";
            resultHandler.handle(Future.succeededFuture(response));
            return;
        }
        
        if (wherePart.isEmpty()) {
            wherePart = "id = ?";
            params.add(idValue != null ? idValue : "0");
        }
        
        sql += updatePart.substring(0, updatePart.length() - 2) + " WHERE " + wherePart;
        
        final String sqlUpdate = sql;
        
        JDBCClient client = ConnectionPool.getJDBCClient();
        
        client.getConnection(connRes -> {
            if (connRes.succeeded()) {
                SQLConnection connection = connRes.result();
                try {
                    java.sql.Connection jdbcConnection = connection.unwrap();
                    java.sql.PreparedStatement pstmt = jdbcConnection.prepareStatement(sqlUpdate);
                    
                    // Set parameters
                    if (params != null) {
                        for (int i = 0; i < params.size(); i++) {
                            pstmt.setObject(i + 1, params.getValue(i));
                        }
                    }
                    
                    pstmt.executeUpdate();
                    pstmt.close();
                    connection.close();
                    
                    executeUpdateForTables(tables, updTempl, dsRequest, tableIdx + 1, resultHandler);
                } catch (Exception e) {
                    try { connection.close(); } catch (Exception ex) {}
                    DSResponse response = new DSResponse();
                    response.retCode = -1;
                    response.retMsg = "UPDATE error in table <" + table + ">: " + e.getMessage();
                    resultHandler.handle(Future.succeededFuture(response));
                }
            } else {
                DSResponse response = new DSResponse();
                response.retCode = -1;
                response.retMsg = "UPDATE error: " + connRes.cause().getMessage();
                resultHandler.handle(Future.succeededFuture(response));
            }
        });
    }

    // ======================== doDelete ========================
    @Override
    public void doDelete(List<String> tables, DSRequest dsRequest,
                         Handler<AsyncResult<DSResponse>> resultHandler) {
        
        try {
            if (tables == null || tables.isEmpty()) {
                DSResponse response = new DSResponse();
                response.retCode = 0;
                resultHandler.handle(Future.succeededFuture(response));
                return;
            }
            
            executeDeleteForTables(tables, dsRequest, 0, resultHandler);
            
        } catch (Exception e) {
            DSResponse response = new DSResponse();
            response.retCode = -1;
            response.retMsg = "doDelete error: " + e.getMessage();
            resultHandler.handle(Future.succeededFuture(response));
        }
    }
    
    private void executeDeleteForTables(List<String> tables, DSRequest dsRequest,
                                        int tableIdx, Handler<AsyncResult<DSResponse>> resultHandler) {
        
        if (tableIdx >= tables.size()) {
            DSResponse response = new DSResponse();
            response.retCode = 0;
            resultHandler.handle(Future.succeededFuture(response));
            return;
        }
        
        String table = tables.get(tableIdx);
        
        // Find ID
        String id = "";
        String tableBase = table.substring(table.indexOf(".") + 1);
        
        if (dsRequest.data != null && dsRequest.data.data != null) {
            for (Map.Entry<String, Object> entry : dsRequest.data.data.entrySet()) {
                String key = entry.getKey().toLowerCase();
                if (key.equals(tableBase + ID) || key.equals(ID)) {
                    id = entry.getValue().toString();
                    break;
                }
            }
        }
        
        String sql = "DELETE FROM " + table + " WHERE id = ?";
        JsonArray params = new JsonArray();
        params.add(id);
        
        final String idFinal = id;
        
        JDBCClient client = ConnectionPool.getJDBCClient();
        
        client.getConnection(connRes -> {
            if (connRes.succeeded()) {
                SQLConnection connection = connRes.result();
                try {
                    java.sql.Connection jdbcConnection = connection.unwrap();
                    java.sql.PreparedStatement pstmt = jdbcConnection.prepareStatement(sql);
                    pstmt.setObject(1, idFinal);
                    pstmt.executeUpdate();
                    pstmt.close();
                    connection.close();
                    executeDeleteForTables(tables, dsRequest, tableIdx + 1, resultHandler);
                } catch (Exception e) {
                    try { connection.close(); } catch (Exception ex) {}
                    DSResponse response = new DSResponse();
                    response.retCode = -1;
                    response.retMsg = "DELETE error in table <" + table + ">: " + e.getMessage();
                    resultHandler.handle(Future.succeededFuture(response));
                }
            } else {
                DSResponse response = new DSResponse();
                response.retCode = -1;
                response.retMsg = "DELETE error: " + connRes.cause().getMessage();
                resultHandler.handle(Future.succeededFuture(response));
            }
        });
    }

    // ======================== doStartTrans ========================
    @Override
    public void doStartTrans(Handler<AsyncResult<Void>> resultHandler) {
        // В JDBCClient транзакции управляются через connection
        // В текущей архитектуре транзакции управляются на уровне DataAccessService
        resultHandler.handle(Future.succeededFuture());
    }

    // ======================== doCommit ========================
    @Override
    public void doCommit(Handler<AsyncResult<Void>> resultHandler) {
        // В текущей архитектуре транзакции управляются на уровне DataAccessService
        resultHandler.handle(Future.succeededFuture());
    }

    // ======================== executeDirect ========================
    @Override
    public void executeDirect(String sql, Handler<AsyncResult<DSResponse>> resultHandler) {
        JDBCClient client = ConnectionPool.getJDBCClient();
        
        client.getConnection(connRes -> {
            if (connRes.succeeded()) {
                SQLConnection connection = connRes.result();
                try {
                    java.sql.Connection jdbcConnection = connection.unwrap();
                    java.sql.Statement stmt = jdbcConnection.createStatement();
                    stmt.executeUpdate(sql);
                    stmt.close();
                    connection.close();
                    
                    DSResponse response = new DSResponse();
                    response.retCode = 0;
                    resultHandler.handle(Future.succeededFuture(response));
                } catch (Exception e) {
                    try { connection.close(); } catch (Exception ex) {}
                    DSResponse response = new DSResponse();
                    response.retCode = -1;
                    response.retMsg = "executeDirect error: " + e.getMessage();
                    resultHandler.handle(Future.succeededFuture(response));
                }
            } else {
                DSResponse response = new DSResponse();
                response.retCode = -1;
                response.retMsg = "executeDirect error: " + connRes.cause().getMessage();
                resultHandler.handle(Future.succeededFuture(response));
            }
        });
    }

    // ======================== executeDirectSimple ========================
    @Override
    public void executeDirectSimple(String sql, Handler<AsyncResult<Integer>> resultHandler) {
        JDBCClient client = ConnectionPool.getJDBCClient();
        
        client.getConnection(connRes -> {
            if (connRes.succeeded()) {
                SQLConnection connection = connRes.result();
                try {
                    java.sql.Connection jdbcConnection = connection.unwrap();
                    java.sql.Statement stmt = jdbcConnection.createStatement();
                    int updateCount = stmt.executeUpdate(sql);
                    stmt.close();
                    connection.close();
                    
                    resultHandler.handle(Future.succeededFuture(updateCount));
                } catch (Exception e) {
                    try { connection.close(); } catch (Exception ex) {}
                    resultHandler.handle(Future.succeededFuture(-1));
                }
            } else {
                resultHandler.handle(Future.succeededFuture(-1));
            }
        });
    }
    
    // ======================== Helper methods ========================
    
    /**
     * Извлекает имена колонок из selectPart.
     * Формат selectPart: "col1 as \"alias1\", col2 as \"alias2\""
     * Возвращает массив алиасов: ["alias1", "alias2"]
     */
    private String[] parseColumnNames(String selectPart) {
        if (selectPart == null || selectPart.isEmpty()) {
            return new String[0];
        }
        String[] parts = selectPart.split(", ");
        String[] aliases = new String[parts.length];
        for (int i = 0; i < parts.length; i++) {
            String part = parts[i].trim();
            // Ищем "as \"alias\"" или просто "alias"
            int asIndex = part.toLowerCase().indexOf(" as ");
            if (asIndex != -1) {
                String alias = part.substring(asIndex + 4).trim();
                // Убираем кавычки
                if (alias.startsWith("\"") && alias.endsWith("\"")) {
                    alias = alias.substring(1, alias.length() - 1);
                }
                aliases[i] = alias;
            } else {
                aliases[i] = part;
            }
        }
        return aliases;
    }
    
    /**
     * Конвертирует List<JsonArray> в List<Map<String, Object>> используя имена колонок.
     */
    private List<Map<String, Object>> convertJsonArrayToMapList(List<JsonArray> jsonArrayList, String[] columnNames) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (JsonArray row : jsonArrayList) {
            Map<String, Object> map = new HashMap<>();
            for (int i = 0; i < row.size() && i < columnNames.length; i++) {
                map.put(columnNames[i], row.getValue(i));
            }
            result.add(map);
        }
        return result;
    }
}
