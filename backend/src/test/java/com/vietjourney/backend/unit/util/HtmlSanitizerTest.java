package com.vietjourney.backend.unit.util;

import com.vietjourney.backend.utils.HtmlSanitizer;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class HtmlSanitizerTest {

    @Test
    void testSanitizeXssPayload() {
        String input = "<script>alert(1)</script>";
        String output = HtmlSanitizer.sanitize(input);
        assertEquals("", output);
    }

    @Test
    void testSanitizeNormalString() {
        String input = "Hello, World! This is a normal string.";
        String output = HtmlSanitizer.sanitize(input);
        assertEquals("Hello, World! This is a normal string.", output);
    }
}
