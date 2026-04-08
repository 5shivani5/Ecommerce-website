package app.ecom.payment_service.repository;

import app.ecom.payment_service.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
}