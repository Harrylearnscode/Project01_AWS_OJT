package Project01.AWS.MealPlan.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "cart_dish")
@Getter
@Setter
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

    @OneToMany(mappedBy = "cartDish", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<CartIngredient> ingredients = new HashSet<>();

    private Integer quantity;
}
