package Project01.AWS.MealPlan.model.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "cart_ingredient",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"cart_dish_id", "ingredient_id"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartIngredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_ingredient_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_dish_id", nullable = false)
    private CartDish cartDish;

    @ManyToOne
    @JoinColumn(name = "ingredient_id", nullable = false)
    private Ingredient ingredient;

    private Integer quantity;
}
