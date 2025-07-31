import React from 'react';

export interface SelectItemPropsType {
  children: React.ReactNode;
}

const SelectItem: React.FC<SelectItemPropsType> = ({ children }) => {
  return <div className="bg-white border border-gray-200 p-8 overflow-y-auto">{children}</div>;
};

export default SelectItem;
