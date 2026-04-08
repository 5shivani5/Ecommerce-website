package app.ecom.payment_service.entity;

import jakarta.persistence.*;

@Entity
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Double balance;

    // getters & setters
    public Long getId() { return id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Double getBalance() { return balance; }
    public void setBalance(Double balance) { this.balance = balance; }
}