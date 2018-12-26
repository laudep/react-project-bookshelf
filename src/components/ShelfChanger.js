import React, { Component } from "react";
import PropTypes from "prop-types";
import { SHELF_TYPE } from "../Constants";

class ShelfChanger extends Component {
  static propTypes = {
    book: PropTypes.object.isRequired,
    books: PropTypes.array.isRequired,
    updateShelf: PropTypes.func.isRequired
  };

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
