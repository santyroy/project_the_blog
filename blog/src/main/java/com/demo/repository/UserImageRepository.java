package com.demo.repository;

import com.demo.entity.User;
import com.demo.entity.UserImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserImageRepository extends JpaRepository<UserImage, Integer> {

    Optional<UserImage> findByUser(User user);
}
