import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import BlogSearch from "../components/BlogSearch";

import PropTypes from "prop-types";

function BlogList({ user }) {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumberList, setPageNumberList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const controllerRef = useRef();

  const token = localStorage.getItem("jwt");
  // const controller = new AbortController();

  useEffect(() => {
    controllerRef.current = new AbortController();
    async function getAllBlogs() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/blogs/user/${user.userId}/page?pageNo=${currentPage}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            signal: controllerRef.current.signal,
          }
        );

        const data = await response.json();
        setBlogs(data.data.content);
        const pages = data.data.totalPages;
        setTotalPages(pages);
        initializePageNumbers(pages);
      } catch (e) {
        if (e.name === "AbortError") {
          console.log("Request Aborted");
        }
      } finally {
        setIsLoading(false);
      }
    }

    getAllBlogs();
  }, [currentPage, user.userId, token]);

  useEffect(() => {
    async function getUserDetails() {
      if (token != null) {
        const response = await fetch(
          `http://localhost:8080/api/v1/users/${user.userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        if (data.status === "200") {
          setUsername(data.data.name);
        }
      }
    }

    getUserDetails();
  }, [user.userId, token]);

  function initializePageNumbers(pages) {
    let temp = [];
    for (let index = 0; index < pages; index++) {
      temp.push(index);
    }
    setPageNumberList(temp);
  }

  function handleNextPage(e) {
    e.preventDefault();
    controllerRef.current.abort();

    setCurrentPage((current) => {
      if (current < totalPages - 1) {
        return current + 1;
      } else {
        return current;
      }
    });
  }

  function handlePrevPage(e) {
    e.preventDefault();
    controllerRef.current.abort();

    setCurrentPage((current) => {
      if (current <= totalPages - 1) {
        return current - 1;
      } else {
        return current;
      }
    });
  }

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between mb-5">
        <NavLink to={"/blogs/add"}>
          <button className="btn btn-warning">Add Blog</button>
        </NavLink>
        <BlogSearch userId={user.userId} setBlogs={setBlogs} token={token} />
      </div>

      <Outlet context={{ blogs, setBlogs }} />

      <div style={{ minHeight: "500px" }}>
        {isLoading ? (
          <div>
            <h2>Loading...</h2>
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
            {blogs !== undefined && blogs.length > 0 ? (
              blogs.map((blog) => (
                <div className="col" key={blog.id}>
                  <BlogCard blog={blog} username={username} />
                </div>
              ))
            ) : (
              <p className="fs-4">No Blogs 😢</p>
            )}
          </div>
        )}
      </div>

      <nav aria-label="Page navigation" className="mt-5">
        <ul className="pagination">
          <li className="page-item">
            <button
              className={`page-link ${currentPage === 0 && "disabled"}`}
              onClick={handlePrevPage}
            >
              Previous
            </button>
          </li>

          {pageNumberList.map((i) => (
            <li key={i} className="page-item">
              <button
                key={i}
                className={`page-link ${currentPage === i && "active"}`}
                onClick={() => setCurrentPage(i)}
              >
                {i + 1}
              </button>
            </li>
          ))}

          <li
            className={`page-item ${
              currentPage === totalPages - 1 && "disabled"
            }`}
          >
            <button className="page-link" onClick={handleNextPage}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

BlogList.propTypes = {
  user: PropTypes.object,
};

export default BlogList;
