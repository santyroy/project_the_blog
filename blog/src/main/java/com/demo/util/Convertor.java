package com.demo.util;

import com.demo.dto.BlogResponseDTO;
import com.demo.dto.UserResponseDTO;
import com.demo.entity.Blog;
import com.demo.entity.User;

import java.util.Set;
import java.util.stream.Collectors;

public class Convertor {

    public static UserResponseDTO convertToUserResponseDTO(User user) {
        Set<Integer> blogResponseDTOList =
                user.getBlogs().stream().map(Blog::getId).collect(Collectors.toSet());
        return new UserResponseDTO(
                String.valueOf(user.getId()),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                blogResponseDTOList);
    }

    public static BlogResponseDTO convertBlogToResponseDTO(Blog blog) {
        return new BlogResponseDTO(
                blog.getId(),
                blog.getTitle(),
                blog.getContent(),
                blog.getCreated(),
                blog.getModified(),
                String.valueOf(blog.getUser().getId())
        );
    }
}
