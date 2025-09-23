package Project01.AWS.MealPlan.model.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Tự động tăng
    @Column(name = "user_id") // PK cột user_id
    private Long userId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 15)
    private String phone;

    @Column(length = 255)
    private String address;

    @Column(nullable = false, length = 20)
    private String role; // ví dụ: ADMIN, CUSTOMER

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private boolean active;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Order> orders = new HashSet<>();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Cart carts;
}
