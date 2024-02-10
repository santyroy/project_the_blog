import { Link } from "react-router-dom";
import UserIcon from "../assets/user.png";

import PropTypes from "prop-types";

function BlogCard({ blog, username }) {
  const { id, title, content, modifiedDate } = blog;

  const date = new Date(modifiedDate).toDateString();
  const time = new Date(modifiedDate).toLocaleTimeString();

  return (
    <div className="card h-100 mb-3 shadow p-2 mb-5 bg-body-tertiary rounded">
      <div className="card-header bg-body-secondary d-flex justify-content-between">
        <span className="badge text-bg-primary"># {id}</span>
        <span className="fw-semibold d-flex align-items-center">
          <img
            src={UserIcon}
            alt="user avatar"
            style={{ width: "16px", height: "16px" }}
            className="me-1"
          />
          {username}
        </span>
      </div>
      <div className="card-body">
        <h5 className="card-title fw-bold">{title}</h5>
        <p className="card-text">
          {content.substring(0, 50)}...{" "}
          <Link to={`${id}`}>
            <small>more</small>
          </Link>
        </p>
      </div>
      <div className="card-footer text-body-secondary bg-body-light d-flex justify-content-between">
        <small>{date}</small>
        <small>{time}</small>
      </div>
    </div>
  );
}

BlogCard.propTypes = {
  blog: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
};

export default BlogCard;
