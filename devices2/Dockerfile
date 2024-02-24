FROM amazoncorretto:17.0.9

# Copy your JAR file to the container
COPY target/ds-2020-0.0.1-SNAPSHOT.jar ds-2020-0.0.1-SNAPSHOT.jar

# Install necessary packages (e.g., curl)
RUN yum install -y curl

# Expose the port
EXPOSE 8081

# Define the entry point for your application
ENTRYPOINT ["java", "-jar", "ds-2020-0.0.1-SNAPSHOT.jar"]
