FROM maven:3.9.9-eclipse-temurin-17 AS builder
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn -q -DskipTests package \
    && JAR_FILE=$(ls target/*.jar | grep -v '\.original$' | head -n 1) \
    && cp "$JAR_FILE" target/app.jar

FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=builder /app/target/app.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]