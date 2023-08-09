import React, { Component } from 'react'
import { Switch, Radio } from 'antd'
import MonacoEditor from '../Editor'
import {
  REQUEST_PAYLOAD_EXAMPLES,
  HEADERS_EXAMPLES,
  RESPONSE_EXAMPLES,
  RESPONSE_SIMPLE_EXAMPLES
} from '../Editor/examples'
import { setChromeStorage } from '../../utils'

import './index.less'

export default class Index extends Component {
  constructor(props) {
    super()
    this.state = {
      showJSONEditor: false,
      editorValue: window.setting.ajaxInterceptor_rules[props.index].editorValue || 3, // 1: payload, 2: headers, 3: response
      isExpert: window.setting.ajaxInterceptor_rules[props.index].isExpert || false
    }
  }

  componentDidUpdate(prevProps, { showJSONEditor }) {
    if (showJSONEditor !== this.state.showJSONEditor) {
      this.props.updateAddBtnTop_interval()
    }
  }

  handleOverrideTxtChange = (txt) => {
    window.setting.ajaxInterceptor_rules[this.props.index].overrideTxt = txt
    this.props.set('ajaxInterceptor_rules', window.setting.ajaxInterceptor_rules)
  }

  handleExpertSwitch = () => {
    const curIsExpert = this.state.isExpert
    this.setState({
        isExpert: !curIsExpert,
        txt: window.setting.ajaxInterceptor_rules[this.props.index].overrideTxt
      }
    )
    window.setting.ajaxInterceptor_rules[this.props.index].isExpert = !curIsExpert
    setChromeStorage('ajaxInterceptor_rules', window.setting.ajaxInterceptor_rules)
    this.props.updateAddBtnTop_interval()
  }

  handleEditorRatioChange = e => {
    this.setState({
        editorValue: e.target.value
      }
    )
    window.setting.ajaxInterceptor_rules[this.props.index].editorValue = e.target.value
    setChromeStorage('ajaxInterceptor_rules', window.setting.ajaxInterceptor_rules)
  }

  onPayloadEditorChange = (newValue) => {
    window.setting.ajaxInterceptor_rules[this.props.index].overridePayloadFunc = newValue
    setChromeStorage('ajaxInterceptor_rules', window.setting.ajaxInterceptor_rules)
  }

  onHeadersEditorChange = (newValue) => {
    window.setting.ajaxInterceptor_rules[this.props.index].overrideHeadersFunc = newValue
    setChromeStorage('ajaxInterceptor_rules', window.setting.ajaxInterceptor_rules)
  }

  onResponseEditorChange = (newValue) => {
    window.setting.ajaxInterceptor_rules[this.props.index].overrideResponseFunc = newValue
    setChromeStorage('ajaxInterceptor_rules', window.setting.ajaxInterceptor_rules)
  }

  render() {
    return (
      <>
        <Switch onChange={this.handleExpertSwitch} size="small" checked={this.state.isExpert}
                checkedChildren=" Advanced Mode" unCheckedChildren="Advanced Mode " />
        {
          !this.state.isExpert && (
            <div>
              <div className="replace-with">
                Replace Response With:
              </div>
              <MonacoEditor
                index={this.props.index}
                language="json"
                defaultValue={window.setting.ajaxInterceptor_rules[this.props.index].overrideTxt}
                examples={RESPONSE_SIMPLE_EXAMPLES}
                onEditorChange={this.handleOverrideTxtChange}
                languageSelectOptions={["json", "text"]}
              />
            </div>
          )
        }
        {
          this.state.isExpert && (
            <div>
              <Radio.Group value={this.state.editorValue} onChange={this.handleEditorRatioChange} className="replace-radio">
                <Radio.Button value={1}>Payload</Radio.Button>
                <Radio.Button value={2}>Headers</Radio.Button>
                <Radio.Button value={3}>Response</Radio.Button>
              </Radio.Group>
              {
                this.state.editorValue === 1 && (
                  <MonacoEditor
                    index={this.props.index}
                    language="javascript"
                    defaultValue={window.setting.ajaxInterceptor_rules[this.props.index].overridePayloadFunc}
                    examples={REQUEST_PAYLOAD_EXAMPLES}
                    onEditorChange={this.onPayloadEditorChange}
                    languageSelectOptions={["javascript"]}
                  />
                )
              }
              {
                this.state.editorValue === 2 && (
                  <div>
                    <MonacoEditor
                      index={this.props.index}
                      language="javascript"
                      defaultValue={window.setting.ajaxInterceptor_rules[this.props.index].overrideHeadersFunc}
                      examples={HEADERS_EXAMPLES}
                      onEditorChange={this.onHeadersEditorChange}
                      languageSelectOptions={["javascript"]}
                    />
                  </div>
                )
              }
              {
                this.state.editorValue === 3 && (
                  <div>
                    <MonacoEditor
                      index={this.props.index}
                      language="javascript"
                      defaultValue={window.setting.ajaxInterceptor_rules[this.props.index].overrideResponseFunc}
                      examples={RESPONSE_EXAMPLES}
                      onEditorChange={this.onResponseEditorChange}
                      languageSelectOptions={["javascript"]} // 如果之后支持多语言切换，还要存储当前语言
                    />
                  </div>
                )
              }
            </div>
          )
        }
      </>
    )
  }
}