package ro.tuc.ds2020.rabbitConfig;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableRabbit
public class Config {
    public static final String QUEUE = "devices";
    public static final String QUEUE2 = "sensor_measurement";
    public static final String EXCHANGE = "devices_exchange";

    public static final String ROUTING_KEY = "devices_route";
    public static final String EXCHANGE2 = "sensor_exchange";
    public static final String ROUTING_KEY2 = "sensor_route";

    @Bean
    public Binding binding() {
        TopicExchange exchange = new TopicExchange(EXCHANGE,true,false);
       Queue  queue =new Queue(QUEUE,false);

        return BindingBuilder
                .bind(queue)
                .to(exchange)
                .with(ROUTING_KEY);
    }

    @Bean
    public Binding binding2() {
        Queue queue = new Queue(QUEUE2,false);
        TopicExchange exchange = new TopicExchange(EXCHANGE2,true,false);
        return BindingBuilder
                .bind(queue)
                .to(exchange)
                .with(ROUTING_KEY2);
    }


}

