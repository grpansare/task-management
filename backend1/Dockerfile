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
