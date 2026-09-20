/**
 * @author Alexander Mamchur
 */
package com.cbm.CBMPersistence;

import java.util.List;
import java.util.Map;

import com.cbm.CBMMeta.SelectTemplate;
import com.cbm.CBMServer.DSRequest;
import com.cbm.CBMServer.DSResponse;

import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;

/**
 * Async Interface for DB end-point execution (Vert.x async).
 * Used by PostgreSqlDataBase only.
 */
public interface I_DataBaseAsync 
{
	 /**
	  * Selects data from DB.
	  * Result is returned via async Handler — no JDBC references in DSResponse.
	  */
	 public void doSelect(SelectTemplate sql, DSRequest req, 
	                      Handler<AsyncResult<DSResponse>> resultHandler); 
	 
	 public void doInsert(Map<String,String[]> sql, DSRequest req,
	                      Handler<AsyncResult<DSResponse>> resultHandler); 
	 
	 public void doUpdate(Map<String,String[]> sql, DSRequest req,
	                      Handler<AsyncResult<DSResponse>> resultHandler); 
	 
	 public void doDelete(List<String> sql, DSRequest req,
	                      Handler<AsyncResult<DSResponse>> resultHandler); 
	 
	 /**
	  * Default implementation - does nothing.
	  */
	 default void doStartTrans(Handler<AsyncResult<Void>> resultHandler) {
		 resultHandler.handle(Future.succeededFuture());
	 }
	 
	 /**
	  * Default implementation - does nothing.
	  */
	 default void doCommit(Handler<AsyncResult<Void>> resultHandler) {
		 resultHandler.handle(Future.succeededFuture());
	 }
	 
	 /**
	  * Default implementation - returns failure.
	  */
	 default void executeDirect(String sql, Handler<AsyncResult<DSResponse>> resultHandler) {
		 DSResponse response = new DSResponse();
		 response.retCode = -1;
		 response.retMsg = "executeDirect not implemented";
		 resultHandler.handle(Future.succeededFuture(response));
	 }
	 
	 /**
	  * Default implementation - returns -1.
	  */
	 default void executeDirectSimple(String sql, Handler<AsyncResult<Integer>> resultHandler) {
		 resultHandler.handle(Future.succeededFuture(-1));
	 }
}
