package app.ecom.payment_service.controller;

import app.ecom.payment_service.entity.Wallet;
import app.ecom.payment_service.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // ✅ ADMIN: Add money to user wallet
    @PostMapping("/add")
    public Wallet addMoney(@RequestParam Long userId,
                           @RequestParam Double amount) {

        return paymentService.addMoney(userId, amount);
    }

    // ✅ Pay using wallet
    @PostMapping("/pay")
    public String pay(@RequestParam Long userId,
                      @RequestParam Double amount,
                      @RequestParam Long orderId) {

        return paymentService.pay(userId, amount, orderId);
    }

    // ✅ Get wallet balance
    @GetMapping("/balance/{userId}")
    public Double getBalance(@PathVariable Long userId) {
        return paymentService.getBalance(userId);
    }

    @PostMapping("/refund")
    public ResponseEntity<String> refund(
            @RequestParam Long userId,
            @RequestParam Double amount,
            @RequestParam Long orderId) {

        return ResponseEntity.ok(
                paymentService.refund(userId, amount, orderId)
        );
    }

}