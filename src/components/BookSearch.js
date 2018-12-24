import React, { Component } from "react";
import { Link } from "react-router-dom";
import Book from "./Book";
import * as BooksAPI from "../BooksAPI";

class BookSearch extends Component {
  state = {
    query: "",
    foundBooks: []
  };

  searchBooks = event => {
    const query = event.target.value;
    this.setState({ query });

    // if user input => run the search
    if (query) {
      BooksAPI.search(query.trim(), 20).then(books => {
        books.length > 0
          ? this.setState({ foundBooks: books })
          : this.setState({ foundBooks: [] });
      });

      // if query is empty => reset state to default
    } else this.setState({ newBooks: [] });
  };

  render() {
    const { query, foundBooks } = this.state;

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
                  <Book book={book} />
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default BookSearch;
