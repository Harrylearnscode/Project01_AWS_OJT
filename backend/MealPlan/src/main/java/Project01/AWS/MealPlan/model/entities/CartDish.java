package Project01.AWS.MealPlan.model.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "cart_dish",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"cart_id", "dish_id"})
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartDish {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_dish_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "dish_id", nullable = false)
    private Dish dish;

    private Integer quantity;
}
