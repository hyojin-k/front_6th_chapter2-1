import React from 'react';

export interface SelectItemPropsType {
  children: React.ReactNode;
  className?: string;
}

const SelectItem: React.FC<SelectItemPropsType> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white border border-gray-200 p-8 overflow-y-auto ${className}`}>
      {children}
    </div>
  );
};

export default SelectItem;
