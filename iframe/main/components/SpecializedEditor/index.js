import React, { Component } from 'react';
import MonacoEditor from '../Editor';

export default class SpecializedEditor extends Component {
  render() {
    return (
      <>
        <div className="replace-with">
          Replace With:
        </div>
        <MonacoEditor
          updateAddBtnTop={this.props.updateAddBtnTop}
          index={this.props.index}
          defaultFunc={this.props.defaultFunc}
        />
      </>
    );
  }
}