package app.ecom.product.service;

import app.ecom.product.entity.Product;

import java.util.List;

public interface ProductService {

    Product addProduct(Product product);

    List<Product> getAllProducts();

    Product getProductById(Long id);

    Product updateProduct(Long id, Product product);

    void deleteProduct(Long id);

    List<Product> getProductsByCategory(Long categoryId);
    Product reduceStock(Long productId, int quantity);

    Product restoreStock(Long productId, int quantity);

}