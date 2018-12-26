import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import * as BooksAPI from "../BooksAPI";
import Book from "./Book";
import MultiShelfChanger from "./MultiShelfChanger";

class BookSearch extends Component {
  static propTypes = {
    updateShelf: PropTypes.func.isRequired,
    booksOnShelf: PropTypes.array.isRequired,
    batchUpdate: PropTypes.func.isRequired
  };

  state = {
    query: "",
    foundBooks: [],
    noHits: false
  };

  batchUpdate = shelfId => {
    if (shelfId === "deselect") return this.deselectAll();
    const selectedBooks = this.state.foundBooks.filter(
      book => book.isSelected === true
    );
    this.props.batchUpdate(shelfId, selectedBooks);
  };

  deselectAll = () => {
    let books = this.state.foundBooks;
    for (let book of books) {
      book.isSelected = false;
    }
    this.setState({
      books: books
    });
  };

  handleSearch = event => {
    const query = event.target.value;
    this.searchBooks(query);
  };

  searchBooks = query => {
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
            <input
              type="text"
              placeholder="Search by title or author"
              value={query}
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
