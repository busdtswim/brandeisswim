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

  const insertText = (text, tag = '') => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const element = tag ? document.createElement(tag) : document.createTextNode(text);
      
      if (tag) {
        element.textContent = text;
      }
      
      range.deleteContents();
      range.insertNode(element);
      range.collapse(false);
      
      // The mutation observer will handle the update
      if (editorRef.current) {
        setEditValue(editorRef.current.innerHTML);
      }
    }
  };

  const formatText = (command, value) => {
    document.execCommand(command, false, value);
    // The mutation observer will handle the update
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
      {/* Toolbar */}
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
        
        <ToolbarButton onClick={() => formatText('insertUnorderedList')} title="Bullet List">
          • List
        </ToolbarButton>
        <ToolbarButton onClick={() => formatText('insertOrderedList')} title="Numbered List">
          1. List
        </ToolbarButton>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        <ToolbarButton onClick={() => insertText('', 'h1')} title="Heading 1">
          H1
        </ToolbarButton>
        <ToolbarButton onClick={() => insertText('', 'h2')} title="Heading 2">
          H2
        </ToolbarButton>
        <ToolbarButton onClick={() => insertText('', 'h3')} title="Heading 3">
          H3
        </ToolbarButton>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        <ToolbarButton onClick={() => formatText('createLink', prompt('Enter URL:'))} title="Insert Link">
          🔗
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