package Project01.AWS.MealPlan.model.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "orders_dishes",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"order_id", "dish_id"})
        })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDish {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "dish_id", nullable = false)
    private Dish dish;

    private Integer quantity;
}
