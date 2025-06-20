# ---------- Build Stage ----------
FROM eclipse-temurin:17-jdk as builder

WORKDIR /app

# Copy Maven wrapper and POM first
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Give executable permission to mvnw
RUN chmod +x mvnw

# Pre-download dependencies
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src ./src

# Build the app
RUN ./mvnw clean package -DskipTests

# ---------- Runtime Stage ----------
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy the jar from build stage
COPY --from=builder /app/target/*.jar app.jar

# Expose port (Render auto-detects this)
EXPOSE 8080

# Use environment variable for Render’s dynamic port
ENV PORT=8080

# Run the app
CMD ["java", "-jar", "app.jar"]
