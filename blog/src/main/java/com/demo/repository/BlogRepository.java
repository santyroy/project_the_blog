package com.demo.repository;

import com.demo.entity.Blog;
import com.demo.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BlogRepository extends JpaRepository<Blog, Integer> {

    List<Blog> findByUser(User user);
//    List<Blog> findByUser(User user, Pageable pageable);
    Page<Blog> findByUser(User user, Pageable pageable);

    @Query(value = "SELECT b FROM Blog b WHERE b.user = :user AND b.title ILIKE %:title%")
    List<Blog> searchBlogByUser(@Param("user") User user, @Param("title") String title);
}
