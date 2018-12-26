import React, { Component } from "react";
import PropTypes from "prop-types";
import BookShelf from "./BookShelf";
import { Link } from "react-router-dom";

class BookList extends Component {
  static propTypes = {
    books: PropTypes.array.isRequired,
    updateShelf: PropTypes.func.isRequired
  };

  state = { shelfChange: false };

  render() {
    const { books, updateShelf } = this.props;
    const shelves = [
      { type: "currentlyReading", title: "Currently Reading" },
      { type: "wantToRead", title: "Want to Read" },
      { type: "read", title: "Read" }
    ];

    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          {shelves.map((shelf, index) => {
            const shelfBooks = books.filter(book => book.shelf === shelf.type);
            return (
              <BookShelf
                key={shelf.type}
                title={shelf.title}
                books={shelfBooks}
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
