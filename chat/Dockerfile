FROM amazoncorretto:17.0.9
COPY target/ds-2020-0.0.1-SNAPSHOT.jar ds-2020-0.0.1-SNAPSHOT.jar
# Install necessary packages (e.g., curl)
RUN yum install -y curl

VOLUME /tmp
EXPOSE 8083
ENTRYPOINT ["java", "-jar","ds-2020-0.0.1-SNAPSHOT.jar"]