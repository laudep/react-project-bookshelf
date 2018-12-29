import React, { Component } from "react";
import PropTypes from "prop-types";
import coverPlaceHolder from "../images/image_not_available.png";
import ShelfChanger from "./ShelfChanger";

/**
 * A single book cover image, title and authors,
 * and a button to change the book shelf.
 *
 * @class Book
 * @extends {Component}
 */
class Book extends Component {
  static propTypes = {
    /** Current book data. */
    book: PropTypes.object.isRequired,
    /** All books currently on a shelf. */
    books: PropTypes.array.isRequired,
    /** Handler for when a book's shelf is changed. */
    updateShelf: PropTypes.func.isRequired,
    /** Handler for when a book is (de)selected. */
    toggleSelect: PropTypes.func.isRequired
  };

  // state = { isSelected: false };

  /**
   * Handler for clicks on a book cover image
   *
   *@param {event} event onClick event
   * @memberof Book
   */
  handleClick = event => {
    this.props.toggleSelect(this.props.book.id);
  };

  render() {
    const { book, books, updateShelf } = this.props;
    const thumbnail =
      book.imageLinks && book.imageLinks.thumbnail
        ? book.imageLinks.thumbnail
        : coverPlaceHolder;
    const borderStyle = book.isSelected ? "10px solid #999" : "";

    return (
      <div className="book">
        <div className="book-top">
          <div className="book-cover" style={{ width: 128, height: 193 }}>
            <img
              alt=""
              src={thumbnail}
              style={{
                width: 128,
                height: 193,
                border: borderStyle
              }}
              onClick={this.handleClick}
            />
          </div>

          <ShelfChanger book={book} books={books} updateShelf={updateShelf} />
        </div>

        <div className="book-title">{book.title}</div>
        {book.authors &&
          book.authors.map((author, index) => (
            <div key={index} className="book-authors">
              {author}
            </div>
          ))}
      </div>
    );
  }
}

export default Book;
