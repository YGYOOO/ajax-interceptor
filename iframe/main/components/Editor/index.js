import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Select, Dropdown, Icon, Menu } from 'antd'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
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
  const [dropVisible, setDropVisible] = useState(true)
  const containerRef = useRef(null)
  useEffect(() => {
    if (!editor) {
      monaco.languages.register({ id: 'text' })
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

  // 进入页面展示下拉框
  const visibleTimeout = useRef(null)
  useEffect(() => {
    visibleTimeout.current = setTimeout(() => {
      handleVisibleChange(false)
    }, 800)
    return () => {
      if (visibleTimeout) {
        clearTimeout(visibleTimeout.current)
        visibleTimeout.current = null
      }
    }
  }, [])
  const handleVisibleChange = function (newVal) {
    if (visibleTimeout.current) {
      clearTimeout(visibleTimeout.current)
      visibleTimeout.current = null
    }
    setDropVisible(newVal)
  }

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
      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
        {
          examples.length > 1 ? <Dropdown overlay={menu} visible={dropVisible} trigger={['click', 'hover']}
                                          onVisibleChange={handleVisibleChange}>
            <a onClick={(e) => e.preventDefault()}>
              <div className="border-button">
                <span>Example</span>
                <Icon type="down" className="down-icon"/>
              </div>
            </a>
          </Dropdown> : <div className="border-button"
            onClick={() => onAddExampleClick(examples[0])}
          >
            <span>Example</span>
          </div>
        }

        <div className="border-button" onClick={formatDocumentAction}>
          <span>Format</span>
        </div>
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