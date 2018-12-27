import React, { Component } from "react";
import PropTypes from "prop-types";
import { SHELF_TYPE } from "../Constants";

/**
 * Button component for a single book with select options to move it.
 *
 * @class ShelfChanger
 * @extends {Component}
 */
class ShelfChanger extends Component {
  static propTypes = {
    /** Current book data. */
    book: PropTypes.object.isRequired,
    /** All books currently on a shelf. */
    books: PropTypes.array.isRequired,
    /** Handler for when a book is changed. */
    updateShelf: PropTypes.func.isRequired
  };

  /**
   * Handler for updating a book.
   *
   * @param {Event} event change event of the ShelfChanger select options
   * @memberof ShelfChanger
   */
  updateShelf = event => {
    this.props.book.shelf !== event.target.value &&
      this.props.updateShelf(this.props.book, event.target.value);
  };

  render() {
    const { book, books } = this.props;

    // make sure book displays correct shelf
    let currentShelf = SHELF_TYPE.none.id;
    for (let shelfBook of books) {
      if (shelfBook.id === book.id && !!shelfBook.shelf) {
        currentShelf = shelfBook.shelf;
        break;
      }
    }

    return (
      <div className="book-shelf-changer">
        <select onChange={this.updateShelf} defaultValue={currentShelf}>
          <option disabled>Move to...</option>
          {Object.keys(SHELF_TYPE).map(type => (
            <option key={type} value={SHELF_TYPE[type].id}>
              {SHELF_TYPE[type].text}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default ShelfChanger;
