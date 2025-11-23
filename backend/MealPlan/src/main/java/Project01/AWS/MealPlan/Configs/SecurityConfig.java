package Project01.AWS.MealPlan.Configs;

import Project01.AWS.MealPlan.security.CognitoAuthenticationFailureHandler;
import Project01.AWS.MealPlan.security.CognitoAuthenticationSuccessHandler;
import Project01.AWS.MealPlan.security.CognitoLogoutHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(AuthenticationProvider authenticationProvider, JwtAuthenticationFilter jwtAuthFilter) {
        this.authenticationProvider = authenticationProvider;
        this.jwtAuthFilter = jwtAuthFilter;
    }

//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf(csrf -> csrf.disable()) // tắt CSRF
//                .authorizeHttpRequests(auth -> auth
//                        .anyRequest().permitAll() // tất cả request đều cho phép
//                )
//                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                .authenticationProvider(authenticationProvider);
////                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, CognitoAuthenticationSuccessHandler cognitoSuccessHandler,
                                                   CognitoAuthenticationFailureHandler cognitoFailureHandler) throws Exception {
        CognitoLogoutHandler cognitoLogoutHandler = new CognitoLogoutHandler();
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/**",
                                "/api/dishes/**",
                                "/api/auth/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-resources/**"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                .oauth2Login(oauth2 -> oauth2
////                       .loginPage("https://ap-southeast-1msytfkhfw.auth.ap-southeast-1.amazoncognito.com/")
//                        .defaultSuccessUrl("/api/auth/oauth2/success", true)
//                        .failureUrl("/api/auth/oauth2/failure")
//                )
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(cognitoSuccessHandler)
                        .failureHandler(cognitoFailureHandler)
                )
//                .oauth2Login(Customizer.withDefaults())
                .logout(logout -> logout
                        .logoutSuccessHandler(cognitoLogoutHandler)
                )
//                .formLogin(Customizer.withDefaults())
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

//@Bean
//public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//    CognitoLogoutHandler cognitoLogoutHandler = new CognitoLogoutHandler();
//
//    http.csrf(Customizer.withDefaults())
//            .authorizeHttpRequests(authz -> authz
//                    .requestMatchers("/").permitAll()
//                    .anyRequest()
//                    .authenticated())
//            .oauth2Login(Customizer.withDefaults())
//            .logout(logout -> logout.logoutSuccessHandler(cognitoLogoutHandler));
//    return http.build();
//}

//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
//        configuration.setAllowedOrigins(List.of("http://localhost:8080"));
//        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
//        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", configuration);
//        return source;
//    }
}
