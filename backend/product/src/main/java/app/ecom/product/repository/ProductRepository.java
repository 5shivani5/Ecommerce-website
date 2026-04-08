package app.ecom.product.repository;

import app.ecom.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByStockGreaterThan(int stock);
    List<Product> findByCategoryId(Long categoryId);
    boolean existsByCategoryId(Long categoryId);
}