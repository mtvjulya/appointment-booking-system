package ie.gov.appointments.repository;
 
import ie.gov.appointments.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
import java.util.List;
 
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUser_UserId(Long userId);
    List<Notification> findByUser_UserIdOrderBySentAtDesc(Long userId);
}