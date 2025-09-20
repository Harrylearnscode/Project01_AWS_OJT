package Project01.AWS.MealPlan.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "countries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Country {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long countryId;

    private String name;
    private String continent;

    @OneToMany(mappedBy = "country")
    private java.util.List<Dish> dishes;
}

