import { Link } from "react-router-dom";
import Hero from "../assets/hero1.png";
import "./Home.css";

function Home() {
  return (
    <div className="container d-flex justify-content-center box">
      <div className="d-flex flex-column justify-content-center me-5">
        <h1 className="fs-1 fw-bold mb-2">Welcome to THE BLOG.</h1>
        <h3 className="fs-3">Let your mind speak!</h3>
        <div className="mb-5">
          <Link to={"signup"}>
            <button className="btn btn-primary mt-5 fw-semibold px-3 py-2">
              SIGN UP FOR FREE
            </button>
          </Link>
        </div>
      </div>
      <div>
        <img src={Hero} alt="hero image" className="hero" />
      </div>
    </div>
  );
}

export default Home;
