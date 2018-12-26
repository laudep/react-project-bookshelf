import React, { Component } from "react";
import PropTypes from "prop-types";
import BookShelf from "./BookShelf";
import { Link } from "react-router-dom";
import { SHELF_TYPE } from "../Constants";

class BookList extends Component {
  static propTypes = {
    books: PropTypes.array.isRequired,
    updateShelf: PropTypes.func.isRequired,
    batchUpdate: PropTypes.func.isRequired
  };

  batchUpdate = event => {
    this.props.batchUpdate(event.target.value);
  };

  handleDeselect = event => {
    event.target.value === "deselect" &&
      this.props.batchUpdate(event.target.value);
  };

  render() {
    const { books, updateShelf } = this.props;
    const selectedCount = books.filter(book => book.isSelected === true).length;
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

        {books.filter(
          book => book.isSelected === true && book.shelf !== SHELF_TYPE.none.id
        ).length > 0 && (
          <div className="change-multiple">
            <select onChange={this.batchUpdate}>
              <option value="deselect">Deselect all ({selectedCount})</option>
              <option disabled selected>
                Move to...
              </option>
              {Object.keys(SHELF_TYPE).map(type => (
                <option key={type} value={type}>
                  {SHELF_TYPE[type].text}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    );
  }
}

export default BookList;
