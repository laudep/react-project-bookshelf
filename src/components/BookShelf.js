import React from "react";
import PropTypes from "prop-types";
import Book from "./Book";

/**
 * Stateless component for virtual book shelf: grid of associated books.
 *
 * @param {Object} props component properties
 * @returns {Object} virtual DOM
 */
const BookShelf = props => (
  <div className="bookshelf">
    <h2 className="bookshelf-title">{props.shelf.text}</h2>
    <div className="bookshelf-books">
      <ol className="books-grid">
        {props.books
          .filter(book => book.shelf === props.shelf.id)
          .map((book, index) => (
            <li key={book.id}>
              <Book
                book={book}
                updateShelf={props.updateShelf}
                books={props.books}
                toggleSelect={props.toggleSelect}
              />
            </li>
          ))}
      </ol>
    </div>
  </div>
);

BookShelf.propTypes = {
  /** Shelf data: id and text to display. */
  shelf: PropTypes.object.isRequired,
  /** All books currently on a shelf. */
  books: PropTypes.array.isRequired,
  /** Handler for when a book's shelf is changed. */
  updateShelf: PropTypes.func.isRequired,
  /** Handler for when a book is (de)selected. */
  toggleSelect: PropTypes.func.isRequired
};

export default BookShelf;
