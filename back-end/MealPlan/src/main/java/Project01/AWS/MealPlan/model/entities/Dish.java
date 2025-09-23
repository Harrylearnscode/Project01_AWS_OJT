package Project01.AWS.MealPlan.model.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "dishes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Dish {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dish_id")
    private Long dishId;

    @Column(nullable = false, length = 100)
    private String name;

    private String description;

    @Column(name = "prepare_time")
    private Integer prepareTime;

    @Column(name = "cooking_time")
    private Integer cookingTime;

    @Column(name = "total_time")
    private Integer totalTime;

    @Column(name = "img_url")
    private String imgUrl;

    @Column(nullable = false)
    private boolean active;

    @Column
    private Double price;

    @ManyToOne
    @JoinColumn(name = "country_id", nullable = false)
    private Country country;

    @OneToMany(mappedBy = "dish", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<DishIngredient> dishIngredients = new HashSet<>();

    @OneToMany(mappedBy = "dish", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Recipe> recipes = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "dish_types",
            joinColumns = @JoinColumn(name = "dish_id"),
            inverseJoinColumns = @JoinColumn(name = "type_id")
    )
    @Builder.Default
    private Set<Type> dishTypes = new HashSet<>();
}
