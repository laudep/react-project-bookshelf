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
  state = {
    books: []
  };

  componentDidMount() {
    // fetch books
    BooksAPI.getAll().then(books =>
      this.setState({
        books
      })
    );
  }

  /**
   * Handle multi select changes changes
   *
   * @param {string} shelfId id of selected action
   * @param {Array.<Object>} booksToUpdate list of books to update
   * @memberof BooksApp
   */
  batchUpdate = (shelfId, booksToUpdate) => {
    if (shelfId === "deselect") return this.deselectAll();
    if (!shelfId) return;

    this.updateMultiple(
      booksToUpdate ||
        this.state.books.filter(book => book.isSelected === true),
      shelfId
    );
  };

  /**
   * Deselect all currently selected books in the BookList component
   *
   * @memberof BooksApp
   */
  deselectAll = () => {
    let books = this.state.books;
    for (let book of books) {
      book.isSelected = false;
    }
    this.setState(prevState => ({
      books: books
    }));
  };

  /**
   * Update multiple books
   *
   * @param {Array.<Object>} updatedBooks list of books to update
   * @param {string} shelfId id of the new shelf
   * @memberof BooksApp
   */
  updateMultiple = (updatedBooks, shelfId) => {
    if (!updatedBooks || updatedBooks.length < 1 || !shelfId) return;
    if (updatedBooks.length === 1)
      return this.updateShelf(updatedBooks[0], shelfId);

    let updateCount = 0,
      books = this.state.books,
      changedBooks = updatedBooks.filter(book => book.shelf !== shelfId);

    if (changedBooks.length < 1) return;

    for (let changedBook of changedBooks) {
      changedBook.shelf = shelfId;
      changedBook.isSelected = false;
      // eslint-disable-next-line no-loop-func
      BooksAPI.update(changedBook, shelfId).then(response => {
        updateCount++;
        const bookIndex = books.findIndex(
          oldBook => oldBook.id === changedBook.id
        );
        if (bookIndex > -1) books[bookIndex] = changedBook;
        else {
          books = books.concat(changedBook);
        }
        updateCount === changedBooks.length &&
          this.setState({ books: books }, () =>
            this.toastMultibook(changedBooks.length, shelfId)
          );
      });
    }
  };

  /**
   * Update a book's current shelf.
   *
   * @param {Object} updatedBook the updated book or book to be updated
   * @param {string} [shelfId] id of the book's new shelf
   * @memberof BooksApp
   */
  updateShelf = (updatedBook, shelfId) => {
    if (typeof shelfId === "undefined") {
      const bookIndex = this.state.books.findIndex(
        book => book.id === updatedBook.id
      );
      let updatedBooks = this.state.books;
      updatedBooks[bookIndex] = updatedBook;
      this.setState({
        books: updatedBooks
      });

      return;
    }
    if (updatedBook.shelf === shelfId) return;
    BooksAPI.update(updatedBook, shelfId).then(response => {
      let oldShelf = SHELF_TYPE.none.id;
      this.state.books
        .filter(book => book.id === updatedBook.id)
        .map(book => (oldShelf = book.shelf));
      // set correct shelf for (new or updated) book
      updatedBook.shelf = shelfId;

      updatedBook.isSelected = false;
      // update state with the changed book
      this.setState(prevState => ({
        books: prevState.books
          .filter(book => book.id !== updatedBook.id)
          .concat(updatedBook)
      }));
      this.toastSingleBook(oldShelf, shelfId);
    });
  };

  /**
   * Display a message toast for an action on a single book.
   *
   * @param {string} oldShelf the original/source shelf id
   * @param {string} newShelf the destination shelf id
   * @memberof BooksApp
   */
  toastSingleBook = (oldShelf, newShelf) => {
    let toastText = null;
    if (oldShelf === SHELF_TYPE.none.id) {
      toastText = "Book added.";
    } else if (newShelf === SHELF_TYPE.none.id) {
      toastText = "Book has been removed.";
    } else {
      toastText = "Book has been updated.";
    }

    this.displayUpdateToast(toastText);
  };

  /**
   * Display a message toast for an action on multple books.
   *
   * @param {number} count number of books involved
   * @param {string} newShelf the destination shelf id
   * @memberof BooksApp
   */
  toastMultibook = (count, newShelf) => {
    if (!count > 0) return;
    let toastText = null;
    toastText =
      newShelf === SHELF_TYPE.none.id
        ? `${count} books were removed.`
        : `${count} books were updated.`;

    // navigate to home page after multi update
    this.props.history.location.pathname !== "/" &&
      this.props.history.push("/");

    this.displayUpdateToast(toastText);
  };

  /**
   * Display a message toast
   *
   * @param {string} message the text to be displayed
   * @memberof BooksApp
   */
  displayUpdateToast = message => {
    !!message &&
      toast(message, {
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
          render={() => (
            <BookSearch
              booksOnShelf={books}
              updateShelf={this.updateShelf}
              batchUpdate={this.batchUpdate}
            />
          )}
        />{" "}
        <Route
          exact
          path="/"
          render={() => (
            <BookList
              books={books}
              updateShelf={this.updateShelf}
              batchUpdate={this.batchUpdate}
            />
          )}
        />{" "}
        <ToastContainer />
      </div>
    );
  }
}

export default withRouter(BooksApp);
