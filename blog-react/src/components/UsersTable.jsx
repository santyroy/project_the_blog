import { useEffect, useState } from "react";
import Modal from "./Modal";
import ModalDelete from "./ModalDelete";
import BlogsTable from "./BlogsTable";

const initialUser = { userId: "", name: "", email: "", role: "", blogIds: [] };

function UsersTable() {
  const BASE_URL = "http://localhost:8080/api/v1";
  const token = localStorage.getItem("jwt");

  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(initialUser);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUserBlog, setShowUserBlog] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
        });
        const users = await response.json();
        setUsers(users.data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchUsers();
  }, [token]);

  const deleteUser = async (e, userId) => {
    e.preventDefault();
    try {
      ("http://localhost:8080/api/v1/users/303");
      const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      });

      if (response.status === 200) {
        const filteredUser = users.filter((user) => user.userId !== userId);
        setUsers(filteredUser);
        setShowDeleteModal(false);
      }
    } catch (e) {
      console.log(`Delete User: ${e}`);
    }
  };

  const updateUser = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/users/${currentUser.userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
        }),
      });

      if (response.status === 200) {
        const updatedUser = await response.json();
        const data = updatedUser.data;
        const tempUsers = users.map((user) => {
          if (user.userId === data.userId) {
            user.name = data.name;
            user.email = data.email;
            user.role = data.role;
          }
          return user;
        });
        setShowEditModal(false);
        setUsers(tempUsers);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <table className="table table-hover caption-top mb-3 shadow p-2 mb-5 bg-body-tertiary rounded">
        <caption>List of users</caption>

        <thead className="table-dark">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">NAME</th>
            <th scope="col">EMAIL</th>
            <th scope="col">ROLE</th>
            <th scope="col">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 &&
            users.map((user) => (
              <tr key={user.userId}>
                <th scope="row">{user.userId}</th>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => {
                      setCurrentUser({ ...user });
                      setShowUserBlog(true);
                    }}
                  >
                    Show Blogs
                  </button>
                  <button
                    className="btn btn-warning me-4"
                    onClick={() => {
                      setCurrentUser({ ...user });
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      setCurrentUser({ ...user });
                      setShowDeleteModal(!showDeleteModal);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {showUserBlog && <BlogsTable user={currentUser} />}

      {showEditModal && (
        <Modal
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          updateUser={updateUser}
          setShowModal={setShowEditModal}
        />
      )}

      {showDeleteModal && (
        <ModalDelete
          userId={currentUser.userId}
          deleteUser={deleteUser}
          setShowDeleteModal={setShowDeleteModal}
        />
      )}
    </div>
  );
}

export default UsersTable;
