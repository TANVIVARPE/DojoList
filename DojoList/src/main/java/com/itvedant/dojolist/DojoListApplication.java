package com.itvedant.dojolist;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories("com.itvedant.dojolist.repositories")
@EntityScan("com.itvedant.dojolist.entity")
public class DojoListApplication {

	public static void main(String[] args) {
		SpringApplication.run(DojoListApplication.class, args);
	}

}
