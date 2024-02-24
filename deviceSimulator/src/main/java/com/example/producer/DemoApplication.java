package com.example.producer;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.json.JSONObject;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.Scanner;
import java.util.concurrent.TimeoutException;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
        // RabbitMQ connection details
        String hostname = "localhost";
        int port = 5672; // Default AMQPS port
        String username = "guest";
        String password = "guest";
        String virtualHost = "/";

        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost(hostname);
        factory.setPort(port);
        factory.setUsername(username);
        factory.setPassword(password);
        factory.setVirtualHost(virtualHost);


        Connection connection = null;
        try {
            connection = factory.newConnection();
        } catch (IOException e) {
            throw new RuntimeException(e);
        } catch (TimeoutException e) {
            throw new RuntimeException(e);
        }
        Channel channel = null;
        try {
            channel = connection.createChannel();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        String queue = "sensor_measurement";
        boolean durable = false;
        boolean exclusive = false;
        boolean autoDelete = false;

        try {
            channel.queueDeclare(queue, durable, exclusive, autoDelete, null);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        String exchangeName = "sensor_exchange";
        String routingKey = "sensor_route";
// Add this block after creating the channel and before publishing messages
        try {
            channel.exchangeDeclare(exchangeName, "topic",true); // Declare the exchange as a 'direct' exchange
        } catch (IOException e) {
            throw new RuntimeException("Error declaring exchange: " + e.getMessage());
        }

        LocalDateTime date = LocalDateTime.of(LocalDate.now(), LocalTime.now());


        File file = new File("D:\\An4Sem1\\SD\\deviceSimulator\\src\\main\\resources\\sensor.csv");
        File deviceFile = new File("D:\\An4Sem1\\SD\\deviceSimulator\\src\\main\\resources\\device_id.txt");
        String deviceId=null;
        Scanner scan = null;
        Scanner deviceScan=null;
        try {
            scan = new Scanner(file);
            deviceScan=new Scanner(deviceFile);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        if(deviceScan.hasNextLine()){
            deviceId=deviceScan.nextLine();
        }
        deviceScan.close();;
        while (scan.hasNextLine()) {
            String value = scan.nextLine();
            System.out.println(value);
            JSONObject obj = new JSONObject();

            date = date.plusMinutes(10);
            long timestamp = date.toEpochSecond(ZoneOffset.UTC);

            obj.put("id_sensor", deviceId);
            obj.put("timestamp", timestamp);
            obj.put("value", value);


            try {
                channel.basicPublish(exchangeName, routingKey, null, obj.toString().getBytes(StandardCharsets.UTF_8));
                System.out.println(obj);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }

            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }

        // Close the channel and connection after sending messages
        try {
            channel.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        } catch (TimeoutException e) {
            throw new RuntimeException(e);
        }
        try {
            connection.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}

