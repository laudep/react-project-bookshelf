import React, { Component } from "react";
import PropTypes from "prop-types";
import BookShelf from "./BookShelf";
import { Link } from "react-router-dom";
import { SHELF_TYPE } from "../Constants";

class BookList extends Component {
  static propTypes = {
    books: PropTypes.array.isRequired,
    updateShelf: PropTypes.func.isRequired
  };

  state = { shelfChange: false };

  render() {
    const { books, updateShelf } = this.props;

    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          {Object.keys(SHELF_TYPE)
            .filter(key => key !== SHELF_TYPE.none.id)
            .map((shelfId, index) => {
              return (
                <BookShelf
                  key={index}
                  shelf={SHELF_TYPE[shelfId]}
                  books={books}
                  updateShelf={updateShelf}
                />
              );
            })}
        </div>
        <div className="open-search">
          <Link to="/search">
            <button />
          </Link>
        </div>
      </div>
    );
  }
}

export default BookList;
