import React, { Component } from "react";
import PropTypes from "prop-types";
import coverPlaceHolder from "../images/image_not_available.png";

class Book extends Component {
  static propTypes = {
    book: PropTypes.object.isRequired,
    updateShelf: PropTypes.func.isRequired
  };

  updateShelf = event =>
    this.props.updateShelf(this.props.book, event.target.value);

  render() {
    const { book } = this.props;

    const thumbnail =
      book.imageLinks && book.imageLinks.thumbnail
        ? book.imageLinks.thumbnail
        : coverPlaceHolder;

    const shelfType = {
      currentlyReading: {
        text: "Currently Reading"
      },
      wantToRead: {
        text: "Want to Read"
      },
      read: {
        text: "Read"
      },
      none: {
        text: "None"
      }
    };

    return (
      <div className="book">
        <div className="book-top">
          <div className="book-cover" style={{ width: 128, height: 193 }}>
            <img alt="" src={thumbnail} style={{ width: 128, height: 193 }} />
          </div>
          <div className="book-shelf-changer">
            <select defaultValue={book.shelf} onChange={this.updateShelf}>
              <option value="none" disabled>
                Move to...
              </option>
              {Object.keys(shelfType).map(type => (
                <option key={type} value={type}>
                  {shelfType[type].text}
                </option>
              ))}
            </select>
          </div>
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
