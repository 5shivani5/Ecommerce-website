package app.ecom.product.service;

import app.ecom.product.entity.Category;

import java.util.List;

public interface CategoryService {

    Category addCategory(Category category);

    List<Category> getAllCategories();

    Category getCategoryById(Long id);

    Category updateCategory(Long id, Category category);

    void deleteCategory(Long id);
}