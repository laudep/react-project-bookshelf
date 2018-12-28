import React from "react";
import { Link } from "react-router-dom";
import notFound from "../images/not_found.svg";

const NotFound = () => (
  <div>
    <div className="not-found-title">
      <p>
        Whoops!
        <br />
        There are no books to see here.
      </p>
    </div>

    <Link to="/">
      <img class="not-found-image" src={notFound} alt="Page not found" />
      <center>Return to overview</center>
    </Link>
  </div>
);
export default NotFound;
