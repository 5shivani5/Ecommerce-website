package app.ecom.product.controller;

import app.ecom.product.dto.ProductRequestDTO;
import app.ecom.product.dto.ProductResponseDTO;
import app.ecom.product.entity.Product;
import app.ecom.product.mapper.ProductMapper;
import app.ecom.product.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:5173") // ✅ ADD THIS
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ProductResponseDTO addProduct(@RequestBody ProductRequestDTO dto) {
        Product product = ProductMapper.toEntity(dto);
        Product saved = productService.addProduct(product);
        return ProductMapper.toDTO(saved);
    }

    @GetMapping
    public List<ProductResponseDTO> getAllProducts() {
        return productService.getAllProducts()
                .stream()
                .map(ProductMapper::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ProductResponseDTO getProductById(@PathVariable Long id) {
        return ProductMapper.toDTO(productService.getProductById(id));
    }

    @PutMapping("/{id}")
    public ProductResponseDTO updateProduct(@PathVariable Long id,
                                            @RequestBody ProductRequestDTO dto) {

        Product updated = ProductMapper.toEntity(dto);
        Product saved = productService.updateProduct(id, updated);

        return ProductMapper.toDTO(saved);
    }

    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return "Product deleted successfully";
    }
    @GetMapping("/category/{categoryId}")
    public List<ProductResponseDTO> getProductsByCategory(@PathVariable Long categoryId) {
        System.out.println("PRODUCT API HIT");

        List<Product> products = productService.getProductsByCategory(categoryId);

        return products.stream()
                .map(ProductMapper::toDTO)
                .toList();
    }
    //  Reduce stock when order is placed - called by order-service
    @PutMapping("/{id}/reduce-stock")
    public ProductResponseDTO reduceStock(@PathVariable Long id,
                                          @RequestParam int qty) {
        return ProductMapper.toDTO(productService.reduceStock(id, qty));
    }

    //  Restore stock when order is cancelled - called by order-service
    @PutMapping("/{id}/restore-stock")
    public ProductResponseDTO restoreStock(@PathVariable Long id,
                                           @RequestParam int qty) {
        return ProductMapper.toDTO(productService.restoreStock(id, qty));
    }

}