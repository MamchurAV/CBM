plugins {
    id("java")
    id("application")
}

group = "org.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    implementation("io.vertx:vertx-core:4.5.1")
    implementation("io.vertx:vertx-web:4.5.1")
    implementation("io.vertx:vertx-jdbc-client:4.5.1")

    implementation("com.zaxxer:HikariCP:5.1.0")

    // PostgreSQL JDBC Driver
    implementation("org.postgresql:postgresql:42.7.3")

    implementation("com.fasterxml.jackson.core:jackson-databind:2.15.3")
//    implementation("com.fasterxml.jackson.core:jackson-annotations:2.21.0")
//    implementation("com.fasterxml.jackson.core:jackson-core:2.21.0")

//    implementation("tools.jackson.core:jackson-databind:3.1.0")
//    implementation("tools.jackson.core:jackson-annotations:3.1.0")
//    implementation("com.fasterxml.jackson.core:jackson-annotations:3.1.0")
//    implementation("tools.jackson.core:jackson-core:3.1.0")

    // Подключаем BOM-платформу, которая сама выставит нужные версии для всех модулей Jackson
//    implementation(platform("tools.jackson:jackson-bom:3.1.0"))
    // Теперь версии указывать не нужно — они синхронизированы
//    implementation("tools.jackson.core:jackson-databind")
//    implementation("tools.jackson.core:jackson-core")
//    implementation("tools.jackson.core:jackson-annotations") // ???

    testImplementation(platform("org.junit:junit-bom:5.10.0"))
    testImplementation("org.junit.jupiter:junit-jupiter")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}


tasks.test {
    useJUnitPlatform()
}

application {
    mainClass.set("com.cbm.CBMVerticle")
}
