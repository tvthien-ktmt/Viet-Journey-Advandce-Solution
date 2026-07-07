package com.vietjourney.backend.utils;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;

public class HtmlSanitizer {
    /**
     * Sanitize plain-text fields (names, phone, short comments).
     * Strips ALL HTML tags — use for fields that should never contain markup.
     */
    public static String sanitize(String input) {
        if (input == null) return null;
        return Jsoup.clean(input, Safelist.none());
    }

    /**
     * Sanitize rich-text content (blog body, tour overview).
     * Keeps a safe allowlist of structural and formatting tags while
     * removing scripts, on* handlers, and dangerous attributes.
     * Use for fields where the author is trusted to write formatted HTML.
     */
    public static String sanitizeRich(String input) {
        if (input == null) return null;
        return Jsoup.clean(input, Safelist.relaxed());
    }
}
