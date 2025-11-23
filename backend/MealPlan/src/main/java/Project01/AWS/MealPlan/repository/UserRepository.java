package Project01.AWS.MealPlan.repository;


import Project01.AWS.MealPlan.model.entities.Order;
import Project01.AWS.MealPlan.model.enums.UserStatus;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import Project01.AWS.MealPlan.model.entities.User;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findAllByActive(boolean active);
    Optional<User> findByUserIdAndActive(Long userId, boolean active);
      Optional<User> findByEmail(String email);

    Optional<User> findByName(String name);
    Optional<User> findByVerificationCode(String verificationCode);
    @Query("SELECT c FROM User c WHERE LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<User> searchUsers(@Param("keyword") String keyword, Pageable pageable);
    Optional<User> findBySub(String sub);
}
