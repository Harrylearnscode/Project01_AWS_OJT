package Project01.AWS.MealPlan.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "types")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Type {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long typeId;

    private String name;

    @ManyToMany(mappedBy = "dishTypes")
    private java.util.List<Dish> dishes;
}

