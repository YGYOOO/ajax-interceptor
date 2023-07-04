import React, { Component } from 'react';
import MonacoEditor from 'react-monaco-editor';
import './index.less';
import { setChromeStorage } from '../../utils';

export default class Editor extends Component {
  constructor(props) {
    super();
    this.state = {
      code: '// type your code... \n',
    }
  }

  editorDidMount(editor) {
    this.editor = editor;
    editor.focus();
  }

  onChange(newValue, e) {
    console.log('onChange', newValue, e);
    window.setting.ajaxInterceptor_rules[this.props.index].overrideFunc = newValue;
    setChromeStorage('ajaxInterceptor_rules', window.setting.ajaxInterceptor_rules);
  }

  render() {
    const code = this.props.defaultFunc;
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
        theme="vs-light"
        value={code}
        options={options}
        onChange={(...args) => this.onChange(...args)}
        editorDidMount={this.editorDidMount}
      />
    );
  }
}