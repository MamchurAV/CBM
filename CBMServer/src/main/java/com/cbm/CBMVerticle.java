package com.cbm;

import com.cbm.CBMPersistence.ConnectionPool;
import com.cbm.handlers.CBMClientStartHandler;
import com.cbm.handlers.DataAccessServiceHandler;
import com.cbm.handlers.UploadServerHandler;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.http.HttpServer;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.StaticHandler;

/**
 * Основной Vert.x verticle для CBM REST сервиса
 */
public class CBMVerticle extends AbstractVerticle {

    private static final int PORT = Integer.parseInt(Main.getParam("port"));
    
    private final CBMClientStartHandler cbmClientStartHandler = new CBMClientStartHandler();
    private final DataAccessServiceHandler dataAccessServiceHandler = new DataAccessServiceHandler();
    private final UploadServerHandler uploadServerHandler = new UploadServerHandler();
    
    @Override
    public void start(Promise<Void> startPromise) {
        // Инициализация пула подключений к PostgreSQL
        ConnectionPool.init(vertx);
        
        HttpServer server = vertx.createHttpServer();
        Router router = Router.router(vertx);

        // Добавляем BodyHandler для чтения тела запроса
        router.route().handler(BodyHandler.create());

        // Маршрут: /DataService -> CBMServer.DataAccessService.class (async)
        router.route("/DataService").handler(dataAccessServiceHandler::handleAndSend);

        // Маршрут: /CBMStart -> CBMServer.CBMClientStart.class
        router.route("/CBMStart").handler(request -> {
            String out = cbmClientStartHandler.handle(request);
            io.vertx.core.http.HttpServerResponse response = request.response();
            response.sendFile(out);
        });

        // Маршрут: /CBMClient -> file:///CBMClient/
        router.route("/CBMClient/*").handler(StaticHandler.create(Main.ROOT_URI));

        // Маршрут: /FileStorage -> file:///../CBM_Files/
        router.route("/FileStorage/*").handler(StaticHandler.create("../CBM_Files"));

        // Маршрут: /UploadFile -> UploadServer.class
        router.route("/UploadFile").handler(request -> {
            uploadServerHandler.handle();
            request.response().end("UploadFile handled");
        });

        server.requestHandler(router)
            .listen(PORT, ar -> {
                if (ar.succeeded()) {
                    System.out.println("CBM REST сервис запущен на порту " + PORT);
                    startPromise.complete();
                } else {
                    System.err.println("Ошибка запуска сервиса: " + ar.cause().getMessage());
                    startPromise.fail(ar.cause());
                }
            });
    }
    
    @Override
    public void stop(Promise<Void> stopPromise) {
        // Корректное закрытие пула подключений
        ConnectionPool.shutdown();
        stopPromise.complete();
    }
}
