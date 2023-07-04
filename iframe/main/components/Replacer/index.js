import React, { Component } from 'react';
import { Switch, Radio } from 'antd';
import ReactJson from 'react-json-view';

import './index.less';
import SpecializedEditor from "../SpecializedEditor";

export default class Index extends Component {
  constructor(props) {
    super();
    this.state = {
      showJSONEditor: false,
      txt: props.defaultValue,
      src: null,
      editorValue: 0, // 0: simpleRequest, 1: specializedResponse
    }

    try {
      let src = JSON.parse(props.defaultValue);
      if (src && typeof src === 'object') {
        this.state.src = src;
      }
    } catch (e) {

    }
  }


  componentDidUpdate(prevProps, { showJSONEditor }) {
    if (showJSONEditor !== this.state.showJSONEditor) {
      this.props.updateAddBtnTop();
    }
  }

  handleOverrideTxtChange = (txt) => {
    let src;
    try {
      src = JSON.parse(txt);
      if (!(src && typeof src === 'object')) {
        src = null;
      }
    } catch (e) {

    }
    this.setState({ txt, src });

    window.setting.ajaxInterceptor_rules[this.props.index].overrideTxt = txt;
    this.props.set('ajaxInterceptor_rules', window.setting.ajaxInterceptor_rules);
  }

  handleJSONEditorChange = ({ updated_src: src }) => {
    let txt = JSON.stringify(src);
    this.setState({ txt, src });

    window.setting.ajaxInterceptor_rules[this.props.index].overrideTxt = txt;
    this.props.set('ajaxInterceptor_rules', window.setting.ajaxInterceptor_rules);
  }

  handleJSONEditorSwitch = showJSONEditor => {
    this.setState({ showJSONEditor });
  }

  handleEditorRatioChange = e => {
    this.setState({
        editorValue: e.target.value
      }
    );
  };


  render() {
    return (
      <>
        <Radio.Group value={this.state.editorValue} onChange={this.handleEditorRatioChange}>
          <Radio.Button value={0}>Request</Radio.Button>
          <Radio.Button value={1}>Response</Radio.Button>
        </Radio.Group>
        {
          this.state.editorValue === 0
            ? <SpecializedEditor
                updateAddBtnTop={this.props.updateAddBtnTop}
                index={this.props.index}
                defaultFunc={this.props.defaultFunc}
              />
            : (
              <div>
                <div className="replace-with">
                  Replace With:
                </div>
                <textarea
                  className="overrideTxt"
                  style={{ resize: 'none' }}
                  value={this.state.txt}
                  onChange={e => this.handleOverrideTxtChange(e.target.value)}
                />
                <Switch style={{ marginTop: '6px' }} onChange={this.handleJSONEditorSwitch} checkedChildren="JSON Editor"
                        unCheckedChildren="JSON Editor" size="small"/>
                {this.state.showJSONEditor && (
                  this.state.src ?
                    <div className="JSONEditor">
                      <ReactJson
                        name={false}
                        collapsed
                        collapseStringsAfterLength={12}
                        src={this.state.src}
                        onEdit={this.handleJSONEditorChange}
                        onAdd={this.handleJSONEditorChange}
                        onDelete={this.handleJSONEditorChange}
                        displayDataTypes={false}
                      />
                    </div> : <div className="JSONEditor Invalid">Invalid JSON</div>
                )}
              </div>
            )
        }
      </>
    );
  }
}