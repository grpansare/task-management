# ---------- Build Stage ----------
FROM eclipse-temurin:17-jdk as builder

WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN chmod +x mvnw

RUN ./mvnw dependency:go-offline

COPY src ./src

RUN ./mvnw clean package -DskipTests

# ---------- Runtime Stage ----------
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy and rename jar explicitly
COPY --from=builder /app/target/*.jar ./app.jar

EXPOSE 8080
ENV PORT=8080

CMD ["java", "-jar", "app.jar"]
