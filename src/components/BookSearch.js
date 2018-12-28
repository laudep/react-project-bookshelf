import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { DebounceInput } from "react-debounce-input";
import * as BooksAPI from "../BooksAPI";
import Book from "./Book";
import MultiShelfChanger from "./MultiShelfChanger";

/**
 * Search bar and list of book results
 *
 * @class BookSearch
 * @extends {Component}
 */
class BookSearch extends Component {
  static propTypes = {
    /** Function to handle book shelf changes. */
    updateShelf: PropTypes.func.isRequired,
    /** All books currently on a shelf in the main book list. */
    booksOnShelf: PropTypes.array.isRequired,
    /** Function to handle shelf changes of multiple books. */
    batchUpdate: PropTypes.func.isRequired
  };

  state = {
    query: "",
    foundBooks: [],
    noHits: false
  };

  /**
   * Handle multi select changes in the BookSearch component
   *
   * @param {string} shelfId id of selected action
   * @see MultiShelfChanger
   * @memberof BookSearch
   */
  batchUpdate = shelfId => {
    // handle 'Deselect all'
    if (shelfId === "deselect") return this.deselectAll();
    // Update shelf of selected books
    const selectedBooks = this.state.foundBooks.filter(
      book => book.isSelected === true
    );
    this.props.batchUpdate(shelfId, selectedBooks);
  };

  /**
   * Deselect all currently selected books in the BookSearch component
   *
   * @memberof BookSearch
   */
  deselectAll = () => {
    let books = this.state.foundBooks;
    for (let book of books) {
      book.isSelected = false;
    }
    this.setState({
      books: books
    });
  };

  /**
   * Handle input in the book search bar
   *
   * @param {Event} event search bar input change event
   * @memberof BookSearch
   */
  handleSearch = event => {
    const query = event.target.value;
    this.setState({ query });
    //  user input => search for books
    if (query) {
      BooksAPI.search(query.trim(), 20).then(foundBooks => {
        if (foundBooks.length > 0) {
          for (let foundBook of foundBooks) {
            // make sure books in result list show correct shelf
            this.props.booksOnShelf
              .filter(shelfBook => shelfBook.id === foundBook.id)
              .map(shelfBook => (foundBook.shelf = shelfBook.shelf));
          }
        }
        // update state
        foundBooks.length > 0
          ? this.setState({ foundBooks: foundBooks, noHits: false })
          : this.setState({ foundBooks: [], noHits: true });
      });

      // query is empty => reset state
    } else this.setState({ foundBooks: [], noHits: false });
  };

  render() {
    const { query, foundBooks, noHits } = this.state;
    const { booksOnShelf } = this.props;
    const selectedCount = foundBooks.filter(book => book.isSelected === true)
      .length;

    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link className="close-search" to="/">
            Close
          </Link>
          <div className="search-books-input-wrapper">
            {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/laudep/react-project-bookshelf/blob/master/SEARCH_TERMS.md
                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}

            <DebounceInput
              type="text"
              value={query}
              minLength={3}
              debounceTimeout={500}
              onChange={this.handleSearch}
            />
          </div>
        </div>
        <div className="search-books-results">
          {foundBooks.length > 0 && (
            <div>
              <h3>Found {foundBooks.length} books </h3>
              <ol className="books-grid">
                {foundBooks.map(book => (
                  <Book
                    key={book.id}
                    book={book}
                    books={booksOnShelf}
                    updateShelf={this.props.updateShelf}
                  />
                ))}
              </ol>
            </div>
          )}
          {//Display message when no books were found for query
          noHits && (
            <h3>
              No books were found for your query.
              <span style={{ display: "block" }}>Please try again.</span>
            </h3>
          )}
          {selectedCount > 0 && (
            <MultiShelfChanger
              selectedCount={selectedCount}
              batchUpdate={this.batchUpdate}
            />
          )}
        </div>
      </div>
    );
  }
}

export default BookSearch;
