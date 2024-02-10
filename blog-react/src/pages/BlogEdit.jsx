import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const initial = {
  title: "",
  content: "",
  userId: "",
};

function BlogEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");

  const [blogData, setBlogData] = useState(initial);
  const [error, setError] = useState("");

  useEffect(() => {
    getBlogDetails();
  }, [id]);

  async function getBlogDetails() {
    try {
      if (token !== null) {
        const response = await fetch(
          `http://localhost:8080/api/v1/blogs/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status == 200) {
          const apiData = await response.json();
          setBlogData({
            ...blogData,
            title: apiData.data.title,
            content: apiData.data.content,
            userId: apiData.data.userId,
          });
        } else if (response.status == 401) {
          setError("Unauthorized");
        } else if (response.status == 500) {
          setError("Something went wrong");
        }
      }
    } catch (error) {
      setError(error.message);
    }
  }

  async function updateBlog() {
    const response = await fetch(`http://localhost:8080/api/v1/blogs/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(blogData),
    });
    const data = await response.json();
    if (data.status === "200") {
      navigate("/blogs");
    }
  }

  return (
    <div className="container my-3 shadow p-4 bg-body-secondary rounded">
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
            setBlogData({ ...blogData, title: event.target.value })
          }
          value={blogData.title}
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
          className="form-control"
          id="exampleFormControlTextarea1"
          rows="10"
          maxLength={2000}
          onChange={(event) =>
            setBlogData({ ...blogData, content: event.target.value })
          }
          value={blogData.content}
        ></textarea>
      </div>
      <div className="d-flex justify-content-between">
        <div>
          <button className="btn btn-success me-2" onClick={updateBlog}>
            Update
          </button>
          <button
            className="btn btn-info"
            onClick={() => navigate(`/blogs/${id}`)}
          >
            Cancel
          </button>
        </div>
        <small>{blogData.content.length}/2000 characters</small>
      </div>
      {error && <p>{error}</p>}
    </div>
  );
}

export default BlogEdit;
