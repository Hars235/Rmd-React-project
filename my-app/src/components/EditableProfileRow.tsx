import React, { useState, useRef, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import '../pages/ProfilePage.css';

interface EditableProfileRowProps {
  label: string;
  value: string;
  onSave: (newValue: string) => void;
  placeholder?: string;
  isLast?: boolean;
}

const EditableProfileRow: React.FC<EditableProfileRowProps> = ({ 
  label, 
  value, 
  onSave, 
  placeholder = "Add details",
  isLast = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
    setTempValue(value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onSave(tempValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setTempValue(value);
    }
  };

  const displayValue = value.trim() || placeholder;
  const isPlaceholder = !value.trim();

  return (
    <div 
        className="rmd-field-row" 
        style={{ 
            cursor: 'pointer', 
            borderBottom: isLast ? 'none' : undefined,
            position: 'relative',
            transition: 'background-color 0.2s'
        }}
        onClick={!isEditing ? handleClick : undefined}
    >
      <span className="rmd-field-label">{label}</span>
      
      {isEditing ? (
        <input
            ref={inputRef}
            type="text"
            className="rmd-editable-input"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #3b82f6',
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none',
                color: '#334155',
                width: '100%'
            }}
        />
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
            <span className={`rmd-field-value ${isPlaceholder ? 'placeholder' : ''}`}>
                {displayValue}
            </span>
            <Pencil size={14} color="#94a3b8" style={{ marginLeft: '8px', opacity: 0.5 }} />
        </div>
      )}
    </div>
  );
};

export default EditableProfileRow;
