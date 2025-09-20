package Project01.AWS.MealPlan.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "dishes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Dish {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dishId;

    private String name;
    private String description;
    private Integer prepareTime;
    private Integer cookingTime;
    private Integer totalTime;
    private String imgUrl;
    private boolean active;

    @ManyToOne
    @JoinColumn(name = "country")
    private Country country;

    @ManyToMany
    @JoinTable(
            name = "dish_ingredients",
            joinColumns = @JoinColumn(name = "dish_id"),
            inverseJoinColumns = @JoinColumn(name = "ingredient_id")
    )
    private java.util.List<Ingredient> ingredients;

    @ManyToMany
    @JoinTable(
            name = "dish_types",
            joinColumns = @JoinColumn(name = "dish_id"),
            inverseJoinColumns = @JoinColumn(name = "type_id")
    )
    private java.util.List<Type> dishTypes;

    @OneToMany(mappedBy = "dish")
    private java.util.List<Recipe> recipes;
}
