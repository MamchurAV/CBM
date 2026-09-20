package com.cbm;

import io.vertx.core.Vertx;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;

/**
 * Точка входа в приложение
 */
public class Main {
    private static Properties props = new Properties();
    private static final String sysRoot = System.getProperty("user.dir");
    public static final String CBM_ROOT = sysRoot.substring(0, sysRoot.lastIndexOf("/") > 0 ? sysRoot.lastIndexOf("/") : sysRoot.lastIndexOf("\\") > 0 ? sysRoot.lastIndexOf("\\") : sysRoot.length()).replace("\\", "/");
    public static final String ROOT_URI = CBM_ROOT + "/CBMClient/";
    public static final String FS_URI = CBM_ROOT + "/CBM_Files/"; // TODO: Define place for files
    public static void main(String[] args) {
        // Load properties
        try {
            props.load(new FileInputStream(sysRoot + "/CBMServer.properties"));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        // Start vertx
        System.out.println("Starting vertx");
        Vertx vertx = Vertx.vertx();
        vertx.deployVerticle(new CBMVerticle());
    }

    public static String getParam(String key) {
        return props.getProperty(key);
    }
}


