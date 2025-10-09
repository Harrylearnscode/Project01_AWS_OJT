package Project01.AWS.MealPlan.model.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_ingredient",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"order_id", "ingredient_id"})
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderIngredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_dish_id", nullable = false)
    private OrderDish orderDish;

    @ManyToOne
    @JoinColumn(name = "ingredient_id", nullable = false)
    private Ingredient ingredient;

    private Integer quantity;
}
