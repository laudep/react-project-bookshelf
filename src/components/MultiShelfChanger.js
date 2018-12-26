import React, { Component } from "react";
import PropTypes from "prop-types";
import { SHELF_TYPE } from "../Constants";

class MultiShelfChanger extends Component {
  static propTypes = {
    selectedCount: PropTypes.number.isRequired,
    batchUpdate: PropTypes.func.isRequired
  };

  batchUpdate = event => {
    this.props.batchUpdate(event.target.value);
  };

  render() {
    const { selectedCount } = this.props;

    return (
      <div className="change-multiple">
        <select onChange={this.batchUpdate}>
          <option value="deselect">Deselect all ({selectedCount})</option>
          <option disabled selected>
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
