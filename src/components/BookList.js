import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import BookShelf from "./BookShelf";
import MultiShelfChanger from "./MultiShelfChanger";
import { SHELF_TYPE } from "../Constants";

class BookList extends Component {
  static propTypes = {
    books: PropTypes.array.isRequired,
    updateShelf: PropTypes.func.isRequired,
    batchUpdate: PropTypes.func.isRequired
  };

  render() {
    const { books, updateShelf, batchUpdate } = this.props;
    const selectedCount = books.filter(
      book => book.isSelected === true && book.shelf !== SHELF_TYPE.none.id
    ).length;
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

        {selectedCount > 0 && (
          <MultiShelfChanger
            selectedCount={selectedCount}
            batchUpdate={batchUpdate}
          />
        )
        // <div className="change-multiple">
        //   <select onChange={this.batchUpdate}>
        //     <option value="deselect">Deselect all ({selectedCount})</option>
        //     <option disabled selected>
        //       Move to...
        //     </option>
        //     {Object.keys(SHELF_TYPE).map(type => (
        //       <option key={type} value={type}>
        //         {SHELF_TYPE[type].text}
        //       </option>
        //     ))}
        //   </select>
        // </div>
        }
      </div>
    );
  }
}

export default BookList;
