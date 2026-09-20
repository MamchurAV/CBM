package com.cbm.handlers;

import com.cbm.CBMUtils.I_AutentificationManager;
import com.cbm.CBMUtils.CredentialsManager;
import com.cbm.Main;
import io.vertx.core.http.Cookie;
import io.vertx.ext.web.RoutingContext;
import io.vertx.core.http.HttpServerResponse;
import io.netty.handler.codec.http.cookie.DefaultCookie;
import io.netty.handler.codec.http.cookie.ServerCookieEncoder;

/**
 * Обработчик для CBMClientStart
 */
public class CBMClientStartHandler {
    
    public String handle(RoutingContext request) {
        String initialMsg = null;
        HttpServerResponse response = request.response();

        I_AutentificationManager credMan = new CredentialsManager();
        initialMsg = credMan.initFirstKeys();

        // Установка Cache-Control: no-store
        response.putHeader("Cache-Control", "no-store");
        // Установка Content-Type: text/html; charset=UTF-8
        response.putHeader("Content-Type", "text/html; charset=UTF-8");

        // Создаём и настраиваем Cookie
        /* To allow non-strict cookie validation - we use workaround to set Cookie "as is"
        Cookie cookie = io.vertx.core.http.Cookie.cookie("ImgFirst", initialMsg);
        cookie.setPath("/");
        // cookie.setHttpOnly(true);
        // cookie.setSecure(true); // Только для HTTPS
        cookie.setMaxAge(3600); // Время жизни в секундах
        request.response().addCookie(cookie);
        */
        DefaultCookie nettyCookie = new DefaultCookie("ImgFirst", initialMsg);
        nettyCookie.setPath("/");
        nettyCookie.setMaxAge(3600);
        String cookieString = ServerCookieEncoder.LAX.encode(nettyCookie);
        request.response().headers().add("Set-Cookie", cookieString);

        return Main.ROOT_URI + "index.html";
    }
}
