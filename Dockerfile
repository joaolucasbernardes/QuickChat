# Estágio 1: Build da aplicação com Maven
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY .mvn/ .mvn/
COPY src/ src/
RUN mvn package -DskipTests

# Estágio 2: Criação da imagem final com o Java Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/quickchat-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 5000
ENTRYPOINT ["java", "-jar", "app.jar"]