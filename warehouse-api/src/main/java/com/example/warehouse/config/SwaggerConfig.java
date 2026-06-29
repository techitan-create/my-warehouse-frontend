package com.example.warehouse.config;

import io.swagger.v3.oas.models.*;
import io.swagger.v3.oas.models.info.*;
import io.swagger.v3.oas.models.security.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI warehouseOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Warehouse Management API")
                .description("ระบบจัดการคลังสินค้า Enterprise")
                .version("v1.0.0")
                .contact(new Contact()
                    .name("Techit Angkrathok")))
            .addSecurityItem(
                new SecurityRequirement().addList("Bearer"))
            .components(new Components()
                .addSecuritySchemes("Bearer",
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description("ใส่ JWT Token ที่ได้จาก Login")));
    }
}