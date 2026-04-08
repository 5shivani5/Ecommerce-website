package app.ecom.payment_service.service;

import app.ecom.payment_service.entity.Transaction;
import app.ecom.payment_service.entity.Wallet;
import app.ecom.payment_service.repository.TransactionRepository;
import app.ecom.payment_service.repository.WalletRepository;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    private final WalletRepository walletRepo;
    private final TransactionRepository transactionRepo;

    public PaymentService(WalletRepository walletRepo, TransactionRepository transactionRepo) {
        this.walletRepo = walletRepo;
        this.transactionRepo = transactionRepo;
    }

    // ✅ Add money
    public Wallet addMoney(Long userId, Double amount) {

        Wallet wallet = walletRepo.findByUserId(userId)
                .orElseGet(() -> {
                    Wallet w = new Wallet();
                    w.setUserId(userId);
                    w.setBalance(0.0);
                    return w;
                });

        wallet.setBalance(wallet.getBalance() + amount);
        walletRepo.save(wallet);

        Transaction tx = new Transaction();
        tx.setUserId(userId);
        tx.setAmount(amount);
        tx.setType("CREDIT");
        tx.setOrderId(null); // no order for adding money
        transactionRepo.save(tx);

        return wallet;
    }

    // ✅ Payment with orderId
    public String pay(Long userId, Double amount, Long orderId) {

        Wallet wallet = walletRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        if (wallet.getBalance() < amount) {
            return "Insufficient balance";
        }

        wallet.setBalance(wallet.getBalance() - amount);
        walletRepo.save(wallet);

        Transaction tx = new Transaction();
        tx.setUserId(userId);
        tx.setAmount(amount);
        tx.setType("DEBIT");
        tx.setOrderId(orderId); // ✅ important
        transactionRepo.save(tx);

        return "Payment successful";
    }

    // ✅ Get balance
    public Double getBalance(Long userId) {
        return walletRepo.findByUserId(userId)
                .map(Wallet::getBalance)
                .orElse(0.0);
    }
    public String refund(Long userId, Double amount, Long orderId) {

        Wallet wallet = walletRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        // ✅ Add money back
        wallet.setBalance(wallet.getBalance() + amount);
        walletRepo.save(wallet);

        // ✅ Record transaction
        Transaction tx = new Transaction();
        tx.setUserId(userId);
        tx.setAmount(amount);
        tx.setType("REFUND");   // 🔥 important for tracking
        tx.setOrderId(orderId);
        transactionRepo.save(tx);

        return "Refund successful";
    }
}