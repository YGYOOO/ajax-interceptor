import React, { Component } from 'react'
import { Switch, Radio } from 'antd'
// import ReactJson from 'react-json-view'
import MonacoEditor from '../Editor'
import { REQUEST_PAYLOAD_EXAMPLES, HEADERS_EXAMPLES, RESPONSE_EXAMPLES } from '../Editor/examples'
import { setChromeStorage } from '../../utils'

import './index.less'

export default class Index extends Component {
  constructor(props) {
    super()
    this.state = {
      showJSONEditor: false,
      txt: props.defaultValue,
      src: null,
      editorValue: window.setting.ajaxInterceptor_rules[props.index].editorValue || 3, // 1: payload, 2: headers, 3: response
    }

    try {
      let src = JSON.parse(props.defaultValue)
      if (src && typeof src === 'object') {
        this.state.src = src
      }
    } catch (e) {

    }
  }


  // componentDidUpdate(prevProps, { showJSONEditor }) {
  //   if (showJSONEditor !== this.state.showJSONEditor) {
  //     this.props.updateAddBtnTop()
  //   }
  // }

  handleOverrideTxtChange = (txt) => {
    let src
    try {
      src = JSON.parse(txt)
      if (!(src && typeof src === 'object')) {
        src = null
      }
    } catch (e) {

    }
    this.setState({ txt, src })

    window.setting.ajaxInterceptor_rules[this.props.index].overrideTxt = txt
    this.props.set('ajaxInterceptor_rules', window.setting.ajaxInterceptor_rules)
  }

  handleJSONEditorChange = ({ updated_src: src }) => {
    let txt = JSON.stringify(src)
    this.setState({ txt, src })

    window.setting.ajaxInterceptor_rules[this.props.index].overrideTxt = txt
    this.props.set('ajaxInterceptor_rules', window.setting.ajaxInterceptor_rules)
  }

  handleJSONEditorSwitch = showJSONEditor => {
    this.setState({ showJSONEditor })
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
    window.setting.ajaxInterceptor_rules[this.props.index].overrideTxt = newValue
    setChromeStorage('ajaxInterceptor_rules', window.setting.ajaxInterceptor_rules)
  }

  render() {
    return (
      <>
        {/*<div className="replace-with">*/}
        {/*  Replace With:*/}
        {/*</div>*/}
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
                language="json"
                defaultValue={window.setting.ajaxInterceptor_rules[this.props.index].overrideTxt}
                examples={RESPONSE_EXAMPLES}
                onEditorChange={this.onResponseEditorChange}
                languageSelectOptions={["json"]} // 如果之后支持多语言切换，还要存储当前语言
              />
            </div>
          )
        }
            {/*// (*/}
            {/*//   <div>*/}
            {/*//     <textarea*/}
            {/*//       className="overrideTxt"*/}
            {/*//       style={{ resize: 'none' }}*/}
            {/*//       value={this.state.txt}*/}
            {/*//       onChange={e => this.handleOverrideTxtChange(e.target.value)}*/}
            {/*//     />*/}
            {/*//     <Switch style={{ marginTop: '6px' }} onChange={this.handleJSONEditorSwitch} checkedChildren="JSON Editor"*/}
            {/*//             unCheckedChildren="JSON Editor" size="small"/>*/}
            {/*//     {this.state.showJSONEditor && (*/}
            {/*//       this.state.src ?*/}
            {/*//         <div className="JSONEditor">*/}
            {/*//           <ReactJson*/}
            {/*//             name={false}*/}
            {/*//             collapsed*/}
            {/*//             collapseStringsAfterLength={12}*/}
            {/*//             src={this.state.src}*/}
            {/*//             onEdit={this.handleJSONEditorChange}*/}
            {/*//             onAdd={this.handleJSONEditorChange}*/}
            {/*//             onDelete={this.handleJSONEditorChange}*/}
            {/*//             displayDataTypes={false}*/}
            {/*//           />*/}
            {/*//           <MonacoEditor*/}
            {/*//             updateAddBtnTop={this.props.updateAddBtnTop}*/}
            {/*//             index={this.props.index}*/}
            {/*//             defaultFunc={this.props.defaultFunc}*/}
            {/*//             language="json"*/}
            {/*//             onChange={console.log(11111)}*/}
            {/*//           />*/}
            {/*//         </div> : <div className="JSONEditor Invalid">Invalid JSON</div>*/}
            {/*//     )}*/}
            {/*//   </div>*/}
            {/*// )*/}
      </>
    )
  }
}