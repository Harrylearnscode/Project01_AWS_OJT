package Project01.AWS.MealPlan.repository;

import Project01.AWS.MealPlan.model.enums.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import Project01.AWS.MealPlan.model.entities.User;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findAllByActive(boolean active);
    Optional<User> findByUserIdAndActive(Long userId, boolean active);
}
