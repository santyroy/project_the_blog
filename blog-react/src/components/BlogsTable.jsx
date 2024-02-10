import PropTypes from "prop-types";
import { useEffect, useState } from "react";

function BlogsTable({ user }) {
  const BASE_URL = "http://localhost:8080/api/v1";
  const token = localStorage.getItem("jwt");

  const name = user.name;
  const [blogIds, setBlogIds] = useState([]);

  useEffect(() => {
    setBlogIds(user.blogIds);
  }, [user.blogIds]);

  const deleteBlog = async (id) => {
    try {
      ("http://localhost:8080/api/v1/users/303");
      const response = await fetch(`${BASE_URL}/blogs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      });

      if (response.status === 200) {
        const filteredIds = blogIds.filter((blogId) => blogId !== id);
        setBlogIds(filteredIds);
      }
    } catch (e) {
      console.log(`Delete Blog: ${e}`);
    }
  };

  return (
    <div className="mt-5">
      {blogIds.length > 0 ? (
        <table className="table table-striped caption-top mb-3 shadow p-2 mb-5 bg-body-tertiary rounded">
          <caption>
            <span className="me-5">
              Blogs of user <strong>&quot;{name}&quot;</strong>
            </span>
            <span>
              Total: <strong>{blogIds.length}</strong>
            </span>
          </caption>
          <thead className="table-dark">
            <tr>
              <th scope="col">BLOG ID</th>
              <th scope="col">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {blogIds.map((id) => (
              <tr key={id}>
                <th scope="row">{id}</th>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteBlog(id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="fs-5 text-danger">User does not have any blogs 😢</p>
      )}
    </div>
  );
}

BlogsTable.propTypes = {
  user: PropTypes.object,
};

export default BlogsTable;
