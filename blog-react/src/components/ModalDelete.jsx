import "./Modal.css";

import PropTypes from "prop-types";

function ModalDelete({ userId, deleteUser, setShowDeleteModal }) {
  return (
    <>
      <div className="overlay"></div>
      <div className="popup">
        <h4 className="text-center mb-4">
          Are you sure you want to delete User #
          <span className="fw-semibold">{userId}</span> ?
        </h4>
        <div className="d-flex justify-content-center">
          <button
            className="btn btn-danger me-3"
            onClick={(e) => deleteUser(e, userId)}
          >
            Yes
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            No
          </button>
        </div>
      </div>
    </>
  );
}

ModalDelete.propTypes = {
  userId: PropTypes.string,
  deleteUser: PropTypes.func,
  setShowDeleteModal: PropTypes.func,
};
export default ModalDelete;
