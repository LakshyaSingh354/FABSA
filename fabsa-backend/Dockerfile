# Use an official OpenJDK runtime as a parent image
FROM openjdk:17

# Set the working directory in the container
WORKDIR /app

# Copy the project files to the container
COPY . .

# Package the application
RUN ./mvnw package -DskipTests

# Expose the port the application runs on
EXPOSE 80

# Run the application
ENTRYPOINT ["java", "-jar", "target/fabsa-backend-0.0.1-SNAPSHOT.jar"]