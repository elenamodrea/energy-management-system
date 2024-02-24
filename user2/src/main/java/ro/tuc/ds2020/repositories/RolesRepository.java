package ro.tuc.ds2020.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ro.tuc.ds2020.entities.Roles;

import java.util.UUID;

public interface RolesRepository extends JpaRepository<Roles, UUID> {
    @Query(value = "SELECT r " +
            "FROM Roles r " +
            "WHERE r.roleType = :roleType " )
    Roles findRolesByType(@Param("roleType") String roleType);
}
