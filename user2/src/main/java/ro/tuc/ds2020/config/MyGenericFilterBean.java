package ro.tuc.ds2020.config;



import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.ServletException;

import lombok.AllArgsConstructor;
import org.springframework.web.filter.GenericFilterBean;
import ro.tuc.ds2020.entities.Person;
import ro.tuc.ds2020.repositories.PersonRepository;

import javax.servlet.FilterChain;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static ro.tuc.ds2020.utils.UtilFunctions.decodePassword;
import static ro.tuc.ds2020.utils.UtilFunctions.encodePassword;


@AllArgsConstructor
public class MyGenericFilterBean extends GenericFilterBean {
    private PersonRepository repository;
    private static final String secretKey = "vYKl0OQy3+eDndDf2D8zNQY12/gS9DJQInmN6oBO2u8=";

    private void setOptionResp(FilterChain filterChain, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setStatus(HttpServletResponse.SC_OK);
        try {
            filterChain.doFilter(request,  response);
        } catch (javax.servlet.ServletException e) {
            throw new RuntimeException(e);
        }
    }

    private void setValidatePublicEndpoints(String authHeader, FilterChain filterChain, HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        if (authHeader != null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authenticated user");
        } else {
            try {
                filterChain.doFilter( request,  response);
            } catch (javax.servlet.ServletException e) {
                throw new RuntimeException(e);
            }
        }
    }

    private void validatePrivateEndpoints(String authHeader, FilterChain filterChain, HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        if (authHeader == null || !authHeader.startsWith("Bearer ") || authHeader.length() < 8) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing or invalid Authorization header");
        } else {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            request.setAttribute("token", token);
            setNonOptionResp(token, filterChain, request, response);
        }
    }

    private void setNonOptionResp(String token, FilterChain filterChain, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            // Extract claims from the token
            Claims claims = Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token).getBody();

            // Retrieve userId and role from claims
            String email = claims.get("email", String.class);
            String role = claims.get("role", String.class);

            // Perform authentication and authorization checks
            Optional<Person> person = repository.findByEmail(email);

            if (!person.isPresent() || !person.get().getRole().getRoleType().equals(role)) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid authorization token");
            } else {
                request.setAttribute("x-user", person.get().getEmail());
                request.setAttribute("x-role", role);

                filterChain.doFilter(request, response);
            }
        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
        }
    }
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException {
        final HttpServletRequest request = (HttpServletRequest) servletRequest;
        final HttpServletResponse response = (HttpServletResponse) servletResponse;
        final String authHeader = request.getHeader("authorization");
        final String url = request.getRequestURI();

        if ("OPTIONS".equals(request.getMethod())) {
            try {
                setOptionResp(filterChain, request, response);
            } catch (ServletException e) {
                throw new RuntimeException(e);
            }
        } else {
            if (List.of("/login", "/register").contains(url)) {
                try {
                    setValidatePublicEndpoints(authHeader, filterChain, request, response);
                } catch (ServletException e) {
                    throw new RuntimeException(e);
                }
            } else {
                try {
                    validatePrivateEndpoints(authHeader, filterChain, request, response);
                } catch (ServletException e) {
                    throw new RuntimeException(e);
                }
            }
        }
    }
}