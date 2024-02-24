package ro.tuc.ds2020.config;

import lombok.AllArgsConstructor;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@AllArgsConstructor
public class FilterConfig {


    @Bean
    public FilterRegistrationBean filter() {
        FilterRegistrationBean filter = new FilterRegistrationBean();
        filter.setFilter(new MyGenericFilterBean());
        // provide endpoints which needs to be restricted.
        // All Endpoints would be restricted if unspecified
        filter.addUrlPatterns("/message");
        filter.addUrlPatterns("/message/*");
          return filter;
    }
}