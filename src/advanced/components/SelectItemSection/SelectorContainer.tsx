import React from 'react';

export interface SelectorContainerPropsType {
  children: React.ReactNode;
}

const SelectorContainer: React.FC<SelectorContainerPropsType> = ({ children }) => {
  return <div className="mb-6 pb-6 border-b border-gray-200">{children}</div>;
};

export default SelectorContainer;
