import React, {Component} from 'react';
import 'antd/dist/antd.css';
import {Switch, Collapse, Input, Button, Badge, Tooltip} from 'antd';
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
  constructor() {
    super();
    chrome.runtime.onMessage.addListener(({type, to, url, match}) => {
      if (type === 'ajaxInterceptor' && to === 'iframe') {
        const {interceptedRequests} = this.state;
        if (!interceptedRequests[match]) interceptedRequests[match] = [];

        const exits = interceptedRequests[match].some(obj => {
          if (obj.url === url) {
            obj.num++;
            return true;
          }
          return false;
        });
        
        if (!exits) {
          interceptedRequests[match].push({url, num: 1});
        }
        this.setState({interceptedRequests})
      }
    });

    chrome.runtime.sendMessage('eflgjndpaafdkcbblljjdiakmcpobilj', {type: 'ajaxInterceptor', to: 'background', iframeScriptLoaded: true});
  }

  state = {
    interceptedRequests: {}
  }

  set = (key, value) => {
    // 发送给background.js
    chrome.runtime.sendMessage('eflgjndpaafdkcbblljjdiakmcpobilj', {type: 'ajaxInterceptor', to: 'background', key, value});
    chrome.storage && chrome.storage.local.set({[key]: value});
  }

  forceUpdateDebouce = () => {
    clearTimeout(this.forceUpdateTimeout);
    this.forceUpdateTimeout = setTimeout(() => {
      this.forceUpdate();
    }, 1000);
  }

  handleMatchChange = (e, i) => {
    window.setting.ajaxInterceptor_rules[i].match = e.target.value;
    this.set('ajaxInterceptor_rules', window.setting.ajaxInterceptor_rules);

    this.forceUpdateDebouce();
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
    const {interceptedRequests} = this.state;
    const match = window.setting.ajaxInterceptor_rules[i].match;

    window.setting.ajaxInterceptor_rules = [
      ...window.setting.ajaxInterceptor_rules.slice(0, i),
      ...window.setting.ajaxInterceptor_rules.slice(i + 1),
    ];
    this.set('ajaxInterceptor_rules', window.setting.ajaxInterceptor_rules);

    delete interceptedRequests[match];
    this.setState({interceptedRequests})
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
        {window.setting.ajaxInterceptor_rules && window.setting.ajaxInterceptor_rules.length > 0 ? (
          <Collapse style={{marginTop: '10px'}}>
            {window.setting.ajaxInterceptor_rules.map(({match, overrideTxt}, i) => (
              <Panel
                key={match}
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
                      style={{marginLeft: '3.5%'}}
                    />
                  </div>
                }
              >
                <div className="replace-with">
                  Replace With:
                </div>
                <textarea
                  className="overrideTxt"
                  placeholder="replace with"
                  ref={ref => {
                    ref && adjustHieght(ref);
                  }}
                  style={{resize: 'none'}}
                  defaultValue={overrideTxt}
                  onChange={e => this.handleOverrideTxtChange(e, i)}
                />
                <div className="intercepted-requests">
                  Intercepted Requests:
                </div>
                <div className="intercepted">
                  {this.state.interceptedRequests[match] && this.state.interceptedRequests[match].map(({url, num}) => (
                    <Tooltip placement="top" title={url} key={url}>
                      <Badge
                        count={num}
                        style={{
                          backgroundColor: '#fff',
                          color: '#999',
                          boxShadow: '0 0 0 1px #d9d9d9 inset',
                          marginTop: '-3px',
                          marginRight: '4px'
                        }}
                      />
                      <span className="url">{url}</span>
                    </Tooltip>
                  ))}
                </div>
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