package com.demo.controller;

import com.demo.dto.BlogRequestDTO;
import com.demo.dto.BlogResponseDTO;
import com.demo.dto.ResponseDTO;
import com.demo.entity.Blog;
import com.demo.service.BlogService;
import com.demo.util.Convertor;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.demo.util.Convertor.convertBlogToResponseDTO;

@RestController
@RequestMapping("/api/v1/blogs")
public class BlogController {

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @PostMapping
    public ResponseEntity<ResponseDTO> addNewBlog(@Valid @RequestBody BlogRequestDTO blogRequestDTO) {
        Blog savedBlog = blogService.addNewBlog(blogRequestDTO);
        BlogResponseDTO blogResponseDTO = convertBlogToResponseDTO(savedBlog);
        return new ResponseEntity<>(
                new ResponseDTO(true, "201", "Blog created successfully", blogResponseDTO),
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ResponseDTO> getBlogs() {
        List<Blog> blogList = blogService.getAllBLogs();
        List<BlogResponseDTO> blogResponseDTOList = blogList.stream().map(Convertor::convertBlogToResponseDTO).toList();
        return new ResponseEntity<>(
                new ResponseDTO(true, "200", "Blog retrieval successful", blogResponseDTOList),
                HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseDTO> getBlogById(@PathVariable Integer id) {
        Blog blog = blogService.getBlogById(id);
        BlogResponseDTO blogResponseDTO = convertBlogToResponseDTO(blog);
        return new ResponseEntity<>(
                new ResponseDTO(true, "200", "Blog retrieval successful", blogResponseDTO),
                HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ResponseDTO> getBlogByUserId(@PathVariable Integer userId) {
        List<Blog> blogs = blogService.getBlogByUserId(userId);
        List<BlogResponseDTO> blogsResponse = blogs.stream().map(Convertor::convertBlogToResponseDTO).toList();
        return new ResponseEntity<>(
                new ResponseDTO(true, "200", "Blog retrieval successful", blogsResponse),
                HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseDTO> updateBlogById(@PathVariable Integer id,
                                                      @Valid @RequestBody BlogRequestDTO blogRequestDTO) {
        Blog blog = blogService.updateBlogById(id, blogRequestDTO);
        BlogResponseDTO blogResponseDTO = convertBlogToResponseDTO(blog);
        return new ResponseEntity<>(
                new ResponseDTO(true, "200", "Blog updated successful", blogResponseDTO), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO> deleteBlogById(@PathVariable Integer id) {
        blogService.deleteBlogById(id);
        return new ResponseEntity<>(
                new ResponseDTO(true, "200", "Blog deleted successfully", null),
                HttpStatus.OK);
    }

    @GetMapping("/user/{userId}/page")
    public ResponseEntity<ResponseDTO> getBlogPageByUserId(@PathVariable Integer userId,
                                                           @RequestParam("pageNo") Integer pageNo) {
        Page<Blog> blogsPage = blogService.getBlogPageByUserId(userId, pageNo);
        List<BlogResponseDTO> blogsResponse = blogsPage.getContent().stream().map(Convertor::convertBlogToResponseDTO).toList();
        Map<String, Object> blogData = new HashMap<>();
        blogData.put("totalPages", blogsPage.getTotalPages());
        blogData.put("content", blogsResponse);
        blogData.put("pageable", blogsPage.getPageable());
        return new ResponseEntity<>(
                new ResponseDTO(true, "200", "Blog retrieval successful", blogData),
                HttpStatus.OK);
    }

    @GetMapping("/user/{userId}/search")
    public ResponseEntity<ResponseDTO> getBlogBySearchParams(@PathVariable Integer userId,
                                                             @RequestParam(name = "title") String title) {
        List<Blog> blogList = blogService.searchBlogByUser(userId, title);
        List<BlogResponseDTO> blogResponseDTOList = blogList.stream().map(Convertor::convertBlogToResponseDTO).toList();
        return new ResponseEntity<>(new ResponseDTO(true, "200", "Search completed", blogResponseDTOList), HttpStatus.OK);
    }
}
