import React, {Component} from 'react';
import 'antd/dist/antd.css';
import {Switch, Collapse, Input, Button} from 'antd';
const Panel = Collapse.Panel;
const TextArea = Input.TextArea;
import './Main.less';

const adjustHieght = ele => {
  ele.style.height = '1px';
  let height = 2 + ele.scrollHeight;
  if (height < 52) height = 52;
  else if (height > 177) height = 177;
  ele.style.height = `${height}px`;
}

export default class Main extends Component {
  set = (key, value) => {

    // 发送给background.js
    chrome.runtime.sendMessage('eflgjndpaafdkcbblljjdiakmcpobilj', {type: 'ajaxInterceptor', key, value});
    chrome.storage && chrome.storage.local.set({[key]: value});
  }

  handleMatchChange = (e, i) => {
    window.setting.ajaxInterceptor_rules[i].match = e.target.value;
    this.set('ajaxInterceptor_rules', window.setting.ajaxInterceptor_rules);
  }

  handleOverrideTxtChange = (e, i) => {
    adjustHieght(e.target);

    window.setting.ajaxInterceptor_rules[i].overrideTxt = e.target.value;
    this.set('ajaxInterceptor_rules', window.setting.ajaxInterceptor_rules);
  }


  handleClickAdd = () => {
    window.setting.ajaxInterceptor_rules.push({match: ''});
    this.forceUpdate();
  }

  handleClickRemove = (e, i) => {
    e.stopPropagation();
    window.setting.ajaxInterceptor_rules = [
      ...window.setting.ajaxInterceptor_rules.slice(0, i),
      ...window.setting.ajaxInterceptor_rules.slice(i + 1),
    ];
    this.set('ajaxInterceptor_rules', window.setting.ajaxInterceptor_rules);
    this.forceUpdate();
  }

  render() {

    return (
      <div className="main">
        <Switch
          defaultChecked={window.setting.ajaxInterceptor_switchOn}
          onChange={() => {
            this.set('ajaxInterceptor_switchOn', !window.setting.ajaxInterceptor_switchOn);
          }}
        />
        {window.setting.ajaxInterceptor_rules.length > 0 ? (
          <Collapse style={{marginTop: '10px'}}>
            {window.setting.ajaxInterceptor_rules.map(({match, overrideTxt}, i) => (
              <Panel
                key={i}
                header={
                  <div className="panel-header">
                    <Input
                      placeholder="regular expression"
                      style={{width: '79%'}}
                      defaultValue={match}
                      onClick={e => e.stopPropagation()}
                      onChange={e => this.handleMatchChange(e, i)}
                    />
                    <Button
                      type="primary"
                      shape="circle" 
                      icon="minus"
                      onClick={e => this.handleClickRemove(e, i)}
                      style={{marginLeft: '8px'}}
                    />
                  </div>
                }
              >
                <textarea
                  className="overrideTxt"
                  ref={ref => {
                    console.log(1)
                    adjustHieght(ref);
                  }}
                  style={{resize: 'none'}}
                  defaultValue={overrideTxt}
                  onChange={e => this.handleOverrideTxtChange(e, i)}
                />
              </Panel>
            ))}
          </Collapse> 
        ): <div />}
        <Button
          style={{marginTop: '10px'}}
          type="primary"
          shape="circle" 
          icon="plus"
          onClick={this.handleClickAdd}
        />
      </div>
    );
  }
}
