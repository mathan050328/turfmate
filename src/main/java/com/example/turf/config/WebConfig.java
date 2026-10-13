package com.example.turf.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/home").setViewName("forward:/index.html");
        registry.addViewController("/turfs").setViewName("forward:/index.html");
        registry.addViewController("/bookings").setViewName("forward:/index.html");
        registry.addViewController("/login").setViewName("forward:/index.html");
        registry.addViewController("/profile").setViewName("forward:/index.html");
        registry.addViewController("/about").setViewName("forward:/index.html");
        registry.addViewController("/contact").setViewName("forward:/index.html");
        registry.addViewController("/privacy").setViewName("forward:/index.html");
        registry.addViewController("/terms").setViewName("forward:/index.html");
    }
}
