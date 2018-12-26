import React, { Component } from "react";
import PropTypes from "prop-types";
import coverPlaceHolder from "../images/image_not_available.png";
import ShelfChanger from "./ShelfChanger";

class Book extends Component {
  static propTypes = {
    book: PropTypes.object.isRequired,
    books: PropTypes.array.isRequired,
    updateShelf: PropTypes.func.isRequired
  };

  state = { isSelected: false };

  handleClick = event => {
    // this.setState(prevState => ({
    //   isSelected: !prevState.isSelected
    // }));
    this.props.book.isSelected = !!!this.props.book.isSelected;
    this.props.updateShelf(this.props.book);
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
