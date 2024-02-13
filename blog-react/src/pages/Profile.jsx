import { useNavigate, useParams } from "react-router-dom";

import User from "../assets/user.png";
import { useEffect, useState } from "react";

import PropTypes from "prop-types";

const Profile = ({ user, setUser }) => {
  const token = localStorage.getItem("jwt");
  const [userData, setUserData] = useState({ name: "", email: "" });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserDetails() {
      if (token != null) {
        const response = await fetch(
          `http://localhost:8080/api/v1/users/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        if (data.status === "200") {
          setUserData({
            ...userData,
            name: data.data.name,
            email: data.data.email,
          });
        }
      }
    }

    getUserDetails();
  }, [id, token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (token != null) {
      const response = await fetch(`http://localhost:8080/api/v1/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (data.status === "200") {
        setUser({ ...user, email: data.data.email });
        navigate("/blogs");
      }
    }
  };

  return (
    <div className="mt-5 shadow-lg p-3 mb-5 bg-body-tertiary rounded">
      <form className="row mx-auto">
        <div className="mb-3 row">
          <img src={User} alt="profile picture" style={{ maxWidth: "5rem" }} />
        </div>
        <div className="mb-3 row">
          <label htmlFor="inputName" className="col-sm-12 col-form-label">
            Name
          </label>
          <div className="col-sm-12 col-md-6">
            <input
              type="text"
              className="form-control"
              id="inputName"
              name="name"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="staticEmail" className="col-sm-12 col-form-label">
            Email
          </label>
          <div className="col-sm-12 col-md-6">
            <input
              type="email"
              className="form-control"
              id="staticEmail"
              placeholder="example@email.com"
              name="email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
            />
          </div>
        </div>
        <div className="col-auto">
          <button
            type="submit"
            className="btn btn-warning mb-3"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
        <div></div>
      </form>
    </div>
  );
};

Profile.propTypes = {
  user: PropTypes.object,
  setUser: PropTypes.func,
};

export default Profile;
