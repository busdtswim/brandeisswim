'use client';

import React, { useState, useRef, useEffect } from 'react';

const SimpleHtmlEditor = ({
  value,
  onChange,
  placeholder = 'Start typing...',
  className = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const editorRef = useRef(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  // Set up mutation observer to track content changes
  useEffect(() => {
    if (!isEditing || !editorRef.current) return;

    const element = editorRef.current;
    let updateTimeout;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          const newValue = element.innerHTML;
          setEditValue(newValue);
          // Debounce the onChange call to avoid too many updates
          clearTimeout(updateTimeout);
          updateTimeout = setTimeout(() => {
            onChange(newValue);
          }, 300);
        }
      });
    });

    observer.observe(element, {
      childList: true,
      characterData: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
    };
  }, [isEditing, onChange]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(value);
    // Set the content after the component has rendered
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = value;
      }
    }, 0);
  };

  const handleSave = () => {
    setIsEditing(false);
    onChange(editValue);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Simple text formatting using document.execCommand (works reliably for basic formatting)
  const formatText = (command) => {
    document.execCommand(command, false, null);
    
    // Update the value after formatting
    if (editorRef.current) {
      setEditValue(editorRef.current.innerHTML);
    }
  };

  // Change text size
  const changeTextSize = (size) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    
    if (range.collapsed) {
      // No text selected, insert a span with the size
      const span = document.createElement('span');
      span.style.fontSize = size;
      span.textContent = 'Text';
      range.insertNode(span);
      range.setStart(span, 0);
      range.setEnd(span, 0);
    } else {
      // Text is selected, wrap it in a span with the size
      const span = document.createElement('span');
      span.style.fontSize = size;
      const fragment = range.extractContents();
      span.appendChild(fragment);
      range.insertNode(span);
    }

    // Update selection and value
    selection.removeAllRanges();
    selection.addRange(range);
    if (editorRef.current) {
      setEditValue(editorRef.current.innerHTML);
    }
  };

  const ToolbarButton = ({ onClick, children, title, active = false }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        active ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
      }`}
    >
      {children}
    </button>
  );

  if (!isEditing) {
    return (
      <div className={`border rounded-lg p-3 min-h-[120px] cursor-pointer hover:bg-gray-50 transition-colors ${className}`}>
        <div
          onClick={handleEdit}
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: value || `<span class="text-gray-400">${placeholder}</span>` }}
        />
        <div className="mt-2 text-xs text-gray-500">
          Click to edit • Ctrl+Enter to save • Esc to cancel
        </div>
      </div>
    );
  }

  return (
    <div className={`border rounded-lg ${className}`}>
      {/* Toolbar - Basic formatting + text size */}
      <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
        <ToolbarButton onClick={() => formatText('bold')} title="Bold">
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton onClick={() => formatText('italic')} title="Italic">
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton onClick={() => formatText('underline')} title="Underline">
          <u>U</u>
        </ToolbarButton>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        <ToolbarButton onClick={() => changeTextSize('12px')} title="Small Text">
          <span className="text-xs">S</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => changeTextSize('16px')} title="Normal Text">
          <span className="text-sm">N</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => changeTextSize('20px')} title="Large Text">
          <span className="text-base">L</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => changeTextSize('24px')} title="Extra Large Text">
          <span className="text-lg">XL</span>
        </ToolbarButton>
      </div>
      
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="p-3 min-h-[120px] focus:outline-none prose prose-sm max-w-none"
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning
      />
      
      {/* Action Buttons */}
      <div className="border-t bg-gray-50 p-2 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          Ctrl+Enter to save • Esc to cancel
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleHtmlEditor; 