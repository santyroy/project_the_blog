import { useState } from "react";

function BlogSearch({ userId, setBlogs, token }) {
  const [searchTitle, setSearchTitle] = useState("");

  async function handleSearch(event) {
    event.preventDefault();
    const response = await fetch(
      `http://localhost:8080/api/v1/blogs/user/${userId}/search?title=${searchTitle}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    setBlogs(data.data);
  }

  return (
    <form className="d-flex" onSubmit={handleSearch}>
      <input
        type="text"
        className="form-control"
        placeholder="Search by Title"
        value={searchTitle}
        onChange={(e) => setSearchTitle(e.target.value)}
      />
      <button
        className={`btn btn-primary ms-2 ${searchTitle === "" && "disabled"}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
        >
          <path
            d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"
            fill="white"
          />
        </svg>
      </button>
    </form>
  );
}

export default BlogSearch;
