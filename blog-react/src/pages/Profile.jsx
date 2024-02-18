import { useNavigate, useParams } from "react-router-dom";

import User from "../assets/user.png";
import { useEffect, useRef, useState } from "react";

import PropTypes from "prop-types";

const Profile = ({ user, setUser }) => {
  const token = localStorage.getItem("jwt");
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [selectedImage, setSelectedImage] = useState(null);
  const imageRef = useRef();

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

  const uploadPicture = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", selectedImage);
    const response = await fetch(`http://localhost:8080/api/v1/users/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (response.ok) {
      const imagebytes = await response.arrayBuffer();
      const base64Flag = "data:image/jpeg;base64,";
      const imageStr = arrayBufferToBase64(imagebytes);
      setUser({ ...user, img: base64Flag + imageStr });
    }
  };

  function arrayBufferToBase64(buffer) {
    var binary = "";
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return window.btoa(binary);
  }

  return (
    <div className="mt-5 shadow-lg p-3 mb-5 bg-body-tertiary rounded">
      <form className="row mx-auto">
        <div className="d-flex align-items-center flex-column flex-sm-row">
          <section className="w-100">
            <div className="mb-3 row">
              <label htmlFor="inputName" className="col-sm-12 col-form-label">
                Name
              </label>
              <div className="col-sm-12">
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
              <div className="col-sm-12">
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
            <div className="col-auto mt-5">
              <button
                type="submit"
                className="btn btn-warning mb-3"
                onClick={handleUpdate}
              >
                Update Info
              </button>
            </div>
          </section>
          <section className="h-100 w-50 d-flex justify-content-evenly align-items-center flex-column ms-5">
            <img
              src={User}
              alt="profile"
              style={{ maxHeight: "100px", maxWidth: "100px" }}
            />
            <input
              type="file"
              name="image"
              ref={imageRef}
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />
            {selectedImage && (
              <button className="btn btn-info" onClick={uploadPicture}>
                Upload Picture
              </button>
            )}
          </section>
        </div>
      </form>
    </div>
  );
};

Profile.propTypes = {
  user: PropTypes.object,
  setUser: PropTypes.func,
};

export default Profile;
