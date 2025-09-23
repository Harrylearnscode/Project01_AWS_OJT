package Project01.AWS.MealPlan.model.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recipes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recipe_id")
    private Long recipeId;

    @Column(nullable = false, length = 50)
    private String type;

    @Column(nullable = false)
    private Integer step; // thứ tự bước

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @ManyToOne
    @JoinColumn(name = "dish_id", nullable = false)
    private Dish dish;
}
