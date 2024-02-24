package ro.tuc.ds2020.config;



import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.ServletException;

import lombok.AllArgsConstructor;
import org.springframework.web.filter.GenericFilterBean;
import javax.servlet.FilterChain;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;


@AllArgsConstructor
public class MyGenericFilterBean extends GenericFilterBean {

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
            String userId = claims.get("userId", String.class);
            String role = claims.get("role", String.class);


            if (!(role.equals("admin")|| role.equals("client"))) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid authorization token");
            } else {

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