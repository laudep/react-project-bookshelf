import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Book from "./Book";
import * as BooksAPI from "../BooksAPI";

class BookSearch extends Component {
  static propTypes = {
    updateShelf: PropTypes.func.isRequired
  };

  state = {
    query: "",
    foundBooks: [],
    noHits: false
  };

  searchBooks = event => {
    const query = event.target.value;
    this.setState({ query });

    //  user input => search for books
    if (query) {
      BooksAPI.search(query.trim(), 20).then(books => {
        books.length > 0
          ? this.setState({ foundBooks: books, noHits: false })
          : this.setState({ foundBooks: [], noHits: true });
      });

      // query is empty => reset state
    } else this.setState({ newBooks: [], noHits: false });
  };

  render() {
    const { query, foundBooks, noHits } = this.state;

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
              onChange={this.searchBooks}
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
        </div>
      </div>
    );
  }
}

export default BookSearch;
