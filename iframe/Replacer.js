import React, {Component} from 'react';
import {Switch} from 'antd';
import ReactJson from 'react-json-view';

import './Replacer.less';

export default class Replacer extends Component {
  constructor(props) {
    super();
    this.state = {
      showJSONEditor: false,
      txt: props.defaultValue,
      src: null,
    }

    try {
      let src = JSON.parse(props.defaultValue);
      if (src && typeof src === 'object') {
        this.state.src = src;
      }
    } catch (e) {
      
    }
  }


  componentDidUpdate(prevProps, {showJSONEditor}) {
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
    this.setState({txt, src});

    window.setting.ajaxInterceptor_rules[this.props.index].overrideTxt = txt;
    this.props.set('ajaxInterceptor_rules', window.setting.ajaxInterceptor_rules);
  }

  handleJSONEditorChange = ({updated_src: src}) => {
    let txt = JSON.stringify(src);
    this.setState({txt, src});

    window.setting.ajaxInterceptor_rules[this.props.index].overrideTxt = txt;
    this.props.set('ajaxInterceptor_rules', window.setting.ajaxInterceptor_rules);
  }

  handleEditorSwitch = showJSONEditor => {
    this.setState({showJSONEditor});
  }


  render() {

    return (
      <>
        <div className="replace-with">
          Replace With:
        </div>
        <textarea
          className="overrideTxt"
          // placeholder="replace with"
          style={{resize: 'none'}}
          value={this.state.txt}
          onChange={e => this.handleOverrideTxtChange(e.target.value)}
        />
        <Switch style={{marginTop: '6px'}} onChange={this.handleEditorSwitch} checkedChildren="JSON Editor" unCheckedChildren="JSON Editor" size="small" />
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
      </>
    );
  }
}