package app.ecom.payment_service.service.impl;
import app.ecom.payment_service.entity.Transaction;
import app.ecom.payment_service.entity.Wallet;
import app.ecom.payment_service.repository.TransactionRepository;
import app.ecom.payment_service.repository.WalletRepository;
import app.ecom.payment_service.service.PaymentService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("PaymentService Unit Tests")
class PaymentServiceTest {

    @Mock private WalletRepository      walletRepo;
    @Mock private TransactionRepository transactionRepo;

    @InjectMocks
    private PaymentService paymentService;

    // ── helpers ───────────────────────────────────────────────────────────────

    private Wallet makeWallet(Long userId, double balance) {
        Wallet w = new Wallet();
        w.setUserId(userId);
        w.setBalance(balance);
        return w;
    }

    // ── addMoney ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("addMoney: creates a new wallet when user has none and credits balance")
    void addMoney_createsNewWallet() {
        when(walletRepo.findByUserId(1L)).thenReturn(Optional.empty());
        when(walletRepo.save(any(Wallet.class))).thenAnswer(inv -> inv.getArgument(0));

        Wallet result = paymentService.addMoney(1L, 500.0);

        assertThat(result.getBalance()).isEqualTo(500.0);
        assertThat(result.getUserId()).isEqualTo(1L);

        verify(walletRepo).save(any(Wallet.class));
        verify(transactionRepo).save(any(Transaction.class));
    }

    @Test
    @DisplayName("addMoney: adds to existing wallet balance")
    void addMoney_existingWallet_addsBalance() {
        Wallet existing = makeWallet(2L, 1000.0);
        when(walletRepo.findByUserId(2L)).thenReturn(Optional.of(existing));
        when(walletRepo.save(any(Wallet.class))).thenAnswer(inv -> inv.getArgument(0));

        Wallet result = paymentService.addMoney(2L, 250.0);

        assertThat(result.getBalance()).isEqualTo(1250.0);
    }

    @Test
    @DisplayName("addMoney: records a CREDIT transaction with null orderId")
    void addMoney_recordsCreditTransaction() {
        when(walletRepo.findByUserId(3L)).thenReturn(Optional.empty());
        when(walletRepo.save(any(Wallet.class))).thenAnswer(inv -> inv.getArgument(0));

        paymentService.addMoney(3L, 200.0);

        ArgumentCaptor<Transaction> captor = ArgumentCaptor.forClass(Transaction.class);
        verify(transactionRepo).save(captor.capture());

        Transaction tx = captor.getValue();
        assertThat(tx.getType()).isEqualTo("CREDIT");
        assertThat(tx.getAmount()).isEqualTo(200.0);
        assertThat(tx.getUserId()).isEqualTo(3L);
        assertThat(tx.getOrderId()).isNull();
    }

    // ── pay ───────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("pay: deducts amount and returns success message")
    void pay_success() {
        Wallet wallet = makeWallet(1L, 1000.0);
        when(walletRepo.findByUserId(1L)).thenReturn(Optional.of(wallet));
        when(walletRepo.save(any(Wallet.class))).thenAnswer(inv -> inv.getArgument(0));

        String result = paymentService.pay(1L, 300.0, 42L);

        assertThat(result).isEqualTo("Payment successful");
        assertThat(wallet.getBalance()).isEqualTo(700.0);
    }

    @Test
    @DisplayName("pay: returns insufficient balance message without deducting")
    void pay_insufficientBalance() {
        Wallet wallet = makeWallet(1L, 100.0);
        when(walletRepo.findByUserId(1L)).thenReturn(Optional.of(wallet));

        String result = paymentService.pay(1L, 500.0, 42L);

        assertThat(result).isEqualTo("Insufficient balance");
        assertThat(wallet.getBalance()).isEqualTo(100.0); // unchanged
        verify(walletRepo, never()).save(any());
        verify(transactionRepo, never()).save(any());
    }

    @Test
    @DisplayName("pay: records a DEBIT transaction with correct orderId")
    void pay_recordsDebitTransaction() {
        Wallet wallet = makeWallet(1L, 500.0);
        when(walletRepo.findByUserId(1L)).thenReturn(Optional.of(wallet));
        when(walletRepo.save(any(Wallet.class))).thenAnswer(inv -> inv.getArgument(0));

        paymentService.pay(1L, 150.0, 99L);

        ArgumentCaptor<Transaction> captor = ArgumentCaptor.forClass(Transaction.class);
        verify(transactionRepo).save(captor.capture());

        Transaction tx = captor.getValue();
        assertThat(tx.getType()).isEqualTo("DEBIT");
        assertThat(tx.getAmount()).isEqualTo(150.0);
        assertThat(tx.getOrderId()).isEqualTo(99L);
        assertThat(tx.getUserId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("pay: throws RuntimeException when wallet not found")
    void pay_walletNotFound_throws() {
        when(walletRepo.findByUserId(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> paymentService.pay(99L, 100.0, 1L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Wallet not found");
    }

    @Test
    @DisplayName("pay: exact balance — should succeed (boundary case)")
    void pay_exactBalance_success() {
        Wallet wallet = makeWallet(1L, 500.0);
        when(walletRepo.findByUserId(1L)).thenReturn(Optional.of(wallet));
        when(walletRepo.save(any(Wallet.class))).thenAnswer(inv -> inv.getArgument(0));

        String result = paymentService.pay(1L, 500.0, 10L);

        assertThat(result).isEqualTo("Payment successful");
        assertThat(wallet.getBalance()).isEqualTo(0.0);
    }

    // ── getBalance ────────────────────────────────────────────────────────────

    @Test
    @DisplayName("getBalance: returns correct balance for existing wallet")
    void getBalance_existing() {
        when(walletRepo.findByUserId(1L)).thenReturn(Optional.of(makeWallet(1L, 750.0)));

        Double balance = paymentService.getBalance(1L);

        assertThat(balance).isEqualTo(750.0);
    }

    @Test
    @DisplayName("getBalance: returns 0.0 when wallet does not exist")
    void getBalance_noWallet_returnsZero() {
        when(walletRepo.findByUserId(99L)).thenReturn(Optional.empty());

        Double balance = paymentService.getBalance(99L);

        assertThat(balance).isEqualTo(0.0);
    }

    // ── refund ────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("refund: restores balance and returns success message")
    void refund_success() {
        Wallet wallet = makeWallet(1L, 200.0);
        when(walletRepo.findByUserId(1L)).thenReturn(Optional.of(wallet));
        when(walletRepo.save(any(Wallet.class))).thenAnswer(inv -> inv.getArgument(0));

        String result = paymentService.refund(1L, 300.0, 55L);

        assertThat(result).isEqualTo("Refund successful");
        assertThat(wallet.getBalance()).isEqualTo(500.0);
    }

    @Test
    @DisplayName("refund: records a REFUND transaction with correct orderId")
    void refund_recordsRefundTransaction() {
        Wallet wallet = makeWallet(1L, 0.0);
        when(walletRepo.findByUserId(1L)).thenReturn(Optional.of(wallet));
        when(walletRepo.save(any(Wallet.class))).thenAnswer(inv -> inv.getArgument(0));

        paymentService.refund(1L, 400.0, 77L);

        ArgumentCaptor<Transaction> captor = ArgumentCaptor.forClass(Transaction.class);
        verify(transactionRepo).save(captor.capture());

        Transaction tx = captor.getValue();
        assertThat(tx.getType()).isEqualTo("REFUND");
        assertThat(tx.getAmount()).isEqualTo(400.0);
        assertThat(tx.getOrderId()).isEqualTo(77L);
        assertThat(tx.getUserId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("refund: throws RuntimeException when wallet not found")
    void refund_walletNotFound_throws() {
        when(walletRepo.findByUserId(88L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> paymentService.refund(88L, 100.0, 1L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Wallet not found");
    }
}

