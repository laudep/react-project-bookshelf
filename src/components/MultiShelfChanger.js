import React, { Component } from "react";
import PropTypes from "prop-types";
import { SHELF_TYPE } from "../Constants";

/**
 * Button component with select options to move multiple books.
 *
 * @class MultiShelfChanger
 * @extends {Component}
 */
class MultiShelfChanger extends Component {
  static propTypes = {
    /** Number of currently selected books in the search results. */
    selectedCount: PropTypes.number.isRequired,
    /** Handler function for multiple books. */
    batchUpdate: PropTypes.func.isRequired
  };

  /**
   * Handler for updating multiple books.
   *
   * @param {Event} event change event of multi select options
   * @memberof MultiShelfChanger
   */
  batchUpdate = event => {
    this.props.batchUpdate(event.target.value);
  };

  render() {
    const { selectedCount } = this.props;

    return (
      <div className="change-multiple">
        <select onChange={this.batchUpdate} value="title">
          <option value="deselect">Deselect all ({selectedCount})</option>
          <option disabled value="title">
            Move to...
          </option>
          {Object.keys(SHELF_TYPE).map(type => (
            <option key={type} value={type}>
              {SHELF_TYPE[type].text}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default MultiShelfChanger;
