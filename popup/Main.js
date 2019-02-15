import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import {Switch, Collapse, Input, Button} from 'antd';
const Panel = Collapse.Panel;
const TextArea = Input.TextArea;
import './Main.less';

class Main extends Component {
  state = {
    ajaxInterceptor_switchOn: false,
    ajaxInterceptor_rules: [],
  }

  componentDidMount() {
    chrome.storage && chrome.storage.sync.get(['ajaxInterceptor_switchOn', 'ajaxInterceptor_rules'], (result) => {
      if (result.ajaxInterceptor_switchOn) {
        this.set('ajaxInterceptor_switchOn', result.ajaxInterceptor_switchOn, false);
      }
      if (result.ajaxInterceptor_rules) {
        this.set('ajaxInterceptor_rules', result.ajaxInterceptor_rules, false);
      }
    });
  }

  set = (key, value, setStorage = true) => {
    this.setState({[key]: value});
    // chrome.tabs && chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    //   chrome.tabs.executeScript(
    //     tabs[0].id,
    //     {code: `postMessage({type: 'ajaxInterceptor', key: '${key}', value: ${JSON.stringify(value)}})`});
    // });
    window.opener.postMessage({type: 'ajaxInterceptor', key, value});
    setStorage && chrome.storage.sync.set({[key]: value});
  }

  handleMatchChange = (e, i) => {
    let newRules = this.state.ajaxInterceptor_rules.slice();
    newRules[i].match = e.target.value;
    this.set('ajaxInterceptor_rules', newRules);
  }

  handleOverrideTxtChange = (e, i) => {
    let newRules = this.state.ajaxInterceptor_rules.slice();
    newRules[i].overrideTxt = e.target.value;
    this.set('ajaxInterceptor_rules', newRules);
  }


  handleClickAdd = () => {
    let newRules = this.state.ajaxInterceptor_rules.slice();
    newRules.push({match: ''});
    this.setState({ajaxInterceptor_rules: newRules});
  }

  handleClickRemove = (e, i) => {
    e.stopPropagation();
    let newRules = [
      ...this.state.ajaxInterceptor_rules.slice(0, i),
      ...this.state.ajaxInterceptor_rules.slice(i + 1),
    ];
    this.setState({ajaxInterceptor_rules: newRules});
  }

  render() {

    return (
      <div className="main">
        <Switch
          checked={this.state.ajaxInterceptor_switchOn}
          onChange={() => {
            this.set('ajaxInterceptor_switchOn', !this.state.ajaxInterceptor_switchOn);
          }}
        />
        {this.state.ajaxInterceptor_rules.length > 0 ? (
          <Collapse style={{marginTop: '10px'}}>
            {this.state.ajaxInterceptor_rules.map(({match, overrideTxt}, i) => (
              <Panel
                key={i}
                header={
                  <div className="panel-header">
                    <Input
                      placeholder="regular expression"
                      style={{width: '79%'}}
                      value={match}
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
                <TextArea
                  style={{resize: 'none'}}
                  autosize={{minRows: 2, maxRows: 6}}
                  value={overrideTxt}
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


ReactDOM.render(
  <Main />,
  document.getElementById('main')
);