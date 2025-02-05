# Stage 1: Build
FROM eclipse-temurin:23-jdk-alpine AS builder

# Installiere Node.js und npm ohne Cache
RUN apk add --no-cache nodejs npm

WORKDIR /mosque-signage

# Kopiere die Gradle-Konfigurationen für verbessertes Caching
COPY gradlew build.gradle.kts settings.gradle.kts gradle.properties ./
COPY gradle/ gradle/

# Setze Ausführungsrechte und lade die Abhängigkeiten
RUN chmod +x gradlew && ./gradlew dependencies --no-daemon

# Kopiere nur die für npm notwendigen Dateien
COPY webapp/build.gradle.kts webapp/package.json webapp/package-lock.json webapp/

# Führe npmInstall aus (dieser Layer bleibt gecached, solange package.json und package-lock.json gleich bleiben)
RUN ./gradlew :webapp:npmSetup --no-daemon \
 && ./gradlew :webapp:npmInstall --no-daemon

# Kopiere anschließend den restlichen Quellcode, sodass Änderungen hier nicht den npmInstall-Layer invalidieren
COPY webapp/ webapp/

# Führe npmBuild aus
RUN ./gradlew :webapp:npmBuild --no-daemon

# Stage 2: Laufzeit-Image mit PHP und Apache
FROM php:8.1-apache

# Entferne ggf. vorhandene Standard-Dateien
RUN rm -rf /var/www/html/*

# Kopiere den gebauten Output aus der Builder-Stage in das Webserver-Verzeichnis
COPY --from=builder /mosque-signage/webapp/build/ /var/www/html/

EXPOSE 80

CMD ["apache2-foreground"]