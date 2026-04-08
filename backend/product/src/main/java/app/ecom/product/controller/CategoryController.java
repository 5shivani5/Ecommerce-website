package app.ecom.product.controller;

import app.ecom.product.entity.Category;
import app.ecom.product.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // ✅ Add Category
    @PostMapping
    public Category addCategory(@RequestBody Category category) {
        return categoryService.addCategory(category);
    }

    // ✅ Get All Categories
    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    // ✅ Get Category by ID
    @GetMapping("/{id}")
    public Category getCategory(@PathVariable Long id) {
        return categoryService.getCategoryById(id);
    }

    // ✅ UPDATE Category
    @PutMapping("/{id}")
    public Category updateCategory(@PathVariable Long id,
                                   @RequestBody Category category) {
        return categoryService.updateCategory(id, category);
    }


    // ✅ Delete Category
    @DeleteMapping("/{id}")
    public String deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return "Category deleted successfully";
    }
}