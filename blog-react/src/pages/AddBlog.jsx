import { useState } from "react";

import { useOutletContext } from "react-router-dom";

const initial = {
  title: "",
  content: "",
  userId: "",
};

function AddBlog({ userId }) {
  const { blogs, setBlogs } = useOutletContext();

  const [newBlogData, setNewBlogData] = useState(initial);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const saveBlog = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      let blog = { ...newBlogData };
      blog.userId = userId;
      setNewBlogData(blog);

      const token = localStorage.getItem("jwt");
      const response = await fetch("http://localhost:8080/api/v1/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(blog),
      });

      const data = await response.json();

      if (response.status === 201) {
        setBlogs([...blogs, data.data]);
        setSuccessMsg(data.message);
        // navigate("/blog");
        setNewBlogData(initial);
      } else if (response.status === 400) {
        setError(data.message);
      } else if (response.status === 401) {
        setError("Unauthorized");
      }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-3 mb-5 shadow-lg p-4 bg-body-secondary rounded">
      <div className="mb-3">
        <label
          htmlFor="exampleFormControlInput1"
          className="form-label fw-semibold"
        >
          Title
        </label>
        <input
          type="text"
          className="form-control"
          id="exampleFormControlInput1"
          onChange={(event) =>
            setNewBlogData({ ...newBlogData, title: event.target.value })
          }
          value={newBlogData.title}
        />
      </div>
      <div className="mb-3">
        <label
          htmlFor="exampleFormControlTextarea1"
          className="form-label fw-semibold"
        >
          Content
        </label>
        <textarea
          maxLength={2000}
          className="form-control"
          id="exampleFormControlTextarea1"
          rows="10"
          onChange={(event) =>
            setNewBlogData({ ...newBlogData, content: event.target.value })
          }
          value={newBlogData.content}
        ></textarea>
      </div>
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-success"
          onClick={(event) => saveBlog(event)}
        >
          Save
        </button>
        <small>{newBlogData.content.length}/2000 characters</small>
      </div>
      <div className="mt-3">
        {loading && (
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
        {error && <p className="fs-6 fw-semibold text-danger">{error}</p>}
        {successMsg && (
          <p className="fs-6 fw-semibold text-success">{successMsg}</p>
        )}
      </div>
    </div>
  );
}

export default AddBlog;
