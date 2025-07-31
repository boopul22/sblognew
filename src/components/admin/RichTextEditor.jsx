import { useEffect, useRef, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const RichTextEditor = ({ value, onChange, placeholder = "Start writing..." }) => {
  const quillRef = useRef(null)
  const [editorValue, setEditorValue] = useState(value || '')

  useEffect(() => {
    setEditorValue(value || '')
  }, [value])

  const handleChange = (content, delta, source, editor) => {
    setEditorValue(content)
    onChange(content)
  }

  // Custom toolbar configuration for Hindi Shayari
  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean'],
        ['center-text', 'hindi-format'] // Custom buttons
      ],
      handlers: {
        'center-text': function() {
          const range = this.quill.getSelection()
          if (range) {
            this.quill.format('align', 'center')
          }
        },
        'hindi-format': function() {
          const range = this.quill.getSelection()
          if (range) {
            // Apply Hindi-specific formatting
            this.quill.format('align', 'center')
            this.quill.format('size', 'large')
          }
        }
      }
    },
    clipboard: {
      matchVisual: false // Preserve formatting when pasting
    }
  }

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'align', 'color', 'background',
    'code-block'
  ]

  // Custom CSS for Hindi text support
  const editorStyle = {
    minHeight: '400px',
    fontFamily: '"Noto Sans Devanagari", "Mangal", "Kruti Dev 010", Arial, sans-serif'
  }

  return (
    <div className="rich-text-editor">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={editorValue}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={editorStyle}
      />

      <div className="editor-help">
        <details>
          <summary>Formatting Tips</summary>
          <div className="help-content">
            <h4>For Hindi Shayari:</h4>
            <ul>
              <li><strong>Center Text:</strong> Use the center alignment button for verses</li>
              <li><strong>Line Breaks:</strong> Press Shift+Enter for line breaks within verses</li>
              <li><strong>Stanza Breaks:</strong> Press Enter twice for stanza separation</li>
              <li><strong>Emphasis:</strong> Use bold or italic for emphasis</li>
            </ul>
            <h4>Keyboard Shortcuts:</h4>
            <ul>
              <li><kbd>Ctrl+B</kbd> - Bold</li>
              <li><kbd>Ctrl+I</kbd> - Italic</li>
              <li><kbd>Ctrl+U</kbd> - Underline</li>
              <li><kbd>Ctrl+Shift+C</kbd> - Center align</li>
              <li><kbd>Ctrl+Z</kbd> - Undo</li>
              <li><kbd>Ctrl+Y</kbd> - Redo</li>
            </ul>
          </div>
        </details>
      </div>

      <style jsx="true" global="true">{`
        .rich-text-editor {
          position: relative;
        }

        .rich-text-editor .ql-editor {
          min-height: 400px;
          font-family: "Noto Sans Devanagari", "Mangal", "Kruti Dev 010", Arial, sans-serif;
          font-size: 16px;
          line-height: 1.6;
        }

        .rich-text-editor .ql-editor.ql-blank::before {
          font-style: italic;
          color: #adb5bd;
        }

        /* Hindi text specific styles */
        .rich-text-editor .ql-editor p {
          margin-bottom: 1em;
        }

        .rich-text-editor .ql-editor blockquote {
          border-left: 4px solid #1976d2;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 4px;
        }

        /* Custom toolbar styling */
        .rich-text-editor .ql-toolbar {
          border: 1px solid #ced4da;
          border-bottom: none;
          background: #f8f9fa;
        }

        .rich-text-editor .ql-container {
          border: 1px solid #ced4da;
          border-radius: 0 0 4px 4px;
        }

        .rich-text-editor .ql-toolbar .ql-formats {
          margin-right: 15px;
        }

        .rich-text-editor .ql-toolbar button {
          padding: 5px;
          margin: 2px;
        }

        .rich-text-editor .ql-toolbar button:hover {
          background: #e9ecef;
          border-radius: 3px;
        }

        .rich-text-editor .ql-toolbar button.ql-active {
          background: #1976d2;
          color: white;
          border-radius: 3px;
        }

        /* Custom button styles */
        .rich-text-editor .ql-toolbar button.ql-center-text::before {
          content: "⌘";
          font-weight: bold;
        }

        .rich-text-editor .ql-toolbar button.ql-hindi-format::before {
          content: "हि";
          font-weight: bold;
          font-family: "Noto Sans Devanagari", "Mangal", sans-serif;
        }

        /* Focus styles */
        .rich-text-editor .ql-container.ql-snow {
          border-color: #ced4da;
        }

        .rich-text-editor .ql-editor:focus {
          outline: none;
        }

        .rich-text-editor:focus-within .ql-container {
          border-color: #1976d2;
          box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .rich-text-editor .ql-toolbar {
            padding: 8px;
          }

          .rich-text-editor .ql-toolbar .ql-formats {
            margin-right: 10px;
          }

          .rich-text-editor .ql-editor {
            min-height: 300px;
            font-size: 14px;
          }
        }

        /* Help section styling */
        .editor-help {
          margin-top: 1rem;
          border: 1px solid #e9ecef;
          border-radius: 4px;
          background: #f8f9fa;
        }

        .editor-help summary {
          padding: 0.75rem;
          cursor: pointer;
          font-weight: 500;
          color: #495057;
          user-select: none;
        }

        .editor-help summary:hover {
          background: #e9ecef;
        }

        .help-content {
          padding: 0 0.75rem 0.75rem;
          border-top: 1px solid #e9ecef;
        }

        .help-content h4 {
          margin: 1rem 0 0.5rem 0;
          color: #212529;
          font-size: 0.9rem;
        }

        .help-content ul {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }

        .help-content li {
          margin-bottom: 0.25rem;
          font-size: 0.875rem;
          color: #6c757d;
        }

        .help-content kbd {
          background: #e9ecef;
          border: 1px solid #adb5bd;
          border-radius: 3px;
          padding: 2px 4px;
          font-size: 0.75rem;
          font-family: monospace;
        }

        /* Print styles */
        @media print {
          .rich-text-editor .ql-toolbar,
          .editor-help {
            display: none;
          }

          .rich-text-editor .ql-container {
            border: none;
          }
        }
      `}</style>
    </div>
  )
}

export default RichTextEditor
