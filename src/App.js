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

  render() {
    const { books } = this.state;
    return (
      <div className="app">
        <Route path="/search" render={() => <BookSearch />} />
        <Route exact path="/" render={() => <BookList books={books} />} />
      </div>
    );
  }
}

export default BooksApp;
