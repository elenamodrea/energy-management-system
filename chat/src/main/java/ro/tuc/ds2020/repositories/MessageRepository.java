package ro.tuc.ds2020.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ro.tuc.ds2020.entities.Message;

import java.util.List;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {
    @Query("SELECT m FROM Message m " +
            "WHERE (m.sender = :user1 AND m.receiver = :user2) OR (m.sender = :user2 AND m.receiver = :user1) " +
            "ORDER BY m.dateTime ASC")
    List<Message> findAllMessagesBetweenUsersSortedByDateTime(
            @Param("user1") String user1,
            @Param("user2") String user2
    );
    @Query("SELECT m FROM Message m " +
            "WHERE (m.sender = :user1 AND m.receiver = :user2)  " +
            "ORDER BY m.dateTime ASC")
    List<Message> findAllMessagesBetweenSenderAndReceiverSortedByDateTime(
            @Param("user1") String user1,
            @Param("user2") String user2
    );
}
