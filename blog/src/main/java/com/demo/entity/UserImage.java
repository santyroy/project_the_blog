package com.demo.entity;

import jakarta.persistence.*;

@Entity
public class UserImage {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    private String path;
    @OneToOne
    private User user;

    public UserImage() {
    }

    public UserImage(String path, User user) {
        this.path = path;
        this.user = user;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
