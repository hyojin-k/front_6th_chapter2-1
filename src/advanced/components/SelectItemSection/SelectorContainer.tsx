import React from 'react';

export interface SelectorContainerPropsType {
  children: React.ReactNode;
  className?: string;
}

const SelectorContainer: React.FC<SelectorContainerPropsType> = ({ children, className = '' }) => {
  return <div className={`mb-6 pb-6 border-b border-gray-200 ${className}`}>{children}</div>;
};

export default SelectorContainer;
