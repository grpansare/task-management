# ---------- Build Stage ----------
FROM eclipse-temurin:17-jdk as builder

WORKDIR /app

# Copy Maven wrapper and pom.xml first (to leverage Docker cache)
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Pre-download dependencies
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src ./src

# Build the app (without running tests)
RUN ./mvnw clean package -DskipTests

# ---------- Runtime Stage ----------
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy only the final jar from builder
COPY --from=builder /app/target/*.jar app.jar

# Run the app
CMD ["java", "-jar", "app.jar"]
