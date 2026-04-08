package app.ecom.product.service.impl;

import app.ecom.product.entity.Category;
import app.ecom.product.repository.CategoryRepository;
import app.ecom.product.repository.ProductRepository;
import app.ecom.product.service.CategoryService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    // ✅ Constructor Injection
    public CategoryServiceImpl(CategoryRepository categoryRepository,
                               ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    // ✅ Add Category
    @Override
    public Category addCategory(Category category) {
        return categoryRepository.save(category);
    }

    // ✅ Get All Categories
    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // ✅ Get Category By ID
    @Override
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id " + id));
    }

    // ✅ Update Category
    @Override
    public Category updateCategory(Long id, Category category) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id " + id));

        existing.setName(category.getName());

        return categoryRepository.save(existing);
    }

    // ✅ Delete Category (SAFE)

    @Override
    public void deleteCategory(Long id) {
        try {
            categoryRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Category has products. Delete them first.");
        }
    }
    }
