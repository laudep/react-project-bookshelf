import React from "react";
import * as BooksAPI from "./BooksAPI";
import "./App.css";
import { Route } from "react-router-dom";
import BookList from "./components/BookList";
import BookSearch from "./components/BookSearch";

class BooksApp extends React.Component {
  state = { books: [] };

  componentDidMount() {
    // fetch books
    BooksAPI.getAll().then(books => this.setState({ books }));
  }

  updateShelf = (updatedBook, shelfName) => {
    BooksAPI.update(updatedBook, shelfName).then(response => {
      // set correct shelf for (new or updated) book
      updatedBook.shelf = shelfName;
      // update state with the changed book
      this.setState(prevState => ({
        books: prevState.books
          .filter(book => book.id !== updatedBook.id)
          .concat(updatedBook)
      }));
    });
  };

  render() {
    const { books } = this.state;
    return (
      <div className="app">
        F
        <Route
          path="/search"
          render={() => <BookSearch updateShelf={this.updateShelf} />}
        />
        <Route
          exact
          path="/"
          render={() => (
            <BookList books={books} updateShelf={this.updateShelf} />
          )}
        />
      </div>
    );
  }
}

export default BooksApp;
