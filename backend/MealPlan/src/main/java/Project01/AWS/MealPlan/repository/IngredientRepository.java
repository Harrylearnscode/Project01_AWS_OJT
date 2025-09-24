package Project01.AWS.MealPlan.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import Project01.AWS.MealPlan.model.entities.Ingredient;

import org.springframework.stereotype.Repository;
@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {

}