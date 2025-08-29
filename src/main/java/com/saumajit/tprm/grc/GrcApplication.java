package com.saumajit.tprm.grc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableAsync
@EnableCaching
@EnableKafka
@EnableTransactionManagement
public class GrcApplication {

	public static void main(String[] args) {

		SpringApplication.run(GrcApplication.class, args);
	}

}
