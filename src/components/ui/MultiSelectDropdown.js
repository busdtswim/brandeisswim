'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

/**
 * Multi-select dropdown component with checkboxes and search
 * @param {string} placeholder - Placeholder text
 * @param {Array} options - Array of option objects with value, label, and optional disabled
 * @param {Array} value - Array of selected values
 * @param {Function} onChange - Callback when selection changes
 * @param {boolean} disabled - Whether the dropdown is disabled
 * @param {string} className - Additional CSS classes
 */
export default function MultiSelectDropdown({
  placeholder = 'Select options...',
  options = [],
  value = [],
  onChange,
  disabled = false,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if all filtered options are selected
  const allFilteredSelected = filteredOptions.length > 0 && 
    filteredOptions.every(option => value.includes(option.value));

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle option selection
  const handleOptionToggle = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  // Handle select all toggle
  const handleSelectAllToggle = () => {
    if (allFilteredSelected) {
      // Deselect all filtered options
      const filteredValues = filteredOptions.map(option => option.value);
      const newValue = value.filter(v => !filteredValues.includes(v));
      onChange(newValue);
    } else {
      // Select all filtered options
      const filteredValues = filteredOptions.map(option => option.value);
      const newValue = [...new Set([...value, ...filteredValues])];
      onChange(newValue);
    }
  };

  // Get display text
  const getDisplayText = () => {
    if (value.length === 0) return placeholder;
    if (value.length === 1) {
      const option = options.find(opt => opt.value === value[0]);
      return option ? option.label : placeholder;
    }
    return `${value.length} selected`;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-3 py-2 text-left border border-gray-200 rounded-lg focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20 transition-all duration-200 flex items-center justify-between ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-300'
        }`}
      >
        <span className={`text-sm ${value.length === 0 ? 'text-gray-500' : 'text-gray-900'}`}>
          {getDisplayText()}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-hidden">
          {/* Search Box */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-pool-blue focus:ring-2 focus:ring-pool-blue/20"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {/* Select All Option */}
            {filteredOptions.length > 1 && (
              <div 
                onClick={handleSelectAllToggle}
                className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
              >
                <div className={`w-4 h-4 border-2 rounded flex items-center justify-center mr-3 ${
                  allFilteredSelected
                    ? 'bg-pool-blue border-pool-blue text-white'
                    : 'border-gray-300 bg-white'
                }`}>
                  {allFilteredSelected && <Check className="w-3 h-3" />}
                </div>
                <span className="text-sm font-medium text-gray-900">All</span>
              </div>
            )}

            {/* Individual Options */}
            {filteredOptions.map((option) => {
              const isSelected = value.includes(option.value);
              const isOptionDisabled = option.disabled || false;
              return (
                <div
                  key={option.value}
                  onClick={() => !isOptionDisabled && handleOptionToggle(option.value)}
                  className={`flex items-center px-3 py-2 ${
                    isOptionDisabled 
                      ? 'cursor-not-allowed opacity-60' 
                      : 'hover:bg-gray-50 cursor-pointer'
                  } ${
                    isSelected ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className={`w-4 h-4 border-2 rounded flex items-center justify-center mr-3 ${
                    isSelected
                      ? 'bg-pool-blue border-pool-blue text-white'
                      : 'border-gray-300 bg-white'
                  } ${isOptionDisabled ? 'opacity-50' : ''}`}>
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                  <span className={`text-sm ${isOptionDisabled ? 'text-gray-500' : 'text-gray-900'}`}>
                    {option.label}
                    {isOptionDisabled && <span className="ml-2 text-xs text-amber-600">(Permanent)</span>}
                  </span>
                </div>
              );
            })}

            {/* No Results */}
            {filteredOptions.length === 0 && (
              <div className="px-3 py-4 text-center text-sm text-gray-500">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 