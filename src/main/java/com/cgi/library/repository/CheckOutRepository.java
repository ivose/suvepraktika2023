package com.cgi.library.repository;

import com.cgi.library.entity.Book;
import com.cgi.library.entity.CheckOut;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

@Repository
public interface CheckOutRepository extends JpaRepository<CheckOut, UUID> {
    @Query("SELECT c FROM CheckOut c WHERE " +
            "LOWER(c.borrowerFirstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(c.borrowerLastName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<CheckOut> searchByBorrowerName(@Param("searchTerm") String searchTerm, Pageable pageable);
}
