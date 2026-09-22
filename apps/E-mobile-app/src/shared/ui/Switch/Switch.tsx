// src/shared/ui/Switch.tsx
import React, { useId } from 'react';
import './NeoSwitch.css'; // Import file CSS vừa tạo

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  disabled = false,
  className = '',
}) => {
  // Tạo ID duy nhất cho mỗi switch để input và label liên kết đúng
  const uniqueId = useId(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onCheckedChange(e.target.checked);
    }
  };

  return (
    <div className={`neo-toggle-container ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <input
        className="neo-toggle-input"
        id={uniqueId}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      
      <label className="neo-toggle" htmlFor={uniqueId}>
        <div className="neo-track">
          <div className="neo-background-layer"></div>
          <div className="neo-grid-layer"></div>
          <div className="neo-spectrum-analyzer">
            <div className="neo-spectrum-bar"></div>
            <div className="neo-spectrum-bar"></div>
            <div className="neo-spectrum-bar"></div>
            <div className="neo-spectrum-bar"></div>
            <div className="neo-spectrum-bar"></div>
          </div>
          <div className="neo-track-highlight"></div>
        </div>

        <div className="neo-thumb">
          <div className="neo-thumb-ring"></div>
          <div className="neo-thumb-core">
            <div className="neo-thumb-icon">
              <div className="neo-thumb-wave"></div>
              <div className="neo-thumb-pulse"></div>
            </div>
          </div>
        </div>

        <div className="neo-gesture-area"></div>

        <div className="neo-interaction-feedback">
          <div className="neo-ripple"></div>
          <div className="neo-progress-arc"></div>
        </div>

        {/* Phần Status Text dưới nút switch (Optional: Có thể bỏ nếu thấy rối trong bảng) */}
        <div className="neo-status">
          <div className="neo-status-indicator">
            <div className="neo-status-dot"></div>
            {/* Dùng data-status để CSS lấy nội dung */}
            <div className="neo-status-text" data-status={checked ? "ON" : "OFF"}></div>
          </div>
        </div>
      </label>
    </div>
  );
};