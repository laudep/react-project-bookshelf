import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import BookShelf from "./BookShelf";
import MultiShelfChanger from "./MultiShelfChanger";
import { SHELF_TYPE } from "../Constants";

/**
 * Grid of books on different virtual 'shelves',
 * with buttons to add or move books.
 *
 * @class BookList
 * @extends {Component}
 */
class BookList extends Component {
  static propTypes = {
    /** List of books. */
    books: PropTypes.array.isRequired,
    /** Function to handle book shelf changes. */
    updateShelf: PropTypes.func.isRequired,
    /** Function to handle shelf changes of multiple books. */
    batchUpdate: PropTypes.func.isRequired,
    /** Handler for when a book is (de)selected. */
    toggleSelect: PropTypes.func.isRequired
  };

  render() {
    const { books, updateShelf, batchUpdate, toggleSelect } = this.props;
    const selectedCount = books.filter(
      book => book.isSelected === true && book.shelf !== SHELF_TYPE.none.id
    ).length;

    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>Bookshelf</h1>
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
                  toggleSelect={toggleSelect}
                />
              );
            })}
        </div>

        <div className="open-search">
          <Link to="/search">
            <button />
          </Link>
        </div>

        {selectedCount > 0 && (
          <MultiShelfChanger
            selectedCount={selectedCount}
            batchUpdate={batchUpdate}
          />
        )}
      </div>
    );
  }
}

export default BookList;
