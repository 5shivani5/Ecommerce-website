package app.ecom.payment_service.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;

@Component
public class JwtUtil {

    private final String SECRET = "mysecretkeymysecretkeymysecretkey";

    private Key getSignKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // ✅ Extract all claims
    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ✅ Extract username
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    // 🔥🔥🔥 ADD THIS METHOD (VERY IMPORTANT)
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSignKey())
                    .build()
                    .parseClaimsJws(token); // ✅ verifies signature + expiry

            return true;

        } catch (ExpiredJwtException e) {
            System.out.println("JWT expired");
        } catch (UnsupportedJwtException e) {
            System.out.println("Unsupported JWT");
        } catch (MalformedJwtException e) {
            System.out.println("Invalid JWT");
        } catch (SignatureException e) {
            System.out.println("Invalid signature");
        } catch (IllegalArgumentException e) {
            System.out.println("JWT empty");
        }

        return false;
    }
}