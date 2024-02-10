import "./Modal.css";

import PropTypes from "prop-types";

function Modal({ setShowModal, currentUser, setCurrentUser, updateUser }) {
  return (
    <>
      <div className="overlay"></div>
      <div className="popup">
        <h2>User: #{currentUser?.userId} </h2>
        <hr />
        <div className="mb-3">
          <label htmlFor="userIdInput" className="form-label">
            UserId
          </label>
          <input
            type="text"
            className="form-control"
            id="userIdInput"
            value={currentUser?.userId}
            disabled
          />
        </div>
        <div className="mb-3">
          <label htmlFor="userIdInput" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="userIdInput"
            value={currentUser?.name}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, ["name"]: e.target.value })
            }
          />
        </div>
        <div className="mb-3">
          <label htmlFor="userIdInput" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="userIdInput"
            value={currentUser?.email}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, ["email"]: e.target.value })
            }
          />
        </div>
        <div className="mb-3">
          <label htmlFor="userIdInput" className="form-label">
            Role
          </label>
          <input
            type="text"
            className="form-control"
            id="userIdInput"
            value={currentUser?.role}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, ["role"]: e.target.value })
            }
          />
        </div>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-secondary me-2"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
          <button className="btn btn-success" onClick={(e) => updateUser(e)}>
            Update
          </button>
        </div>
      </div>
    </>
  );
}

Modal.propTypes = {
  setShowModal: PropTypes.func,
  setCurrentUser: PropTypes.func,
  updateUser: PropTypes.func,
  currentUser: PropTypes.object.isRequired,
};

export default Modal;
