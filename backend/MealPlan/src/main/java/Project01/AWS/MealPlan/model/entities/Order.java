package Project01.AWS.MealPlan.model.entities;

import Project01.AWS.MealPlan.model.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    private String address;

    private String phoneNumber;

    private String canceledReason;

    private String payUrl;

    @Column(name = "order_time")
    private LocalDateTime orderTime;

    @Column(name = "canceled_at")
    private LocalDateTime canceledAt;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "delivery_price")
    private Double deliveryPrice;

    @Column(name = "total_price")
    private Double totalPrice;

    @Column(name = "total_calories")
    private Double totalCalories;

    @Column(name = "paid_time")
    private LocalDateTime paidTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<OrderDish> orderDishes = new HashSet<>();
}

