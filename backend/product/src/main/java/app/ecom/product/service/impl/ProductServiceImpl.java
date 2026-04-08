package app.ecom.product.service.impl;

import app.ecom.product.entity.Product;
import app.ecom.product.entity.Category;
import app.ecom.product.repository.ProductRepository;
import app.ecom.product.repository.CategoryRepository;
import app.ecom.product.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductServiceImpl(ProductRepository productRepository,
                              CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    // ✅ Add Product
    @Override
    public Product addProduct(Product product) {

        Long categoryId = product.getCategory().getId();

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        product.setCategory(category);

        return productRepository.save(product);
    }

    // ✅ Get All Products
    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // ✅ Get Product by ID
    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    // ✅ Update Product
    @Override
    public Product updateProduct(Long id, Product updatedProduct) {

        Product existing = getProductById(id);

        Long categoryId = updatedProduct.getCategory().getId();

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        existing.setCategory(category);
        existing.setName(updatedProduct.getName());
        existing.setBrand(updatedProduct.getBrand());
        existing.setDescription(updatedProduct.getDescription());
        existing.setPrice(updatedProduct.getPrice());
        existing.setStock(updatedProduct.getStock());
        existing.setMaterial(updatedProduct.getMaterial());
        existing.setImagePath(updatedProduct.getImagePath());

        return productRepository.save(existing);
    }

    // ✅ Delete Product
    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Override
    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }
    @Override
    public Product reduceStock(Long productId, int quantity) {
        Product product = getProductById(productId);
        int updated = product.getStock() - quantity;
        if (updated < 0) updated = 0;
        product.setStock(updated);
        return productRepository.save(product);
    }

    @Override
    public Product restoreStock(Long productId, int quantity) {
        Product product = getProductById(productId);
        product.setStock(product.getStock() + quantity);
        return productRepository.save(product);
    }

}