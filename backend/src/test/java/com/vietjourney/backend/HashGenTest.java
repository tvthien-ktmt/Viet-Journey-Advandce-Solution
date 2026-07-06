package com.vietjourney.backend;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashGenTest {
    @Test
    public void generateHash() {
        System.out.println("HASH_START:" + new BCryptPasswordEncoder().encode("Test@123456") + ":HASH_END");
    }
}
