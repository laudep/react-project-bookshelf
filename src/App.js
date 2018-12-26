import React from "react";
import * as BooksAPI from "./BooksAPI";
import "./css/App.css";
import { Route, withRouter } from "react-router-dom";
import BookList from "./components/BookList";
import BookSearch from "./components/BookSearch";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { css } from "glamor";

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

      this.displayUpdateToast(this.props.history.location.pathname, shelfName);

      // navigate to home page after adding a book
      shelfName !== "none" &&
        this.props.history.location.pathname !== "/" &&
        this.props.history.push("/");
    });
  };

  displayUpdateToast = (currentPath, shelfName) => {
    let toastText = null;
    if (currentPath !== "/" && shelfName !== "none") {
      toastText = "Book added.";
    } else if (currentPath === "/" && shelfName === "none") {
      toastText = "Book has been removed";
    } else if (currentPath === "/") {
      toastText = "Book has been updated.";
    }

    !!toastText &&
      toast(toastText, {
        position: toast.POSITION.BOTTOM_CENTER,
        className: css({
          background: "#757de8",
          color: "white",
          fontWeight: "bold"
        })
      });
  };

  render() {
    const { books } = this.state;
    return (
      <div className="app">
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

export default withRouter(BooksApp);
