package com.cbm.handlers;

import com.cbm.CBMServer.DataAccessService;
import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.ext.web.RoutingContext;

/**
 * Обработчик для DataAccessService (Vert.x async)
 */
public class DataAccessServiceHandler {
    
    /**
     * Асинхронный обработчик запроса к DataService.
     * Результат записывается напрямую в response.
     */
    public void handle(RoutingContext request, Handler<AsyncResult<String>> resultHandler) {
        try {
            var dataAccessService = new DataAccessService(request);
            dataAccessService.processRequest(request, resultHandler);
        } catch (Exception e) {
            // Обработка ошибок инициализации
            resultHandler.handle(Future.failedFuture(e));
        }
    }
    
    /**
     * Упрощённая версия для использования inline в маршрутах.
     * Сразу отправляет результат в response.
     */
    public void handleAndSend(RoutingContext request) {
        handle(request, result -> {
            if (result.succeeded()) {
                // Успешный результат
                request.response()
                    .setStatusCode(200)
                    .putHeader("Content-Type", "application/json; charset=utf-8")
                    .end(result.result());
            } else {
                // Ошибка
                request.response()
                    .setStatusCode(500)
                    .putHeader("Content-Type", "application/json; charset=utf-8")
                    .end("{\"error\":\"" + result.cause().getMessage() + "\"}");
            }
        });
    }
}
