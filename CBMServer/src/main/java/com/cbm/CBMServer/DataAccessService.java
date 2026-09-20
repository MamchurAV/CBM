/**
 * @author Alexander Mamchur
 *
 */
package com.cbm.CBMServer;

import com.cbm.CBMMeta.I_StorageMetaData;
import com.cbm.CBMMeta.StorageMetaData;
import com.cbm.CBMPersistence.I_DataBaseAsync;
import com.cbm.CBMPersistence.PostgreSqlDataBase;
import com.cbm.CBMUtils.CBMServerMessages;
import com.cbm.CBMUtils.CredentialsManager;
import com.cbm.CBMUtils.I_AutentificationManager;
import com.cbm.CBMServer.DSResponse;
import com.cbm.Main;

import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.Promise;
import io.vertx.ext.web.RoutingContext;

import java.util.ArrayList;
import java.util.List;

/**
 * Main data_access-like operations provider (Vert.x async).
 */
public class DataAccessService {
	private DSTransaction dsTransaction = new DSTransaction();
	private I_ClientIOFormatter clientIOFormatter = new IscIOFormatter();
	private I_StorageMetaData metaProvider = new StorageMetaData();
	private I_AutentificationManager credMan = new CredentialsManager();
	
	private RoutingContext request;
	private I_DataBaseAsync currentDB;

	public DataAccessService(RoutingContext requestParam) {
		this.request = requestParam;
		
		// Определяем тип БД
		String dbName = null;
		try {
			dbName = metaProvider.getDataBase(dsTransaction.operations.get(0));
		} catch (Exception e) {
			// ignore
		}
		if (dbName == null) {
			dbName = Main.getParam("primaryDBType");
		}
		
		switch (dbName) {
		case "PostgreSql":
			currentDB = new PostgreSqlDataBase();
			break;
		default:
			currentDB = new PostgreSqlDataBase();
			break;
		}
	}

	/**
	 * Асинхронная обработка запроса.
	 * @param routingContext HTTP-контекст Vert.x
	 * @param resultHandler обработчик результата
	 */
	public void processRequest(RoutingContext routingContext,
	                           Handler<AsyncResult<String>> resultHandler) {
		
		// Форматируем запрос
		try {
			dsTransaction = clientIOFormatter.formatRequest(routingContext);
		} catch (Exception ex) {
			if (ex.getMessage() != null && ex.getMessage().equals("Empty Request")) {
				dsTransaction = new DSTransaction();
				dsTransaction.transactionNum = -2;
			} else {
				ex.printStackTrace(System.err);
				dsTransaction = new DSTransaction();
			}
		}
		
		if (dsTransaction.transactionNum == -2 || dsTransaction.operations.isEmpty()) {
			resultHandler.handle(Future.succeededFuture(
			    "//'\"]]>>isc_JSONResponseStart>>" + CBMServerMessages.noRequestInterior() + 
			    "//isc_JSONResponseEnd"));
			return;
		}
		
		// Обработка операций
		processOperations(0, routingContext, new ArrayList<String>(), resultHandler);
	}
	
	/**
	 * Асинхронная обработка операций с использованием StorageMetaData.
	 */
	private void processOperations(int opIdx, RoutingContext routingContext,
	                               List<String> results, Handler<AsyncResult<String>> resultHandler) {
		
		if (opIdx >= dsTransaction.operations.size()) {
			// Все операции выполнены
			String outTrans = "//'\"]]>>isc_JSONResponseStart>>[" + 
			                  String.join(",", results) + 
			                  "]//isc_JSONResponseEnd";
			resultHandler.handle(Future.succeededFuture(outTrans));
			return;
		}
		
		DSRequest dsRequest = dsTransaction.operations.get(opIdx);
		dsRequest.rawRequest = routingContext;
		
		// Проверка прав
		String tstResult;
		try {
			tstResult = credMan.testRights(dsRequest);
		} catch (Exception e) {
			tstResult = "Rights check error: " + e.getMessage();
		}
		
		if (!tstResult.equals("OK")) {
			resultHandler.handle(Future.succeededFuture(
			    "//'\"]]>>isc_JSONResponseStart>>" + tstResult + "//isc_JSONResponseEnd"));
			return;
		}
		
		// Выполняем операцию
		String operationType = dsRequest.operationType;
		
		// Используем StorageMetaData для асинхронных методов
		StorageMetaData storageMetaData = (StorageMetaData) metaProvider;
		
		switch (operationType) {
		case "fetch":
			storageMetaData.getSelectAsync(dsRequest)
				.compose(selectTemplate -> {
					Promise<DSResponse> promise = Promise.promise();
					currentDB.doSelect(selectTemplate, dsRequest, promise);
					return promise.future();
				})
				.map(dsResponse -> {
					try {
						return clientIOFormatter.formatResponse(dsResponse, dsRequest);
					} catch (Exception ex) {
						throw new RuntimeException(ex);
					}
				})
				.onComplete(event -> {
					if (event.succeeded()) {
						try {
							String formatted = event.result();
							results.add(formatted);
							processOperations(opIdx + 1, routingContext, results, resultHandler);
						} catch (Exception ex) {
							ex.printStackTrace();
							resultHandler.handle(Future.failedFuture(ex));
						}
					} else {
						event.cause().printStackTrace();
						resultHandler.handle(Future.failedFuture(event.cause()));
					}
				});
			break;
			
		case "add":
			storageMetaData.getColumnsInfoAsync(dsRequest)
				.compose(columnsInfo -> {
					Promise<DSResponse> promise = Promise.promise();
					currentDB.doInsert(columnsInfo, dsRequest, promise);
					return promise.future();
				})
				.map(dsResponse -> {
					try {
						return clientIOFormatter.formatResponse(dsResponse, dsRequest);
					} catch (Exception ex) {
						throw new RuntimeException(ex);
					}
				})
				.onComplete(event -> {
					if (event.succeeded()) {
						try {
							String formatted = event.result();
							results.add(formatted);
							processOperations(opIdx + 1, routingContext, results, resultHandler);
						} catch (Exception ex) {
							ex.printStackTrace();
							resultHandler.handle(Future.failedFuture(ex));
						}
					} else {
						event.cause().printStackTrace();
						resultHandler.handle(Future.failedFuture(event.cause()));
					}
				});
			break;
			
		case "update":
			storageMetaData.getColumnsInfoAsync(dsRequest)
				.compose(columnsInfo -> {
					Promise<DSResponse> promise = Promise.promise();
					currentDB.doUpdate(columnsInfo, dsRequest, promise);
					return promise.future();
				})
				.map(dsResponse -> {
					try {
						return clientIOFormatter.formatResponse(dsResponse, dsRequest);
					} catch (Exception ex) {
						throw new RuntimeException(ex);
					}
				})
				.onComplete(event -> {
					if (event.succeeded()) {
						try {
							String formatted = event.result();
							results.add(formatted);
							processOperations(opIdx + 1, routingContext, results, resultHandler);
						} catch (Exception ex) {
							ex.printStackTrace();
							resultHandler.handle(Future.failedFuture(ex));
						}
					} else {
						event.cause().printStackTrace();
						resultHandler.handle(Future.failedFuture(event.cause()));
					}
				});
			break;
			
		case "remove":
			storageMetaData.getDeleteAsync(dsRequest)
				.compose(deleteTables -> {
					Promise<DSResponse> promise = Promise.promise();
					currentDB.doDelete(deleteTables, dsRequest, promise);
					return promise.future();
				})
				.map(dsResponse -> {
					try {
						return clientIOFormatter.formatResponse(dsResponse, dsRequest);
					} catch (Exception ex) {
						throw new RuntimeException(ex);
					}
				})
				.onComplete(event -> {
					if (event.succeeded()) {
						try {
							String formatted = event.result();
							results.add(formatted);
							processOperations(opIdx + 1, routingContext, results, resultHandler);
						} catch (Exception ex) {
							ex.printStackTrace();
							resultHandler.handle(Future.failedFuture(ex));
						}
					} else {
						event.cause().printStackTrace();
						resultHandler.handle(Future.failedFuture(event.cause()));
					}
				});
			break;
			
		default:
			resultHandler.handle(Future.failedFuture("Unknown operation: " + operationType));
			break;
		}
	}
}