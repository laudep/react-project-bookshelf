import React, { Component } from "react";
import PropTypes from "prop-types";
import Book from "./Book";

/**
 * Component for virtual book shelf: grid of associated books.
 *
 * @class BookShelf
 * @extends {Component}
 */
class BookShelf extends Component {
  static propTypes = {
    /** Shelf data: id and text to display. */
    shelf: PropTypes.object.isRequired,
    /** All books currently on a shelf. */
    books: PropTypes.array.isRequired,
    /** Handler for when a book is changed. */
    updateShelf: PropTypes.func.isRequired
  };

  render() {
    const { shelf, books, updateShelf } = this.props;

    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{shelf.text}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {books
              .filter(book => book.shelf === shelf.id)
              .map((book, index) => (
                <li key={book.id}>
                  <Book book={book} updateShelf={updateShelf} books={books} />
                </li>
              ))}
          </ol>
        </div>
      </div>
    );
  }
}

export default BookShelf;
