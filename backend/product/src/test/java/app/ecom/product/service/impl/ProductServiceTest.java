package app.ecom.product.service.impl;


import app.ecom.product.entity.Category;
import app.ecom.product.entity.Product;
import app.ecom.product.repository.CategoryRepository;
import app.ecom.product.repository.ProductRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    // ── Mocks
    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    // ── Real services under test
    @InjectMocks
    private ProductServiceImpl productService;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    // Builds a Category entity — like what the DB returns
    private Category buildCategory(Long id, String name) {
        Category c = new Category();
        c.setId(id);
        c.setName(name);
        return c;
    }

    // Builds a Product entity with a category attached
    private Product buildProduct(Long id, String name, String brand,
                                 double price, int stock, Category category) {
        Product p = new Product();
        p.setId(id);
        p.setName(name);
        p.setBrand(brand);
        p.setDescription("A great product");
        p.setPrice(price);
        p.setStock(stock);
        p.setMaterial("Cotton");
        p.setImagePath("/images/product.jpg");
        p.setCategory(category);
        return p;
    }

    @Test
    @DisplayName("Add product successfully when category exists")

    void addProduct_shouldSaveAndReturnProduct_whenCategoryExists() {
        Category category = buildCategory(1L, "Women");
        Product incoming = buildProduct(null, "Floral Dress", "UrbanVogue",
                1299.0, 50, category);

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

        Product saved = buildProduct(10L, "Floral Dress", "UrbanVogue",
                1299.0, 50, category);
        when(productRepository.save(any(Product.class))).thenReturn(saved);

        Product result = productService.addProduct(incoming);

        assertNotNull(result);
        assertEquals(10L, result.getId());
        assertEquals("Floral Dress", result.getName());
        assertEquals("UrbanVogue", result.getBrand());
        assertEquals(1299.0, result.getPrice(), 0.01);
        assertEquals(50, result.getStock());
        assertEquals("Women", result.getCategory().getName());
        verify(categoryRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("Fail to add product when category does not exist")
    void addProduct_shouldThrow_whenCategoryNotFound() {
        Category category = buildCategory(99L, "Unknown");
        Product incoming = buildProduct(null, "Floral Dress", "UrbanVogue",
                1299.0, 50, category);

        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> productService.addProduct(incoming));

        assertEquals("Category not found", ex.getMessage());
        // product must never be saved if category is invalid
        verify(productRepository, never()).save(any());
    }

    @Test
    @DisplayName("Get all products successfully")
    void getAllProducts_shouldReturnAllProducts() {
        Category c = buildCategory(1L, "Women");
        Product p1 = buildProduct(1L, "Floral Dress", "UrbanVogue", 1299.0, 50, c);
        Product p2 = buildProduct(2L, "Slim Jeans",   "UrbanVogue", 2499.0, 30, c);
        when(productRepository.findAll()).thenReturn(Arrays.asList(p1, p2));

        List<Product> results = productService.getAllProducts();

        assertEquals(2, results.size());
        assertEquals("Floral Dress", results.get(0).getName());
        assertEquals("Slim Jeans",   results.get(1).getName());
    }

    @Test
    @DisplayName("Return empty list when no products exist")
    void getAllProducts_shouldReturnEmptyList_whenNoProducts() {
        when(productRepository.findAll()).thenReturn(new ArrayList<>());

        List<Product> results = productService.getAllProducts();

        assertNotNull(results);
        assertTrue(results.isEmpty());
    }

    @Test
    @DisplayName("Get product by ID successfully when found")
    void getProductById_shouldReturnProduct_whenFound() {
        Category c = buildCategory(1L, "Women");
        Product p = buildProduct(1L, "Floral Dress", "UrbanVogue", 1299.0, 50, c);
        when(productRepository.findById(1L)).thenReturn(Optional.of(p));

        Product result = productService.getProductById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Floral Dress", result.getName());
    }

    @Test
    @DisplayName("Fail to get product by ID when not found")
    void getProductById_shouldThrow_whenProductNotFound() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> productService.getProductById(999L));

        assertEquals("Product not found", ex.getMessage());
    }

    @Test
    @DisplayName("Update product successfully when product and category exist")
    void updateProduct_shouldUpdateAllFields_whenProductAndCategoryExist() {
        Category oldCategory = buildCategory(1L, "Women");
        Category newCategory = buildCategory(2L, "Men");

        Product existing = buildProduct(1L, "Floral Dress", "OldBrand",
                999.0, 20, oldCategory);
        when(productRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(categoryRepository.findById(2L)).thenReturn(Optional.of(newCategory));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArgument(0));

        // The updated data coming in from the request
        Product updatedData = buildProduct(null, "Polo Shirt", "NewBrand",
                1500.0, 40, newCategory);

        Product result = productService.updateProduct(1L, updatedData);

        assertEquals("Polo Shirt",  result.getName());
        assertEquals("NewBrand",    result.getBrand());
        assertEquals(1500.0,        result.getPrice(), 0.01);
        assertEquals(40,            result.getStock());
        assertEquals("Men",         result.getCategory().getName());
        verify(productRepository, times(1)).save(any(Product.class));
    }


    @Test
    @DisplayName("Delete product successfully by ID")
    void deleteProduct_shouldCallDeleteById() {
        doNothing().when(productRepository).deleteById(1L);

        productService.deleteProduct(1L);

        verify(productRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Reduce stock by given quantity successfully")
    void reduceStock_shouldDecreaseStockByGivenQuantity() {
        Category c = buildCategory(1L, "Women");
        Product product = buildProduct(1L, "Floral Dress", "UrbanVogue",
                1299.0, 50, c); // stock = 50
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArgument(0));

        Product result = productService.reduceStock(1L, 10); // reduce by 10

        assertEquals(40, result.getStock()); // 50 - 10 = 40
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("Stock cannot go below zero when reducing more than available")
    void reduceStock_shouldFloorToZero_whenQuantityExceedsStock() {
        Category c = buildCategory(1L, "Women");
        Product product = buildProduct(1L, "Floral Dress", "UrbanVogue",
                1299.0, 5, c); // stock = 5
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArgument(0));

        Product result = productService.reduceStock(1L, 100); // reduce by 100

        // Stock must never go negative — floors to 0
        assertEquals(0, result.getStock());
    }


    @Test
    @DisplayName("Add category successfully")

    void addCategory_shouldSaveAndReturnCategory() {
        Category incoming = buildCategory(null, "Kids");
        Category saved    = buildCategory(3L,   "Kids");
        when(categoryRepository.save(any(Category.class))).thenReturn(saved);

        Category result = categoryService.addCategory(incoming);

        assertNotNull(result);
        assertEquals(3L,     result.getId());
        assertEquals("Kids", result.getName());
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    @DisplayName("Get all categories successfully")
    void getAllCategories_shouldReturnAllCategories() {
        Category c1 = buildCategory(1L, "Women");
        Category c2 = buildCategory(2L, "Men");
        Category c3 = buildCategory(3L, "Kids");
        when(categoryRepository.findAll()).thenReturn(Arrays.asList(c1, c2, c3));

        List<Category> results = categoryService.getAllCategories();

        assertEquals(3, results.size());
        assertEquals("Women", results.get(0).getName());
        assertEquals("Men",   results.get(1).getName());
        assertEquals("Kids",  results.get(2).getName());
    }

    @Test
    @DisplayName("Get category by ID successfully when found")
    void getCategoryById_shouldReturnCategory_whenFound() {
        Category c = buildCategory(1L, "Women");
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(c));

        Category result = categoryService.getCategoryById(1L);

        assertNotNull(result);
        assertEquals(1L,      result.getId());
        assertEquals("Women", result.getName());
    }

    @Test
    @DisplayName("Update category name successfully")
    void updateCategory_shouldUpdateNameAndReturnCategory() {
        Category existing = buildCategory(1L, "Women");
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(categoryRepository.save(any(Category.class))).thenAnswer(i -> i.getArgument(0));

        Category updatedData = buildCategory(null, "Ladies");

        Category result = categoryService.updateCategory(1L, updatedData);

        assertEquals("Ladies", result.getName()); // name must be updated
        assertEquals(1L, result.getId());          // id must stay the same
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    @DisplayName("Fail to delete category if products are still attached")
    void deleteCategory_shouldThrow_whenCategoryHasProducts() {
        // DataIntegrityViolationException = DB foreign key constraint fires
        // because products still reference this category
        doThrow(new DataIntegrityViolationException("FK constraint"))
                .when(categoryRepository).deleteById(1L);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> categoryService.deleteCategory(1L));

        assertEquals("Category has products. Delete them first.", ex.getMessage());
    }
}
