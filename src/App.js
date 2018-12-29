import React from "react";
import { Route, withRouter, Switch } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import * as BooksAPI from "./BooksAPI";
import "./css/App.css";
import { css } from "glamor";
import BookList from "./components/BookList";
import BookSearch from "./components/BookSearch";
import NotFound from "./components/NotFound";
import { SHELF_TYPE } from "./Constants";

class BooksApp extends React.Component {
  state = {
    books: []
  };

  componentDidMount() {
    // fetch books
    BooksAPI.getAll().then(books => {
      for (let book of books) book.isSelected = false;
      this.setState({ books });
    });
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
    const booksUpdated = this.state.books.map(b => {
      b.isSelected = false;
      return b;
    });

    this.setState({ books: booksUpdated });
  };

  /**
   * Update multiple books
   *
   * @param {Array.<Object>} [updatedBooks] list of books to update
   * @param {string} shelfId id of the new shelf
   * @memberof BooksApp
   */
  updateMultiple = (updatedBooks, shelfId) => {
    if (!updatedBooks || updatedBooks.length < 1 || !shelfId) return;

    let changedBooks = updatedBooks
      .filter(book => book.shelf !== shelfId)
      .map(b => {
        return b;
      });

    if (changedBooks.length === 1)
      return this.updateShelf(changedBooks[0], shelfId);

    if (changedBooks.length < 1) return;

    var apiUpdates = changedBooks.map(function(changedBook) {
      return new Promise(function(resolve) {
        BooksAPI.update(changedBook, shelfId).then(response => {
          resolve();
        });
      });
    });

    // Update state after all API calls are complete
    Promise.all(apiUpdates).then(this.updateBooksState(changedBooks, shelfId));
  };

  /**
   * Update books state
   *
   * @param {Array.<Object>} [updatedBooks] list of books to update
   * @param {string} shelfId id of the new shelf
   * @memberof BooksApp
   */
  updateBooksState = (updateBooks, shelfId) => {
    this.setState(prevState => {
      let prevBooks = prevState.books;
      for (const book of updateBooks) {
        let bookIndex = prevBooks.findIndex(oldBook => oldBook.id === book.id);

        let updatedBook = bookIndex > -1 ? prevBooks[bookIndex] : book;
        updatedBook.isSelected = false;
        updatedBook.shelf = shelfId;

        bookIndex > -1
          ? (prevBooks[bookIndex] = updatedBook)
          : (prevBooks = prevBooks.concat(updatedBook));
      }
      return { books: prevBooks };
    });
    this.toastMultibook(updateBooks.length, shelfId);
  };

  /**
   * Toggle a book's selected state
   *
   * @param {string} bookId the id of the book to toggle
   * @memberof BooksApp
   */
  toggleSelect = bookId => {
    const booksUpdated = this.state.books.map(b => {
      if (b.id === bookId) b.isSelected = !!!(b.isSelected || false);
      return b;
    });
    this.setState({ books: booksUpdated });
  };

  /**
   * Update a book's current shelf.
   *
   * @param {Object} updatedBook the book to be updated
   * @param {string} [shelfId] id of the book's new shelf
   * @memberof BooksApp
   */
  updateShelf = (updatedBook, shelfId) => {
    if (updatedBook.shelf === shelfId) return;

    BooksAPI.update(updatedBook, shelfId).then(response => {
      const oldShelf =
        this.state.books
          .filter(book => book.id === updatedBook.id)
          .map(book => book.shelf)[0] || SHELF_TYPE.none.id;

      // update state with the changed book
      this.setState(prevState => ({
        books: prevState.books
          .filter(book => book.id !== updatedBook.id)
          .concat(updatedBook)
          .map(book => {
            // set correct shelf for (new or updated) book
            book.id === updatedBook.id &&
              (book.shelf = shelfId) &&
              (book.isSelected = false);
            return book;
          })
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
        <Switch>
          <Route
            path="/search"
            render={() => (
              <BookSearch
                booksOnShelf={books}
                updateShelf={this.updateShelf}
                batchUpdate={this.batchUpdate}
              />
            )}
          />
          <Route
            exact
            path="/"
            render={() => (
              <BookList
                books={books}
                updateShelf={this.updateShelf}
                batchUpdate={this.batchUpdate}
                toggleSelect={this.toggleSelect}
              />
            )}
          />
          <Route component={NotFound} />
        </Switch>
        <ToastContainer />
      </div>
    );
  }
}

export default withRouter(BooksApp);
