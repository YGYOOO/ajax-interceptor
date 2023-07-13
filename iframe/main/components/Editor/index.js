import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Select, Dropdown, Icon, Menu } from 'antd'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution' // 代码高亮&提示
import 'monaco-editor/esm/vs/language/json/monaco.contribution' // 代码高亮&提示
import 'monaco-editor/esm/vs/editor/contrib/contextmenu/browser/contextmenu.js' // 右键显示菜单
import 'monaco-editor/esm/vs/editor/contrib/folding/browser/folding.js' // 折叠
import 'monaco-editor/esm/vs/editor/contrib/format/browser/formatActions.js' // 格式化代码
import 'monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestController.js' // 代码联想提示
import 'monaco-editor/esm/vs/editor/contrib/tokenization/browser/tokenization.js' // 代码联想提示
import './index.less'

const MonacoEditor = (props, ref) => {
  const editorRef = useRef(null)
  useImperativeHandle(ref, () => ({
    editorInstance: editor,
  }))
  const {
    languageSelectOptions = ['json', 'javascript'],
    examples = [{ egTitle: '', egText: '// Type here' }]
  } = props
  const [editor, setEditor] = useState(null)
  const [language, setLanguage] = useState(props.language || 'javascript')
  const containerRef = useRef(null)
  useEffect(() => {
    if (!editor) {
      const editor = monaco.editor.create(editorRef.current, {
        value: '',
        language,
        theme: 'vs-dark',
        scrollBeyondLastLine: false,
        tabSize: 2,
        minimap: {
          enabled: false
        }
      })
      editor.onDidChangeModelContent(function () {
        const newValue = editor.getValue()
        props.onEditorChange && props.onEditorChange(newValue)
      })
      const resizeObserver = new ResizeObserver(() => {
        editor.layout()
      })
      resizeObserver.observe(containerRef.current)
      setEditor(editor)
    } else {
      resizeObserver.unobserve(containerRef.current)
    }
  }, [])
  // 导入props的值，并格式化
  useEffect(() => {
    if (editor) {
      editor.getModel().setValue(props.defaultValue || '')
      setTimeout(() => {
        // 格式化代码
        formatDocumentAction()
      }, 300)
    }
  }, [editor, props.defaultValue])

  // 格式化代码
  const formatDocumentAction = () => {
    if (editor) editor.getAction('editor.action.formatDocument').run()
  }

  const onLanguageChange = (_language) => {
    if (editor) {
      setLanguage(_language)
      monaco.editor.setModelLanguage(editor.getModel(), _language) // 切换语言
    }
  }

  const onAddExampleClick = (eg) => {
    if (editor) {
      const { egText, egLanguage = 'javascript' } = eg
      editor.getModel().setValue(egText)
      if (egLanguage !== language)
      setLanguage(egLanguage)
      monaco.editor.setModelLanguage(editor.getModel(), egLanguage)
    }
  }

  const menu = (
    <Menu>
      {
        examples.map((eg, index) => <Menu.Item key={index}>
          <div onClick={() => onAddExampleClick(eg)}>{eg.egTitle}</div>
        </Menu.Item>)
      }
    </Menu>
  )

  return <div className="monaco-editor-container" id="monaco-editor-container" ref={containerRef}>
    <div className="monaco-editor-header">
      <Select
        size="small"
        value={language}
        onChange={onLanguageChange}
        className="language-select"
      >
        {
          languageSelectOptions.map((lang) => <Select.Option key={lang} value={lang}>{lang}</Select.Option>)
        }
      </Select>
      <div>
        {
          examples.length > 1 ? <Dropdown overlay={menu}>
            <a onClick={(e) => e.preventDefault()}>
              <span>
                Example
                <Icon type="down" className="down-button"/>
              </span>
            </a>
          </Dropdown> : <a
            title="Example Case"
            onClick={() => onAddExampleClick(examples[0].egText)}
          >
            Example
          </a>
        }
        <Icon type="align-left" onClick={formatDocumentAction} className="align-button"/>
      </div>
    </div>
    <div
      ref={editorRef}
      style={{
        height: 400,
        minHeight: 100,
        width: '100%'
      }}
    />
  </div>
}
export default React.memo(React.forwardRef(MonacoEditor))