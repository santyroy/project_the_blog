package com.demo.service;

import com.demo.dto.BlogRequestDTO;
import com.demo.entity.Blog;
import com.demo.entity.User;
import com.demo.exception.BlogNotFoundException;
import com.demo.exception.UserNotFoundException;
import com.demo.repository.BlogRepository;
import com.demo.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BlogService {

    private static final Logger LOGGER = LoggerFactory.getLogger(BlogService.class);

    private final BlogRepository blogRepository;
    private final UserRepository userRepository;


    public BlogService(BlogRepository repository, UserRepository userRepository) {
        this.blogRepository = repository;
        this.userRepository = userRepository;
    }

    public Blog addNewBlog(BlogRequestDTO blogRequestDTO) {
        int userId = Integer.parseInt(blogRequestDTO.userId());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
        Blog blog = new Blog(blogRequestDTO.title(), blogRequestDTO.content(), LocalDateTime.now(), LocalDateTime.now(), user);
        return blogRepository.save(blog);
    }

    public List<Blog> getAllBLogs() {
        return blogRepository.findAll();
    }

    public Blog getBlogById(Integer id) {
        return blogRepository.findById(id).orElseThrow(() -> new BlogNotFoundException("Blog not found with id: " + id));
    }

    public Blog updateBlogById(Integer id, BlogRequestDTO blogRequestDTO) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new BlogNotFoundException("Blog not found with id: " + id));
        blog.setTitle(blogRequestDTO.title());
        blog.setContent(blogRequestDTO.content());
        blog.setModified(LocalDateTime.now());
        return blogRepository.save(blog);
    }

    public void deleteBlogById(Integer id) {
        blogRepository.findById(id).orElseThrow(() -> new BlogNotFoundException("Blog not found with id: " + id));
        blogRepository.deleteById(id);
    }

    public List<Blog> getBlogByUserId(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
        return blogRepository.findByUser(user);
    }

    public Page<Blog> getBlogPageByUserId(Integer userId, Integer pageNo) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
        Pageable pageWithFive = PageRequest.of(pageNo, 10, Sort.by(Sort.Direction.DESC, "created"));
        return blogRepository.findByUser(user, pageWithFive);
    }

    public List<Blog> searchBlogByUser(Integer userId, String title) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
        return blogRepository.searchBlogByUser(user, title);
    }
}
