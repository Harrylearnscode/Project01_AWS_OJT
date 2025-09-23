package Project01.AWS.MealPlan.model.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "customer_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    private String address;

    @Column(name = "order_time")
    private LocalDateTime orderTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "delivery_price")
    private Double deliveryPrice;

    @Column(name = "ingredients_price")
    private Double ingredientsPrice;

    @Column(name = "total_price")
    private Double totalPrice;

    private String status;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<OrderIngredient> orderIngredients = new HashSet<>();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<OrderDish> orderDishes = new HashSet<>();
}

