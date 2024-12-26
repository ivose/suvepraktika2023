package com.cgi.library.util;

import java.security.SecureRandom;
import java.util.Base64;

public class RandomBase64Util {
    public String getSecret(int nrOfbytes) {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[nrOfbytes];
        random.nextBytes(bytes);
        return Base64.getEncoder().encodeToString(bytes);
    }
}
