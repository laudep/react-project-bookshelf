import React from "react";
import { Route, withRouter } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import * as BooksAPI from "./BooksAPI";
import "./css/App.css";
import { css } from "glamor";
import BookList from "./components/BookList";
import BookSearch from "./components/BookSearch";
import { SHELF_TYPE } from "./Constants";

class BooksApp extends React.Component {
  state = { books: [] };

  componentDidMount() {
    // fetch books
    BooksAPI.getAll().then(books => this.setState({ books }));
  }

  updateShelf = (updatedBook, shelfId) => {
    BooksAPI.update(updatedBook, shelfId).then(response => {
      const oldShelf = updatedBook.shelf || SHELF_TYPE.none.id;
      // set correct shelf for (new or updated) book
      updatedBook.shelf = shelfId;
      // update state with the changed book
      this.setState(prevState => ({
        books: prevState.books
          .filter(book => book.id !== updatedBook.id)
          .concat(updatedBook)
      }));

      this.displayUpdateToast(oldShelf, shelfId);
    });
  };

  displayUpdateToast = (oldShelf, newShelf) => {
    let toastText = null;
    if (oldShelf === SHELF_TYPE.none.id) {
      toastText = "Book added.";
    } else if (newShelf === SHELF_TYPE.none.id) {
      toastText = "Book has been removed.";
    } else {
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
        <ToastContainer />
      </div>
    );
  }
}

export default withRouter(BooksApp);
