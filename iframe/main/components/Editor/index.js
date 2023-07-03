import React, { Component } from 'react';
import MonacoEditor from 'react-monaco-editor';
import './index.less';

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '// type your code...',
    }
  }

  editorDidMount(editor, monaco) {
    console.log("editorDidMount", editor, editor.getValue(), editor.getModel());
    this.editor = editor;
    editor.focus();
  }

  onChange(newValue, e) {
    console.log('onChange', newValue, e);
  }

  render() {
    const code = this.state.code;
    const options = {
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: false,
      cursorStyle: "line",
      automaticLayout: false,
      minimap: {
        enabled: false
      }
    };
    return (
      <MonacoEditor
        height="300"
        language="javascript"
        theme="vs-dark"
        value={code}
        options={options}
        onChange={this.onChange}
        editorDidMount={this.editorDidMount}
      />
    );
  }
}