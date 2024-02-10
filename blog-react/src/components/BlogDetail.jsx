import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const initial = {
  title: "",
  content: "",
  createdDate: "",
  modifiedDate: "",
  userId: "",
};

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(initial);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const postedDateString = new Date(blog.createdDate).toDateString();
  const modifiedDateString = new Date(blog.modifiedDate).toDateString();
  const postedTimeString = new Date(blog.createdDate).toLocaleTimeString();
  const modifiedTimeString = new Date(blog.modifiedDate).toLocaleTimeString();
  const token = localStorage.getItem("jwt");

  useEffect(() => {
    getBlogDetails();
  }, [id]);

  async function getBlogDetails() {
    setIsLoading(true);
    try {
      if (token !== null) {
        const response = await fetch(
          `http://localhost:8080/api/v1/blogs/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status == 200) {
          const apiData = await response.json();
          setBlog({
            ...blog,
            title: apiData.data.title,
            content: apiData.data.content,
            createdDate: apiData.data.createdDate,
            modifiedDate: apiData.data.modifiedDate,
            userId: apiData.data.userId,
          });
          getUserName(apiData.data.userId);
        } else if (response.status == 401) {
          setError("Unauthorized");
        } else if (response.status == 500) {
          setError("Something went wrong");
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function getUserName(userId) {
    if (token != null) {
      const response = await fetch(
        `http://localhost:8080/api/v1/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.status === "200") {
        setUsername(data.data.name);
      }
    }
  }

  async function handleDelete() {
    const response = await fetch(`http://localhost:8080/api/v1/blogs/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (data.status === "200") {
      navigate("/blogs");
    } else {
      setError(data.message);
      console.log("Error: ", data.message);
    }
  }

  function handleEdit() {
    navigate(`/blogs/${id}/edit`);
  }

  if (isLoading) {
    return (
      <div className="container mt-5">
        <h2>Loading...</h2>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-2">
        <h3 className="fs-1">{blog.title}</h3>
        {error && <span>{error}</span>}
        <div>
          <button
            className="btn btn-warning me-2"
            title="Edit"
            onClick={handleEdit}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
            >
              <path d="M160-400v-80h280v80H160Zm0-160v-80h440v80H160Zm0-160v-80h440v80H160Zm360 560v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T863-380L643-160H520Zm300-263-37-37 37 37ZM580-220h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z" />
            </svg>
          </button>
          <button
            className="btn btn-danger"
            title="Delete"
            onClick={handleDelete}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
            >
              <path
                d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="bg-body-secondary d-flex justify-content-between px-2 py-1 rounded">
        <div>
          <p className="mb-1">By: {username}</p>
          <span className="badge text-bg-primary"># {id}</span>
        </div>
        <div>
          <div className="text-end">
            <small>
              Posted: {postedDateString} - {postedTimeString}
            </small>
          </div>
          <div className="text-end">
            <small>
              Modified: {modifiedDateString} - {modifiedTimeString}
            </small>
          </div>
        </div>
      </div>
      <p className="fs-5 mt-3">{blog.content}</p>
    </div>
  );
}

export default BlogDetail;
