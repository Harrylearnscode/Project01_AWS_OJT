package Project01.AWS.MealPlan.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @Column(name = "user_account")
    private String userAccount;

    private String name;
    private String phone;
    private String address;
    private String role;
    private String password;
    private boolean active;

    @OneToMany(mappedBy = "user")
    private java.util.List<Order> orders;

    @OneToOne(mappedBy = "user")
    private ShoppingCart shoppingCart;
}
