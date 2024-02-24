package ro.tuc.ds2020.config;

import lombok.AllArgsConstructor;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ro.tuc.ds2020.repositories.PersonRepository;

@Configuration
@AllArgsConstructor
public class FilterConfig {

    private PersonRepository repository;

    @Bean
    public FilterRegistrationBean filter() {
        FilterRegistrationBean filter = new FilterRegistrationBean();
        filter.setFilter(new MyGenericFilterBean(repository));
        // provide endpoints which needs to be restricted.
        // All Endpoints would be restricted if unspecified


        filter.addUrlPatterns("/device/*");
        filter.addUrlPatterns("/device");
        filter.addUrlPatterns("/personDevice/get");
        filter.addUrlPatterns("/personDevice/{email:.+}");
        return filter;
    }
}