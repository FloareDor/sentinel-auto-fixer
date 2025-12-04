import React, { useState } from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'normal' | 'default';
}

export function Button({
  children,
  onClick,
  disabled = false,
  className = '',
  variant = 'normal'
}: ButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  const baseClasses = 'win95-ui px-4 py-1 text-xs cursor-pointer select-none inline-block';
  const stateClasses = isPressed
    ? 'win95-border-inset'
    : 'win95-border-raised';

  const variantClasses = variant === 'default'
    ? 'bg-win95-blue text-win95-white'
    : 'bg-win95-gray text-win95-black hover:bg-win95-blue hover:text-win95-white';

  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed'
    : '';

  return (
    <button
      className={`${baseClasses} ${stateClasses} ${variantClasses} ${disabledClasses} ${className}`}
      onClick={disabled ? undefined : onClick}
      onMouseDown={disabled ? undefined : handleMouseDown}
      onMouseUp={disabled ? undefined : handleMouseUp}
      onMouseLeave={disabled ? undefined : handleMouseLeave}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
