# Use an official Maven image with JDK 21 to build the project
FROM maven:3.9.4-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom.xml and download dependencies first (caching)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code
COPY src ./src

# Build the project
RUN mvn clean package -DskipTests

# Use an OpenJDK 21 runtime for running the app
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the jar from the build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
