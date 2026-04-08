package app.ecom.product.mapper;

import app.ecom.product.dto.ProductRequestDTO;
import app.ecom.product.dto.ProductResponseDTO;
import app.ecom.product.entity.Product;
import app.ecom.product.entity.Category;

public class ProductMapper {

    // ✅ Convert DTO → Entity
    public static Product toEntity(ProductRequestDTO dto) {
        Product product = new Product();

        // 🔹 Set Category using ID
        Category category = new Category();
        category.setId(dto.getCategoryId());
        product.setCategory(category);

        product.setName(dto.getName());
        product.setBrand(dto.getBrand());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());
        product.setMaterial(dto.getMaterial());
        product.setImagePath(dto.getImagePath());

        return product;
    }

    // ✅ Convert Entity → DTO
    public static ProductResponseDTO toDTO(Product product) {
        ProductResponseDTO dto = new ProductResponseDTO();

        dto.setId(product.getId());

        // 🔹 Extract category ID from object
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
        }

        dto.setName(product.getName());
        dto.setBrand(product.getBrand());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setMaterial(product.getMaterial());
        dto.setImagePath(product.getImagePath());

        // Availability logic
        if (product.getStock() > 0) {
            dto.setAvailabilityStatus("In Stock");
        } else {
            dto.setAvailabilityStatus("Out of Stock");
        }

        return dto;
    }

    // ✅ Update existing entity
    public static void updateEntity(Product product, ProductRequestDTO dto) {

        // 🔹 Update category
        Category category = new Category();
        category.setId(dto.getCategoryId());
        product.setCategory(category);

        product.setName(dto.getName());
        product.setBrand(dto.getBrand());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());
        product.setMaterial(dto.getMaterial());
        product.setImagePath(dto.getImagePath());
    }
}